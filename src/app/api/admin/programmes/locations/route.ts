import { Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';

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

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const locations = await prisma.location.findMany({ orderBy: { createdAt: 'asc' } });
  return Response.json({ ok: true, data: locations });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const code = String(payload?.code || '').trim();
    const label = String(payload?.label || '').trim();
    const mode = String(payload?.mode || '').trim();
    const description = String(payload?.description || '').trim();

    if (!code || !label || !mode) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        code,
        label,
        mode,
        description,
        perks: toStringArray(payload?.perks),
        isActive: payload?.isActive !== undefined ? Boolean(payload.isActive) : true,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'location.create',
      entityType: 'location',
      entityId: location.id,
      metadata: { code, label },
    });

    return Response.json({ ok: true, data: location });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Location code already exists' }, { status: 409 });
    }
    console.error('Location create error:', error);
    return Response.json({ ok: false, error: 'Unable to create location' }, { status: 500 });
  }
}
