import { prisma } from '../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../_auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const schedule = await prisma.schedule.findFirst({ where: { name: 'default' } });
  return Response.json({ ok: true, data: schedule });
}

export async function PUT(request: Request) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const days = String(payload?.days || '').trim();
    const time = String(payload?.time || '').trim();
    const note = String(payload?.note || '').trim();

    if (!days || !time) {
      return Response.json({ ok: false, error: 'Days and time are required' }, { status: 400 });
    }

    const schedule = await prisma.schedule.upsert({
      where: { name: 'default' },
      create: {
        name: 'default',
        days,
        time,
        note,
      },
      update: {
        days,
        time,
        note,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'schedule.update',
      entityType: 'schedule',
      entityId: schedule.id,
      metadata: { days, time },
    });

    return Response.json({ ok: true, data: schedule });
  } catch (error) {
    console.error('Schedule update error:', error);
    return Response.json({ ok: false, error: 'Unable to update schedule' }, { status: 500 });
  }
}
