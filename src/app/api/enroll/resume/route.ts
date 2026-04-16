import crypto from "crypto";
import { prisma } from "../../../lib/prisma";
import {
  getPaystackServerConfig,
  initializePaystackTransaction,
} from "../../../lib/paystack";

export const runtime = "nodejs";

function generateReference() {
  return `720D-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return Response.json({ ok: false, error: "Empty request body" }, { status: 400 });
    }

    const data = JSON.parse(rawBody);
    const rawEmail = String(data?.email || "").trim();
    const rawPhone = String(data?.phone || "").trim();
    const rawReference = String(data?.reference || "").trim();

    const normalizedEmail = rawEmail.toLowerCase();
    const normalizedPhone = rawPhone.replace(/[^+\d]/g, "");

    if (!rawReference && (!normalizedEmail || !normalizedPhone)) {
      return Response.json(
        {
          ok: false,
          error: "Provide either your payment reference or both email and phone.",
        },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        OR: [
          rawReference ? { paystackReference: rawReference } : undefined,
          normalizedEmail && normalizedPhone
            ? { AND: [{ email: normalizedEmail }, { phone: normalizedPhone }] }
            : undefined,
          normalizedEmail && normalizedPhone
            ? { AND: [{ email: rawEmail }, { phone: rawPhone }] }
            : undefined,
        ].filter(Boolean) as never[],
      },
    });

    if (!application) {
      return Response.json(
        { ok: false, error: "We could not find an application with those details." },
        { status: 404 }
      );
    }

    const applicationSummary = {
      programTitle: application.programTitle,
      cohort: application.cohort,
    };

    if (["paid_full", "paid_deposit", "enrolled"].includes(application.status)) {
      return Response.json({
        ok: true,
        data: {
          status: application.status,
          message: "Your payment has already been confirmed. You're all set.",
          application: applicationSummary,
        },
      });
    }

    if (application.paymentPlan === "scholarship") {
      return Response.json({
        ok: true,
        data: {
          status: application.status,
          message: "Your scholarship request is under review. Admissions will follow up.",
          application: applicationSummary,
        },
      });
    }

    const paystackConfig = getPaystackServerConfig();
    if (!paystackConfig.ok) {
      console.error("Resume enrollment Paystack configuration error:", paystackConfig.message);
      return Response.json(
        {
          ok: false,
          error:
            process.env.NODE_ENV === "production"
              ? paystackConfig.publicMessage
              : paystackConfig.message,
        },
        { status: 500 }
      );
    }

    const reference = generateReference();
    const paystackResult = await initializePaystackTransaction({
      email: application.email,
      amount: application.amountDue * 100,
      reference,
      requestOrigin: request.headers.get("origin"),
      config: paystackConfig,
      metadata: {
        applicationId: application.id,
        program: application.program,
        location: application.location,
        cohort: application.cohort,
        paymentPlan: application.paymentPlan,
        resume: true,
      },
    });

    if (!paystackResult.ok) {
      console.error("Resume enrollment payment initialization error:", {
        applicationId: application.id,
        message: paystackResult.message,
        status: paystackResult.status,
        warnings: paystackResult.warnings,
      });

      return Response.json(
        { ok: false, error: "Unable to initialise payment at this time." },
        { status: paystackResult.configError ? 500 : 502 }
      );
    }

    if (paystackResult.warnings.length) {
      console.warn("Resume enrollment payment warnings:", {
        applicationId: application.id,
        warnings: paystackResult.warnings,
      });
    }

    await prisma.application.update({
      where: { id: application.id },
      data: {
        status: "awaiting_payment",
        paystackReference: paystackResult.data.reference,
        paystackAccessCode: paystackResult.data.access_code,
        updatedAt: new Date(),
      },
    });

    return Response.json({
      ok: true,
      data: {
        status: "awaiting_payment",
        application: applicationSummary,
        payment: {
          authorization_url: paystackResult.data.authorization_url,
          reference: paystackResult.data.reference,
        },
      },
    });
  } catch (error) {
    console.error("Resume enrollment error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Resume service unavailable. Please try again.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
