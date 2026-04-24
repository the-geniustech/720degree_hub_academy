import { Resend } from "resend";
import { prisma } from "./prisma";

type PaymentContext = {
  reference: string;
  amount: number;
  paidAt?: Date | null;
  paystackEvent?: unknown;
  origin?: string | null;
};

type EmailPayload = {
  subject: string;
  html: string;
  text: string;
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatNaira(amount: number) {
  return currencyFormatter.format(amount);
}

function formatDateTime(value: Date) {
  return dateFormatter.format(value);
}

function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPaymentPlan(plan: string) {
  if (plan === "deposit") return "75% enrolment deposit";
  if (plan === "full") return "Full tuition (100%)";
  if (plan === "scholarship") return "Scholarship";
  return titleCase(plan);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return null;
  }
  return {
    client: new Resend(apiKey),
    from,
  };
}

async function sendResendEmail(
  client: Resend,
  payload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
  },
) {
  const result = await client.emails.send(payload);
  if (
    result &&
    typeof result === "object" &&
    "error" in result &&
    result.error
  ) {
    const errorMessage =
      typeof result.error === "object" &&
      result.error &&
      "message" in result.error
        ? String(result.error.message)
        : "Resend delivery failed";
    throw new Error(errorMessage);
  }
  return result;
}

function buildReceiptEmail(options: {
  fullName: string;
  email: string;
  reference: string;
  amountPaid: number;
  balanceDue: number;
  paidAt: Date;
  programTitle: string;
  cohort: string;
  location: string;
  paymentPlan: string;
}) {
  const {
    fullName,
    email,
    reference,
    amountPaid,
    balanceDue,
    paidAt,
    programTitle,
    cohort,
    location,
    paymentPlan,
  } = options;

  const subject = `Payment Receipt - ${programTitle}`;
  const paidAtLabel = formatDateTime(paidAt);
  const planLabel = formatPaymentPlan(paymentPlan);
  const locationLabel = titleCase(location);
  const cohortLabel = titleCase(cohort);
  const amountLabel = formatNaira(amountPaid);
  const balanceLabel = formatNaira(balanceDue);

  const text = [
    `Hello ${fullName},`,
    "",
    "Thank you for your payment to 720Degree Academy. This email is your receipt.",
    "",
    `Receipt reference: ${reference}`,
    `Paid on: ${paidAtLabel}`,
    `Student: ${fullName}`,
    `Email: ${email}`,
    `Programme: ${programTitle}`,
    `Cohort: ${cohortLabel}`,
    `Location: ${locationLabel}`,
    `Payment plan: ${planLabel}`,
    `Amount paid: ${amountLabel}`,
    `Balance due: ${balanceLabel}`,
    "",
    "If you need help, reply to this email and we will assist you promptly.",
    "",
    "720Degree Academy",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Receipt</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f3ed; font-family: 'Segoe UI', Arial, sans-serif; color:#111827;">
    <span style="display:none; visibility:hidden; opacity:0; height:0; width:0;">
      Your payment receipt for ${programTitle}.
    </span>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f6f3ed; padding:32px 12px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; box-shadow:0 16px 40px rgba(15,23,42,0.12); overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 12px; background:#0f172a; color:#ffffff;">
                <img
                  src="https://720Degreehub.com/academy/img/logo/720academylogo%20.png"
                  alt="720Degree Academy"
                  width="140"
                  height="36"
                  style="display:block; margin-bottom:16px;"
                />
                <div style="font-size:12px; letter-spacing:0.3em; text-transform:uppercase; opacity:0.7;">720Degree Academy</div>
                <div style="font-size:24px; font-weight:700; margin-top:8px;">Payment Receipt</div>
                <div style="font-size:14px; opacity:0.7; margin-top:6px;">Receipt reference: ${reference}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <p style="margin:0 0 12px; font-size:16px;">Hello ${fullName},</p>
                <p style="margin:0 0 18px; color:#475569; line-height:1.6;">
                  Thank you for securing your seat. Below is a structured breakdown of your payment.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Paid on</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${paidAtLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Programme</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${programTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Cohort</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${cohortLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Location</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${locationLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Payment plan</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${planLabel}</td>
                  </tr>
                </table>
                <div style="height:1px; background:#e2e8f0; margin:20px 0;"></div>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding:10px 0; font-size:14px; color:#0f172a; font-weight:600;">Amount paid</td>
                    <td style="padding:10px 0; font-size:16px; font-weight:700; text-align:right; color:#0f172a;">${amountLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Balance due</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right; color:#64748b;">${balanceLabel}</td>
                  </tr>
                </table>
                <div style="margin-top:20px; padding:16px; border-radius:14px; background:#f8fafc; border:1px solid #e2e8f0; font-size:13px; color:#475569;">
                  Need assistance? Reply to this email and our admissions team will respond within 24 hours.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 26px; font-size:12px; color:#94a3b8; text-align:center;">
                720Degree Academy · Building career-ready talent across Africa.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text } satisfies EmailPayload;
}

function buildWelcomeEmail(options: {
  fullName: string;
  programTitle: string;
  cohort: string;
  location: string;
  paymentPlan: string;
  amountPaid: number;
  balanceDue: number;
  origin?: string | null;
}) {
  const {
    fullName,
    programTitle,
    cohort,
    location,
    paymentPlan,
    amountPaid,
    balanceDue,
    origin,
  } = options;
  const subject = `Welcome to 720Degree Academy, ${fullName.split(" ")[0] || fullName}!`;
  const planLabel = formatPaymentPlan(paymentPlan);
  const locationLabel = titleCase(location);
  const cohortLabel = titleCase(cohort);
  const amountLabel = formatNaira(amountPaid);
  const balanceLabel = formatNaira(balanceDue);
  const portalUrl =
    origin || process.env.APP_BASE_URL || "https://720Degree.academy";

  const text = [
    `Hello ${fullName},`,
    "",
    `Welcome to 720Degree Academy! We have confirmed your payment and created your student profile for ${programTitle}.`,
    "",
    "Next steps:",
    "- Admissions will send your onboarding pack and orientation schedule.",
    "- You will receive a WhatsApp group invite within 24 hours.",
    "- Confirm your cohort start date and preferred learning track.",
    "",
    `Programme: ${programTitle}`,
    `Cohort: ${cohortLabel}`,
    `Location: ${locationLabel}`,
    `Payment plan: ${planLabel}`,
    `Amount paid: ${amountLabel}`,
    `Balance due: ${balanceLabel}`,
    "",
    `Learn more about your programme: ${portalUrl}`,
    "",
    "We are excited to have you on board.",
    "720Degree Academy",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to 720Degree Academy</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f3ed; font-family:'Segoe UI', Arial, sans-serif; color:#0f172a;">
    <span style="display:none; visibility:hidden; opacity:0; height:0; width:0;">
      Welcome to 720Degree Academy. Your onboarding details are inside.
    </span>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f6f3ed; padding:32px 12px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; box-shadow:0 18px 44px rgba(15,23,42,0.12); overflow:hidden;">
            <tr>
              <td style="padding:28px 32px; background:linear-gradient(135deg,#0f172a,#1f2a44); color:#ffffff;">
                <img
                  src="https://720Degreehub.com/academy/img/logo/720academylogo%20.png"
                  alt="720Degree Academy"
                  width="140"
                  height="36"
                  style="display:block; margin-bottom:16px;"
                />
                <div style="font-size:12px; letter-spacing:0.3em; text-transform:uppercase; opacity:0.7;">Welcome</div>
                <div style="font-size:26px; font-weight:700; margin-top:8px;">You are in, ${fullName.split(" ")[0] || fullName}!</div>
                <div style="font-size:14px; opacity:0.8; margin-top:8px;">Your student profile is ready.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <p style="margin:0 0 12px; font-size:16px;">Hello ${fullName},</p>
                <p style="margin:0 0 18px; color:#475569; line-height:1.6;">
                  We have confirmed your payment for <strong>${programTitle}</strong>. The admissions team will
                  send your onboarding pack and the Day 1 agenda shortly.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; margin-bottom:18px;">
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Programme</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${programTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Cohort</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${cohortLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Location</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${locationLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; font-size:13px; color:#64748b;">Payment plan</td>
                    <td style="padding:10px 0; font-size:13px; font-weight:600; text-align:right;">${planLabel}</td>
                  </tr>
                </table>
                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:18px;">
                  <div style="flex:1; min-width:220px; background:#f8fafc; border:1px solid #e2e8f0; padding:12px 16px; border-radius:14px;">
                    <div style="font-size:12px; color:#64748b;">Amount paid</div>
                    <div style="font-size:16px; font-weight:700;">${amountLabel}</div>
                  </div>
                  <div style="flex:1; min-width:220px; background:#f8fafc; border:1px solid #e2e8f0; padding:12px 16px; border-radius:14px;">
                    <div style="font-size:12px; color:#64748b;">Balance due</div>
                    <div style="font-size:16px; font-weight:700;">${balanceLabel}</div>
                  </div>
                </div>
                <div style="padding:16px; border-radius:14px; background:#0f172a; color:#ffffff;">
                  <div style="font-size:13px; letter-spacing:0.2em; text-transform:uppercase; opacity:0.7;">Next steps</div>
                  <ul style="margin:10px 0 0 18px; padding:0; font-size:14px; line-height:1.6;">
                    <li>Admissions will email your onboarding pack within 24 hours.</li>
                    <li>You will receive a WhatsApp group invite for cohort updates.</li>
                    <li>Confirm your cohort start date and orientation slot.</li>
                  </ul>
                </div>
                <div style="margin-top:20px; font-size:13px; color:#475569;">
                  Need anything? Reply to this email and we will help right away.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 26px; font-size:12px; color:#94a3b8; text-align:center;">
                720Degree Academy · Learn more at <a href="${portalUrl}" style="color:#0f172a; text-decoration:none; font-weight:600;">${portalUrl}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text } satisfies EmailPayload;
}

export async function handleSuccessfulPayment(context: PaymentContext) {
  const { reference, amount, paidAt, paystackEvent, origin } = context;
  const application = await prisma.application.findFirst({
    where: { paystackReference: reference },
  });

  if (!application) {
    return { ok: false, error: "Application not found" } as const;
  }

  const paidAtValue = paidAt ?? new Date();
  const amountPaid = Math.round(
    amount || application.paidAmount || application.amountDue || 0,
  );
  const balanceDue = application.balanceDue ?? 0;
  const paidStatus =
    application.paymentPlan === "full" ? "paid_full" : "paid_deposit";
  const status =
    application.status === "enrolled" ? application.status : paidStatus;

  const updatedApplication = await prisma.application.update({
    where: { id: application.id },
    data: {
      status,
      paidAmount: application.paidAmount ?? amountPaid,
      paidAt: application.paidAt ?? paidAtValue,
      updatedAt: new Date(),
      paystackEvent: paystackEvent ?? application.paystackEvent,
    },
  });

  const existingStudentByApplication = await prisma.student.findFirst({
    where: { applicationId: application.id },
  });

  const existingStudentByEmail =
    existingStudentByApplication ??
    (await prisma.student.findFirst({ where: { email: application.email } }));

  const studentBase = {
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    program: application.program,
    programTitle: application.programTitle,
    school: application.school,
    location: application.location,
    cohort: application.cohort,
    paymentPlan: application.paymentPlan,
    amountPaid,
    balanceDue,
    paidAt: updatedApplication.paidAt ?? paidAtValue,
    paystackReference: reference,
  };

  const nextStatus = existingStudentByEmail?.status || "onboarding";
  const nextApplicationId =
    existingStudentByEmail?.applicationId || application.id;

  const student = existingStudentByEmail
    ? await prisma.student.update({
        where: { id: existingStudentByEmail.id },
        data: {
          ...studentBase,
          status: nextStatus,
          applicationId: nextApplicationId,
          updatedAt: new Date(),
        },
      })
    : await prisma.student.create({
        data: {
          ...studentBase,
          status: "onboarding",
          applicationId: application.id,
        },
      });

  const resend = getResendClient();
  if (resend) {
    const { client, from } = resend;
    if (!student.receiptSentAt) {
      const receipt = buildReceiptEmail({
        fullName: student.fullName,
        email: student.email,
        reference,
        amountPaid: student.amountPaid,
        balanceDue: student.balanceDue,
        paidAt: student.paidAt ?? paidAtValue,
        programTitle: student.programTitle,
        cohort: student.cohort,
        location: student.location,
        paymentPlan: student.paymentPlan,
      });
      try {
        await sendResendEmail(client, {
          from,
          to: [student.email],
          subject: receipt.subject,
          html: receipt.html,
          text: receipt.text,
        });
        await prisma.student.update({
          where: { id: student.id },
          data: { receiptSentAt: new Date() },
        });
      } catch (error) {
        console.error("Resend receipt error:", error);
      }
    }

    if (!student.welcomeSentAt) {
      const welcome = buildWelcomeEmail({
        fullName: student.fullName,
        programTitle: student.programTitle,
        cohort: student.cohort,
        location: student.location,
        paymentPlan: student.paymentPlan,
        amountPaid: student.amountPaid,
        balanceDue: student.balanceDue,
        origin,
      });
      try {
        await sendResendEmail(client, {
          from,
          to: [student.email],
          subject: welcome.subject,
          html: welcome.html,
          text: welcome.text,
        });
        await prisma.student.update({
          where: { id: student.id },
          data: { welcomeSentAt: new Date() },
        });
      } catch (error) {
        console.error("Resend welcome error:", error);
      }
    }
  }

  return { ok: true, studentId: student.id } as const;
}
