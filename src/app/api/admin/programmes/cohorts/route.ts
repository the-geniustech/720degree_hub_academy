import { Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const cohorts = await prisma.cohort.findMany({ orderBy: { createdAt: 'asc' } });
  return Response.json({ ok: true, data: cohorts });
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
    const window = String(payload?.window || '').trim();
    const note = String(payload?.note || '').trim();

    if (!code || !label || !window) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const cohort = await prisma.cohort.create({
      data: {
        code,
        label,
        window,
        note,
        isActive: payload?.isActive !== undefined ? Boolean(payload.isActive) : true,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'cohort.create',
      entityType: 'cohort',
      entityId: cohort.id,
      metadata: { code, label },
    });

    return Response.json({ ok: true, data: cohort });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Cohort code already exists' }, { status: 409 });
    }
    console.error('Cohort create error:', error);
    return Response.json({ ok: false, error: 'Unable to create cohort' }, { status: 500 });
  }
}
