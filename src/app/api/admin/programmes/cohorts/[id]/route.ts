import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../../_auth';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const data: Record<string, unknown> = {};

    if (payload?.code) data.code = String(payload.code).trim();
    if (payload?.label) data.label = String(payload.label).trim();
    if (payload?.window) data.window = String(payload.window).trim();
    if (payload?.note !== undefined) data.note = String(payload.note || '');
    if (payload?.isActive !== undefined) data.isActive = Boolean(payload.isActive);

    const updated = await prisma.cohort.update({
      where: { id },
      data,
    });

    await logActivity({
      session: auth.session,
      action: 'cohort.update',
      entityType: 'cohort',
      entityId: updated.id,
      metadata: { code: updated.code, label: updated.label },
    });

    return Response.json({ ok: true, data: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Cohort not found' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Cohort code already exists' }, { status: 409 });
    }
    console.error('Cohort update error:', error);
    return Response.json({ ok: false, error: 'Unable to update cohort' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const deleted = await prisma.cohort.delete({
      where: { id },
    });

    await logActivity({
      session: auth.session,
      action: 'cohort.delete',
      entityType: 'cohort',
      entityId: deleted.id,
      metadata: { code: deleted.code, label: deleted.label },
    });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Cohort not found' }, { status: 404 });
    }
    console.error('Cohort delete error:', error);
    return Response.json({ ok: false, error: 'Unable to delete cohort' }, { status: 500 });
  }
}
