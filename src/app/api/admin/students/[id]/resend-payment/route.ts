import crypto from "crypto";
import { prisma } from "../../../../../lib/prisma";
import {
  getPaystackServerConfig,
  initializePaystackTransaction,
} from "../../../../../lib/paystack";
import { authorizeAdmin, logActivity } from "../../../_auth";

export const runtime = "nodejs";

function generateReference() {
  return `720D-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await authorizeAdmin(request, "admin");
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return Response.json({ ok: false, error: "Student not found" }, { status: 404 });
    }

    if (!student.applicationId) {
      return Response.json(
        { ok: false, error: "Student is not linked to an application." },
        { status: 400 },
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: student.applicationId },
    });

    if (!application) {
      return Response.json(
        { ok: false, error: "Application record not found." },
        { status: 404 },
      );
    }

    if (["paid_full", "paid_deposit", "enrolled"].includes(application.status)) {
      return Response.json(
        { ok: false, error: "Payment already confirmed for this application." },
        { status: 409 },
      );
    }

    const paystackConfig = getPaystackServerConfig();
    if (!paystackConfig.ok) {
      console.error("Admin resend payment Paystack configuration error:", paystackConfig.message);
      return Response.json(
        { ok: false, error: "Paystack is not configured correctly." },
        { status: 400 },
      );
    }

    const amountDue = application.amountDue;
    if (!amountDue || amountDue <= 0) {
      return Response.json(
        { ok: false, error: "No outstanding payment amount for this application." },
        { status: 400 },
      );
    }

    const reference = generateReference();
    const paystackResult = await initializePaystackTransaction({
      email: application.email,
      amount: amountDue * 100,
      reference,
      requestOrigin: request.headers.get("origin"),
      config: paystackConfig,
      metadata: {
        applicationId: application.id,
        program: application.program,
        location: application.location,
        cohort: application.cohort,
        paymentPlan: application.paymentPlan,
        resend: true,
      },
    });

    if (!paystackResult.ok) {
      console.error("Admin resend payment initialization error:", {
        applicationId: application.id,
        message: paystackResult.message,
        status: paystackResult.status,
        warnings: paystackResult.warnings,
      });

      return Response.json(
        { ok: false, error: "Unable to initialise payment at this time." },
        { status: paystackResult.configError ? 500 : 502 },
      );
    }

    if (paystackResult.warnings.length) {
      console.warn("Admin resend payment warnings:", {
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

    await prisma.student.update({
      where: { id: student.id },
      data: {
        paystackReference: paystackResult.data.reference,
        updatedAt: new Date(),
      },
    });

    await logActivity({
      session: auth.session,
      action: "student.payment_resend",
      entityType: "student",
      entityId: student.id,
      metadata: {
        reference: paystackResult.data.reference,
        amount: amountDue,
      },
    });

    return Response.json({
      ok: true,
      data: {
        message: "A fresh payment link has been generated.",
        payment: {
          authorization_url: paystackResult.data.authorization_url,
          reference: paystackResult.data.reference,
        },
      },
    });
  } catch (error) {
    console.error("Admin resend payment error:", error);
    return Response.json(
      { ok: false, error: "Unable to resend payment link." },
      { status: 500 },
    );
  }
}
