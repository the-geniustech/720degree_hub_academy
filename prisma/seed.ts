import { PrismaClient } from "@prisma/client";
import {
  cohorts,
  locations,
  programs,
  schedule,
} from "../src/app/lib/programs";

const prisma = new PrismaClient();

const sampleContacts = [
  {
    name: "Ada Nwosu",
    email: "ada.nwosu@example.com",
    phone: "+234-811-000-1201",
    program: "Frontend Engineering",
    message: "Interested in the May cohort. Can I get the full programme pack?",
    source: "cta",
  },
  {
    name: "Samuel Adedeji",
    email: "samuel.adedeji@example.com",
    phone: "+234-802-334-4991",
    program: "Backend Engineering",
    message: "What does the scholarship process look like?",
    source: "contact",
  },
  {
    name: "Ifunanya Obi",
    email: "ifunanya.obi@example.com",
    phone: "+234-903-442-8821",
    program: "Product Management",
    message:
      "I want to know if the Lagos facility is available for the September cohort.",
    source: "contact",
  },
  {
    name: "Emeka Johnson",
    email: "emeka.johnson@example.com",
    phone: "+234-816-114-4550",
    program: "Data Analytics",
    message: "Please share the curriculum and tuition details.",
    source: "cta",
  },
  {
    name: "Zainab Musa",
    email: "zainab.musa@example.com",
    phone: "+234-810-098-2201",
    program: "Product Design",
    message: "Do you support payment in installments?",
    source: "contact",
  },
];

const sampleApplications = [
  {
    fullName: "Kelechi Okafor",
    email: "kelechi.okafor@example.com",
    phone: "+234-901-100-2001",
    program: "frontend-engineering",
    programTitle: "Frontend Engineering",
    school: "Engineering",
    location: "lagos",
    cohort: "may",
    paymentPlan: "deposit",
    baseTuition: 150_000,
    amountDue: 112_500,
    balanceDue: 37_500,
    hearAbout: "Instagram",
    status: "awaiting_payment",
    paystackReference: null,
    paystackAccessCode: null,
    paidAmount: null,
    paidAt: null,
    paystackEvent: null,
    createdAt: new Date("2026-03-12T09:15:00Z"),
    updatedAt: new Date("2026-03-12T09:15:00Z"),
  },
  {
    fullName: "Bolaji Ojo",
    email: "bolaji.ojo@example.com",
    phone: "+234-803-222-1422",
    program: "backend-engineering",
    programTitle: "Backend Engineering",
    school: "Engineering",
    location: "abeokuta",
    cohort: "january",
    paymentPlan: "full",
    baseTuition: 200_000,
    amountDue: 190_000,
    balanceDue: 0,
    hearAbout: "Referral",
    status: "paid_full",
    paystackReference: "720D-SEED-001",
    paystackAccessCode: "seed_access_code_1",
    paidAmount: 190_000,
    paidAt: new Date("2026-01-18T11:25:00Z"),
    paystackEvent: null,
    createdAt: new Date("2026-01-16T14:05:00Z"),
    updatedAt: new Date("2026-01-18T11:25:00Z"),
  },
  {
    fullName: "Tomi Adeyemi",
    email: "tomi.adeyemi@example.com",
    phone: "+234-902-445-1201",
    program: "product-design",
    programTitle: "Product Design (UI/UX)",
    school: "Product",
    location: "online",
    cohort: "september",
    paymentPlan: "scholarship",
    baseTuition: 110_500,
    amountDue: 0,
    balanceDue: 0,
    hearAbout: "Twitter",
    status: "scholarship_requested",
    paystackReference: null,
    paystackAccessCode: null,
    paidAmount: null,
    paidAt: null,
    paystackEvent: null,
    createdAt: new Date("2026-02-02T08:45:00Z"),
    updatedAt: new Date("2026-02-02T08:45:00Z"),
  },
  {
    fullName: "Chidi Umeh",
    email: "chidi.umeh@example.com",
    phone: "+234-812-400-8899",
    program: "product-management",
    programTitle: "Product Management",
    school: "Product",
    location: "lagos",
    cohort: "may",
    paymentPlan: "deposit",
    baseTuition: 140_000,
    amountDue: 105_000,
    balanceDue: 35_000,
    hearAbout: "LinkedIn",
    status: "paid_deposit",
    paystackReference: "720D-SEED-002",
    paystackAccessCode: "seed_access_code_2",
    paidAmount: 105_000,
    paidAt: new Date("2026-03-01T16:10:00Z"),
    paystackEvent: null,
    createdAt: new Date("2026-02-28T10:20:00Z"),
    updatedAt: new Date("2026-03-01T16:10:00Z"),
  },
  {
    fullName: "Ruth Edet",
    email: "ruth.edet@example.com",
    phone: "+234-704-119-7711",
    program: "data-analytics",
    programTitle: "Data Analytics",
    school: "Data",
    location: "online",
    cohort: "september",
    paymentPlan: "full",
    baseTuition: 144_500,
    amountDue: 137_275,
    balanceDue: 0,
    hearAbout: "Newsletter",
    status: "submitted",
    paystackReference: null,
    paystackAccessCode: null,
    paidAmount: null,
    paidAt: null,
    paystackEvent: null,
    createdAt: new Date("2026-03-22T12:30:00Z"),
    updatedAt: new Date("2026-03-22T12:30:00Z"),
  },
  {
    fullName: "Yusuf Ali",
    email: "yusuf.ali@example.com",
    phone: "+234-808-555-9900",
    program: "data-science",
    programTitle: "Data Science",
    school: "Data",
    location: "abeokuta",
    cohort: "january",
    paymentPlan: "deposit",
    baseTuition: 170_000,
    amountDue: 127_500,
    balanceDue: 42_500,
    hearAbout: "Facebook",
    status: "submitted",
    paystackReference: null,
    paystackAccessCode: null,
    paidAmount: null,
    paidAt: null,
    paystackEvent: null,
    createdAt: new Date("2026-01-05T09:05:00Z"),
    updatedAt: new Date("2026-01-05T09:05:00Z"),
  },
];

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.program.deleteMany();
  await prisma.location.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.student.deleteMany();
  await prisma.application.deleteMany();

  const seedToken =
    process.env.ADMIN_SEED_TOKEN ||
    process.env.ADMIN_TOKEN ||
    "dev-super-admin-token";
  const seedEmail = process.env.ADMIN_SEED_EMAIL || "admin@720Degree.local";

  await prisma.adminUser.create({
    data: {
      name: "Super Admin",
      email: seedEmail,
      role: "super_admin",
      token: seedToken,
      isActive: true,
    },
  });

  await prisma.location.createMany({
    data: locations.map((location) => ({
      code: location.id,
      label: location.label,
      mode: location.mode,
      description: location.description,
      perks: location.perks,
      isActive: true,
    })),
  });

  await prisma.cohort.createMany({
    data: cohorts.map((cohort) => ({
      code: cohort.id,
      label: cohort.label,
      window: cohort.window,
      note: cohort.note,
      isActive: true,
    })),
  });

  await prisma.program.createMany({
    data: programs.map((program) => ({
      slug: program.slug,
      title: program.title,
      school: program.school,
      summary: program.summary,
      overview: program.overview,
      onsiteTuition: program.onsiteTuition,
      onlineTuition: program.onlineTuition,
      duration: program.duration,
      schedule: program.schedule,
      highlights: program.highlights,
      outcomes: program.outcomes,
      projects: program.projects,
      assessment: program.assessment,
      tools: program.tools,
      roles: program.roles,
      curriculum: program.curriculum,
      graduationStandard: program.graduationStandard,
      heroImage: program.heroImage,
    })),
  });

  await prisma.schedule.create({
    data: {
      name: "default",
      days: schedule.days,
      time: schedule.time,
      note: schedule.note,
    },
  });

  for (const contact of sampleContacts) {
    await prisma.contact.create({ data: contact });
  }

  for (const application of sampleApplications) {
    await prisma.application.create({ data: application });
  }

  const paidApplications = await prisma.application.findMany({
    where: { status: { in: ["paid_full", "paid_deposit"] } },
  });

  for (const application of paidApplications) {
    await prisma.student.create({
      data: {
        applicationId: application.id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        program: application.program,
        programTitle: application.programTitle,
        school: application.school,
        location: application.location,
        cohort: application.cohort,
        paymentPlan: application.paymentPlan,
        status: application.paymentPlan === "full" ? "active" : "onboarding",
        amountPaid: application.paidAmount ?? 0,
        balanceDue: application.balanceDue ?? 0,
        paidAt: application.paidAt ?? undefined,
        paystackReference: application.paystackReference ?? undefined,
      },
    });
  }

  console.log(`Admin seed token: ${seedToken}`);
}

main()
  .then(() => {
    console.log("Seed completed.");
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
