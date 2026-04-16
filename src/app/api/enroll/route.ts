import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import {
  getPaystackServerConfig,
  initializePaystackTransaction,
} from "../../lib/paystack";
import {
  calculateAmountDue,
  PaymentPlan,
  programs as staticPrograms,
  locations as staticLocations,
  cohorts as staticCohorts,
} from "../../lib/programs";

export const runtime = "nodejs";

function generateReference() {
  return `720D-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const mongoUri = process.env.MONGODB_URI || "";
    if (
      !mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://")
    ) {
      return Response.json(
        {
          ok: false,
          error:
            "Invalid MONGODB_URI. It must start with mongodb:// or mongodb+srv:// (no quotes).",
        },
        { status: 500 },
      );
    }

    const rawBody = await request.text();
    if (!rawBody) {
      return Response.json(
        { ok: false, error: "Empty request body" },
        { status: 400 },
      );
    }
    const data = JSON.parse(rawBody);
    const {
      fullName,
      email,
      phone,
      program,
      location,
      cohort,
      paymentPlan,
      hearAbout,
    } = data || {};

    const fullNameValue = String(fullName || "").trim();
    const rawEmail = String(email || "").trim();
    const rawPhone = String(phone || "").trim();
    const normalizedEmail = rawEmail.toLowerCase();
    const normalizedPhone = rawPhone.replace(/[^+\d]/g, "");

    if (
      !fullNameValue ||
      !normalizedEmail ||
      !normalizedPhone ||
      !program ||
      !location ||
      !cohort ||
      !paymentPlan
    ) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["deposit", "full", "scholarship"].includes(paymentPlan)) {
      return Response.json(
        { ok: false, error: "Invalid payment plan" },
        { status: 400 },
      );
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { email: rawEmail },
          { phone: normalizedPhone },
          { phone: rawPhone },
        ],
      },
    });

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { email: rawEmail },
          { phone: normalizedPhone },
          { phone: rawPhone },
        ],
      },
    });

    if (existingApplication || existingStudent) {
      return Response.json(
        {
          ok: false,
          error:
            "An application already exists with this email or phone number.",
        },
        { status: 409 },
      );
    }

    const selectedProgram =
      (await prisma.program
        .findFirst({ where: { slug: program } })
        .catch(() => null)) ||
      staticPrograms.find((item) => item.slug === program);
    if (!selectedProgram) {
      return Response.json(
        { ok: false, error: "Invalid program selection" },
        { status: 400 },
      );
    }

    const selectedLocation =
      (await prisma.location
        .findFirst({ where: { code: location } })
        .catch(() => null)) ||
      (await prisma.location
        .findFirst({ where: { id: location } })
        .catch(() => null)) ||
      staticLocations.find((item) => item.id === location);
    if (!selectedLocation) {
      return Response.json(
        { ok: false, error: "Invalid location selection" },
        { status: 400 },
      );
    }

    const selectedCohort =
      (await prisma.cohort
        .findFirst({ where: { code: cohort } })
        .catch(() => null)) ||
      (await prisma.cohort
        .findFirst({ where: { id: cohort } })
        .catch(() => null)) ||
      staticCohorts.find((item) => item.id === cohort);
    if (!selectedCohort) {
      return Response.json(
        { ok: false, error: "Invalid cohort selection" },
        { status: 400 },
      );
    }

    const locationCode =
      (selectedLocation as { code?: string }).code || location;
    const cohortCode = (selectedCohort as { code?: string }).code || cohort;

    const baseTuition =
      selectedLocation.mode === "online"
        ? selectedProgram.onlineTuition
        : selectedProgram.onsiteTuition;
    const amountDue = calculateAmountDue(
      baseTuition,
      paymentPlan as PaymentPlan,
    );
    const depositAmount = calculateAmountDue(baseTuition, "deposit");
    const reference = generateReference();
    const requiresPayment = amountDue > 0;
    const paystackConfig = requiresPayment ? getPaystackServerConfig() : null;

    if (paystackConfig && !paystackConfig.ok) {
      console.error("Enrollment Paystack configuration error:", paystackConfig.message);
      return Response.json(
        {
          ok: false,
          error:
            process.env.NODE_ENV === "production"
              ? paystackConfig.publicMessage
              : paystackConfig.message,
        },
        { status: 500 },
      );
    }

    const application = {
      fullName: fullNameValue,
      email: normalizedEmail,
      phone: normalizedPhone,
      program: selectedProgram.slug,
      programTitle: selectedProgram.title,
      school: selectedProgram.school,
      location: locationCode,
      cohort: cohortCode,
      paymentPlan,
      baseTuition,
      amountDue,
      balanceDue: paymentPlan === "deposit" ? baseTuition - depositAmount : 0,
      hearAbout: hearAbout || null,
      status:
        paymentPlan === "scholarship" ? "scholarship_requested" : "submitted",
      paystackReference: null,
      paystackAccessCode: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdApplication = await prisma.application.create({
      data: application,
    });
    const applicationId = createdApplication.id;

    let payment: {
      authorization_url: string;
      access_code: string;
      reference: string;
    } | null = null;

    if (requiresPayment && paystackConfig?.ok) {
      const paystackResult = await initializePaystackTransaction({
        email: normalizedEmail,
        amount: amountDue * 100,
        reference,
        requestOrigin: request.headers.get("origin"),
        config: paystackConfig,
        metadata: {
          applicationId,
          program: selectedProgram.slug,
          location: locationCode,
          cohort: cohortCode,
          paymentPlan,
        },
      });

      if (!paystackResult.ok) {
        console.error("Enrollment payment initialization error:", {
          applicationId,
          message: paystackResult.message,
          status: paystackResult.status,
          warnings: paystackResult.warnings,
        });

        return Response.json(
          {
            ok: false,
            error:
              "Application saved, but we could not create your payment link right now. Please use Resume Application shortly.",
            canResume: true,
            applicationId,
          },
          { status: paystackResult.configError ? 500 : 502 },
        );
      }

      if (paystackResult.warnings.length) {
        console.warn("Enrollment payment initialization warnings:", {
          applicationId,
          warnings: paystackResult.warnings,
        });
      }

      payment = {
        authorization_url: paystackResult.data.authorization_url,
        access_code: paystackResult.data.access_code,
        reference: paystackResult.data.reference,
      };

      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paystackReference: paystackResult.data.reference,
          paystackAccessCode: paystackResult.data.access_code,
          status: "awaiting_payment",
          updatedAt: new Date(),
        },
      });
    }

    return Response.json({ ok: true, applicationId, payment });
  } catch (error) {
    console.error("Enrollment request error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Enrollment service unavailable. Please try again.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
