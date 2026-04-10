import crypto from "crypto";
import { prisma } from "../../../../../lib/prisma";
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

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return Response.json(
        { ok: false, error: "Paystack is not configured." },
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
    const origin = request.headers.get("origin");
    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL || (origin ? `${origin}/payment/verify` : undefined);

    const payload: Record<string, unknown> = {
      email: application.email,
      amount: amountDue * 100,
      reference,
      metadata: {
        applicationId: application.id,
        program: application.program,
        location: application.location,
        cohort: application.cohort,
        paymentPlan: application.paymentPlan,
        resend: true,
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
        { status: 502 },
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

    await prisma.student.update({
      where: { id: student.id },
      data: {
        paystackReference: paystackData.data.reference,
        updatedAt: new Date(),
      },
    });

    await logActivity({
      session: auth.session,
      action: "student.payment_resend",
      entityType: "student",
      entityId: student.id,
      metadata: {
        reference: paystackData.data.reference,
        amount: amountDue,
      },
    });

    return Response.json({
      ok: true,
      data: {
        message: "A fresh payment link has been generated.",
        payment: {
          authorization_url: paystackData.data.authorization_url,
          reference: paystackData.data.reference,
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

