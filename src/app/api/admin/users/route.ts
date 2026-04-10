import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { authorizeAdmin, generateAdminToken, logActivity } from '../_auth';

export const runtime = 'nodejs';

function maskToken(token: string) {
  if (token.length <= 8) return '********';
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'super_admin');
  if (!auth.ok) {
    return auth.response;
  }

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({
    ok: true,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tokenPreview: maskToken(user.token),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request, 'super_admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const name = String(payload?.name || '').trim();
    const email = String(payload?.email || '').trim();
    const role = String(payload?.role || 'viewer').trim();

    if (!name || !email) {
      return Response.json({ ok: false, error: 'Name and email are required' }, { status: 400 });
    }

    if (!['viewer', 'admin', 'super_admin'].includes(role)) {
      return Response.json({ ok: false, error: 'Invalid role value' }, { status: 400 });
    }

    const token = generateAdminToken();
    const user = await prisma.adminUser.create({
      data: {
        name,
        email,
        role,
        token,
        isActive: true,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'admin_user.create',
      entityType: 'admin_user',
      entityId: user.id,
      metadata: { email, role },
    });

    return Response.json({
      ok: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        token,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Email or token already exists' }, { status: 409 });
    }
    console.error('Admin user create error:', error);
    return Response.json({ ok: false, error: 'Unable to create admin user' }, { status: 500 });
  }
}
