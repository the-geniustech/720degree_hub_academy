import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import {
  calculateAmountDue,
  PaymentPlan,
  programs as staticPrograms,
  locations as staticLocations,
  cohorts as staticCohorts,
} from '../../lib/programs';

export const runtime = 'nodejs';

function generateReference() {
  return `720D-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const mongoUri = process.env.MONGODB_URI || '';
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      return Response.json(
        {
          ok: false,
          error:
            'Invalid MONGODB_URI. It must start with mongodb:// or mongodb+srv:// (no quotes).',
        },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    if (!rawBody) {
      return Response.json({ ok: false, error: 'Empty request body' }, { status: 400 });
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

    const fullNameValue = String(fullName || '').trim();
    const rawEmail = String(email || '').trim();
    const rawPhone = String(phone || '').trim();
    const normalizedEmail = rawEmail.toLowerCase();
    const normalizedPhone = rawPhone.replace(/[^+\d]/g, '');

    if (
      !fullNameValue ||
      !normalizedEmail ||
      !normalizedPhone ||
      !program ||
      !location ||
      !cohort ||
      !paymentPlan
    ) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!['deposit', 'full', 'scholarship'].includes(paymentPlan)) {
      return Response.json({ ok: false, error: 'Invalid payment plan' }, { status: 400 });
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
          error: 'An application already exists with this email or phone number.',
        },
        { status: 409 }
      );
    }

    const selectedProgram =
      (await prisma.program.findFirst({ where: { slug: program } }).catch(() => null)) ||
      staticPrograms.find((item) => item.slug === program);
    if (!selectedProgram) {
      return Response.json({ ok: false, error: 'Invalid program selection' }, { status: 400 });
    }

    const selectedLocation =
      (await prisma.location.findFirst({ where: { code: location } }).catch(() => null)) ||
      (await prisma.location.findFirst({ where: { id: location } }).catch(() => null)) ||
      staticLocations.find((item) => item.id === location);
    if (!selectedLocation) {
      return Response.json({ ok: false, error: 'Invalid location selection' }, { status: 400 });
    }

    const selectedCohort =
      (await prisma.cohort.findFirst({ where: { code: cohort } }).catch(() => null)) ||
      (await prisma.cohort.findFirst({ where: { id: cohort } }).catch(() => null)) ||
      staticCohorts.find((item) => item.id === cohort);
    if (!selectedCohort) {
      return Response.json({ ok: false, error: 'Invalid cohort selection' }, { status: 400 });
    }

    const locationCode =
      (selectedLocation as { code?: string }).code || location;
    const cohortCode =
      (selectedCohort as { code?: string }).code || cohort;

    const baseTuition =
      selectedLocation.mode === 'online'
        ? selectedProgram.onlineTuition
        : selectedProgram.onsiteTuition;
    const amountDue = calculateAmountDue(baseTuition, paymentPlan as PaymentPlan);
    const depositAmount = calculateAmountDue(baseTuition, 'deposit');
    const reference = generateReference();

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
      balanceDue: paymentPlan === 'deposit' ? baseTuition - depositAmount : 0,
      hearAbout: hearAbout || null,
      status: paymentPlan === 'scholarship' ? 'scholarship_requested' : 'submitted',
      paystackReference: null,
      paystackAccessCode: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdApplication = await prisma.application.create({
      data: application,
    });
    const applicationId = createdApplication.id;

    let payment: { authorization_url: string; access_code: string; reference: string } | null = null;

    if (amountDue > 0 && process.env.PAYSTACK_SECRET_KEY) {
      const origin = request.headers.get('origin');
      const callbackUrl =
        process.env.PAYSTACK_CALLBACK_URL || (origin ? `${origin}/payment/verify` : undefined);
      const payload: Record<string, unknown> = {
        email: normalizedEmail,
        amount: amountDue * 100,
        reference,
        metadata: {
          applicationId,
          program: selectedProgram.slug,
          location,
          cohort,
          paymentPlan,
        },
      };

      if (callbackUrl) {
        payload.callback_url = callbackUrl;
      }

      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const paystackData = await paystackResponse.json();
      if (!paystackResponse.ok || !paystackData.status) {
        return Response.json(
          { ok: false, error: 'Unable to initialise payment at this time.' },
          { status: 502 }
        );
      }

      payment = {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      };

      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paystackReference: paystackData.data.reference,
          paystackAccessCode: paystackData.data.access_code,
          status: 'awaiting_payment',
          updatedAt: new Date(),
        },
      });
    }

    return Response.json({ ok: true, applicationId, payment });
  } catch (error) {
    console.error('Enrollment request error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Enrollment service unavailable. Please try again.';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
