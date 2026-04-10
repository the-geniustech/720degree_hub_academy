import { Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';
import { studentStatuses } from '../../../../admin/lib/student-status';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    const payload = await request.json();
    const data: Prisma.StudentUpdateInput = {};

    if (payload?.fullName !== undefined) data.fullName = String(payload.fullName).trim();
    if (payload?.email !== undefined) data.email = String(payload.email).trim();
    if (payload?.phone !== undefined) data.phone = String(payload.phone).trim();
    if (payload?.program !== undefined) data.program = String(payload.program).trim();
    if (payload?.programTitle !== undefined) data.programTitle = String(payload.programTitle).trim();
    if (payload?.school !== undefined) data.school = String(payload.school).trim();
    if (payload?.location !== undefined) data.location = String(payload.location).trim();
    if (payload?.cohort !== undefined) data.cohort = String(payload.cohort).trim();
    if (payload?.paymentPlan !== undefined) {
      const paymentPlan = String(payload.paymentPlan).trim();
      if (!['deposit', 'full', 'scholarship'].includes(paymentPlan)) {
        return Response.json({ ok: false, error: 'Invalid payment plan' }, { status: 400 });
      }
      data.paymentPlan = paymentPlan;
    }
    if (payload?.status !== undefined) {
      const nextStatus = String(payload.status).trim();
      if (!studentStatuses.includes(nextStatus as never)) {
        return Response.json({ ok: false, error: 'Invalid status value' }, { status: 400 });
      }
      data.status = nextStatus;
    }
    if (payload?.amountPaid !== undefined) {
      data.amountPaid = Math.round(Number(payload.amountPaid || 0));
    }
    if (payload?.balanceDue !== undefined) {
      data.balanceDue = Math.round(Number(payload.balanceDue || 0));
    }
    if (payload?.paidAt !== undefined) {
      const paidAt = payload.paidAt ? new Date(payload.paidAt) : null;
      if (paidAt && Number.isNaN(paidAt.getTime())) {
        return Response.json({ ok: false, error: 'Invalid paid date' }, { status: 400 });
      }
      data.paidAt = paidAt ?? undefined;
    }
    if (payload?.notes !== undefined) {
      const notes = String(payload.notes || '').trim();
      data.notes = notes || null;
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    await logActivity({
      session: auth.session,
      action: 'student.update',
      entityType: 'student',
      entityId: updated.id,
      metadata: {
        email: updated.email,
        status: updated.status,
      },
    });

    return Response.json({ ok: true, data: { id: updated.id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Student not found' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Email already in use' }, { status: 409 });
    }
    console.error('Admin student update error:', error);
    return Response.json({ ok: false, error: 'Unable to update student' }, { status: 500 });
  }
}
