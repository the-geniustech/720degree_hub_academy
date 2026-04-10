import crypto from "crypto";
import { prisma } from "../../../lib/prisma";

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

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return Response.json(
        { ok: false, error: "Payment service is not configured. Please contact admissions." },
        { status: 400 }
      );
    }

    const reference = generateReference();
    const origin = request.headers.get("origin");
    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL || (origin ? `${origin}/payment/verify` : undefined);

    const payload: Record<string, unknown> = {
      email: application.email,
      amount: application.amountDue * 100,
      reference,
      metadata: {
        applicationId: application.id,
        program: application.program,
        location: application.location,
        cohort: application.cohort,
        paymentPlan: application.paymentPlan,
        resume: true,
      },
    };

    if (callbackUrl) {
      payload.callback_url = callbackUrl;
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const paystackData = await paystackResponse.json();
    if (!paystackResponse.ok || !paystackData.status) {
      return Response.json(
        { ok: false, error: "Unable to initialise payment at this time." },
        { status: 502 }
      );
    }

    await prisma.application.update({
      where: { id: application.id },
      data: {
        status: "awaiting_payment",
        paystackReference: paystackData.data.reference,
        paystackAccessCode: paystackData.data.access_code,
        updatedAt: new Date(),
      },
    });

    return Response.json({
      ok: true,
      data: {
        status: "awaiting_payment",
        application: applicationSummary,
        payment: {
          authorization_url: paystackData.data.authorization_url,
          reference: paystackData.data.reference,
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
