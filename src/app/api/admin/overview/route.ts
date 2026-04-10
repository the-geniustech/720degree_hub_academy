import { prisma } from '../../../lib/prisma';
import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const totalApplications = await prisma.application.count();
  const totalContacts = await prisma.contact.count();

  const applicationStatusRows = await prisma.application.findMany({
    select: { status: true, paidAmount: true },
  });

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      programTitle: true,
      location: true,
      cohort: true,
      paymentPlan: true,
      amountDue: true,
      baseTuition: true,
      status: true,
      paidAmount: true,
      createdAt: true,
    },
  });

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      program: true,
      message: true,
      source: true,
      createdAt: true,
    },
  });

  const statusCounts = applicationStatusRows.reduce<Record<string, number>>((acc, application) => {
    acc[application.status] = (acc[application.status] || 0) + 1;
    return acc;
  }, {});

  const totalPaid = applicationStatusRows.reduce(
    (sum, application) => sum + (application.paidAmount || 0),
    0
  );

  return Response.json({
    ok: true,
    data: {
      totals: {
        applications: totalApplications,
        contacts: totalContacts,
        totalPaid,
      },
      statusCounts,
      applications,
      contacts,
    },
  });
}
