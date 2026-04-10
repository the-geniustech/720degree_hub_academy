import { Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';
import { applicationStatuses } from '../../../../admin/lib/status';

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
    const nextStatus = payload?.status as string | undefined;

    if (!nextStatus || !applicationStatuses.includes(nextStatus as never)) {
      return Response.json({ ok: false, error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: nextStatus,
        updatedAt: new Date(),
      },
    });

    await logActivity({
      session: auth.session,
      action: 'application.status_update',
      entityType: 'application',
      entityId: updated.id,
      metadata: { status: nextStatus },
    });

    return Response.json({ ok: true, data: { id: updated.id, status: updated.status } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Application not found' }, { status: 404 });
    }
    return Response.json({ ok: false, error: 'Unable to update application' }, { status: 500 });
  }
}
