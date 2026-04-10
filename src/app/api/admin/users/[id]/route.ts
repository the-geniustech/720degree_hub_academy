import { Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'super_admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const data: Record<string, unknown> = {};

    if (payload?.name) data.name = String(payload.name).trim();
    if (payload?.email) data.email = String(payload.email).trim();
    if (payload?.role) {
      const role = String(payload.role).trim();
      if (!['viewer', 'admin', 'super_admin'].includes(role)) {
        return Response.json({ ok: false, error: 'Invalid role value' }, { status: 400 });
      }
      data.role = role;
    }
    if (payload?.isActive !== undefined) data.isActive = Boolean(payload.isActive);

    const updated = await prisma.adminUser.update({
      where: { id },
      data,
    });

    await logActivity({
      session: auth.session,
      action: 'admin_user.update',
      entityType: 'admin_user',
      entityId: updated.id,
      metadata: { email: updated.email, role: updated.role },
    });

    return Response.json({ ok: true, data: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Admin user not found' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Email already in use' }, { status: 409 });
    }
    console.error('Admin user update error:', error);
    return Response.json({ ok: false, error: 'Unable to update admin user' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'super_admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const deleted = await prisma.adminUser.delete({
      where: { id },
    });

    await logActivity({
      session: auth.session,
      action: 'admin_user.delete',
      entityType: 'admin_user',
      entityId: deleted.id,
      metadata: { email: deleted.email },
    });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Admin user not found' }, { status: 404 });
    }
    console.error('Admin user delete error:', error);
    return Response.json({ ok: false, error: 'Unable to delete admin user' }, { status: 500 });
  }
}
