import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(5, Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE))
    );
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const where: Prisma.ApplicationWhereInput = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { programTitle: { contains: search } },
      ];
    }

    const total = await prisma.application.count({ where });
    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
        balanceDue: true,
        status: true,
        paidAmount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const statusRows = await prisma.application.findMany({
      select: { status: true, paidAmount: true },
    });

    const statusCounts = statusRows.reduce<Record<string, number>>((acc, application) => {
      acc[application.status] = (acc[application.status] || 0) + 1;
      return acc;
    }, {});

    const totalPaid = statusRows.reduce(
      (sum, application) => sum + (application.paidAmount || 0),
      0
    );

    return Response.json({
      ok: true,
      data: {
        total,
        page,
        pageSize,
        pages: Math.max(1, Math.ceil(total / pageSize)),
        totalPaid,
        statusCounts,
        applications,
      },
    });
  } catch (error) {
    console.error('Admin applications error:', error);
    return Response.json({ ok: false, error: 'Unable to load applications' }, { status: 500 });
  }
}
