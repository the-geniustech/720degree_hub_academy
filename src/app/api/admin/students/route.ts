import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../_auth';
import { studentStatuses } from '../../../admin/lib/student-status';

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

    const where: Prisma.StudentWhereInput = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { programTitle: { contains: search } },
        { cohort: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const total = await prisma.student.count({ where });
    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        applicationId: true,
        fullName: true,
        email: true,
        phone: true,
        program: true,
        programTitle: true,
        school: true,
        location: true,
        cohort: true,
        paymentPlan: true,
        status: true,
        amountPaid: true,
        balanceDue: true,
        paidAt: true,
        paystackReference: true,
        receiptSentAt: true,
        welcomeSentAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const statusRows = await prisma.student.findMany({
      select: { status: true, amountPaid: true },
    });

    const statusCounts = statusRows.reduce<Record<string, number>>((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1;
      return acc;
    }, {});

    const totalPaid = statusRows.reduce((sum, student) => sum + (student.amountPaid || 0), 0);

    return Response.json({
      ok: true,
      data: {
        total,
        page,
        pageSize,
        pages: Math.max(1, Math.ceil(total / pageSize)),
        statusCounts,
        totalPaid,
        students,
      },
    });
  } catch (error) {
    console.error('Admin students error:', error);
    return Response.json({ ok: false, error: 'Unable to load students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const fullName = String(payload?.fullName || '').trim();
    const email = String(payload?.email || '').trim();
    const phone = String(payload?.phone || '').trim();
    const program = String(payload?.program || '').trim();
    const programTitle = String(payload?.programTitle || '').trim();
    const school = String(payload?.school || '').trim();
    const location = String(payload?.location || '').trim();
    const cohort = String(payload?.cohort || '').trim();
    const paymentPlan = String(payload?.paymentPlan || '').trim();
    const status = String(payload?.status || 'onboarding').trim();
    const amountPaid = Math.round(Number(payload?.amountPaid || 0));
    const balanceDue = Math.round(Number(payload?.balanceDue || 0));
    const notes = payload?.notes ? String(payload.notes).trim() : null;

    if (
      !fullName ||
      !email ||
      !phone ||
      !program ||
      !programTitle ||
      !school ||
      !location ||
      !cohort ||
      !paymentPlan
    ) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!['deposit', 'full', 'scholarship'].includes(paymentPlan)) {
      return Response.json({ ok: false, error: 'Invalid payment plan' }, { status: 400 });
    }

    if (!studentStatuses.includes(status as never)) {
      return Response.json({ ok: false, error: 'Invalid status value' }, { status: 400 });
    }

    const paidAt = payload?.paidAt ? new Date(payload.paidAt) : null;
    if (paidAt && Number.isNaN(paidAt.getTime())) {
      return Response.json({ ok: false, error: 'Invalid paid date' }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        phone,
        program,
        programTitle,
        school,
        location,
        cohort,
        paymentPlan,
        status,
        amountPaid,
        balanceDue,
        paidAt: paidAt ?? undefined,
        notes: notes || undefined,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'student.create',
      entityType: 'student',
      entityId: student.id,
      metadata: {
        email,
        programTitle,
        cohort,
      },
    });

    return Response.json({ ok: true, data: { id: student.id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Student already exists' }, { status: 409 });
    }
    console.error('Admin student create error:', error);
    return Response.json({ ok: false, error: 'Unable to create student' }, { status: 500 });
  }
}
