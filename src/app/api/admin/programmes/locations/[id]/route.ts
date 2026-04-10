import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../../_auth';

export const runtime = 'nodejs';

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

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
    if (payload?.mode) data.mode = String(payload.mode).trim();
    if (payload?.description !== undefined) data.description = String(payload.description || '');
    if (payload?.perks !== undefined) data.perks = toStringArray(payload.perks);
    if (payload?.isActive !== undefined) data.isActive = Boolean(payload.isActive);

    const updated = await prisma.location.update({
      where: { id },
      data,
    });

    await logActivity({
      session: auth.session,
      action: 'location.update',
      entityType: 'location',
      entityId: updated.id,
      metadata: { code: updated.code, label: updated.label },
    });

    return Response.json({ ok: true, data: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Location not found' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Location code already exists' }, { status: 409 });
    }
    console.error('Location update error:', error);
    return Response.json({ ok: false, error: 'Unable to update location' }, { status: 500 });
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
    const deleted = await prisma.location.delete({
      where: { id },
    });

    await logActivity({
      session: auth.session,
      action: 'location.delete',
      entityType: 'location',
      entityId: deleted.id,
      metadata: { code: deleted.code, label: deleted.label },
    });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Location not found' }, { status: 404 });
    }
    console.error('Location delete error:', error);
    return Response.json({ ok: false, error: 'Unable to delete location' }, { status: 500 });
  }
}
