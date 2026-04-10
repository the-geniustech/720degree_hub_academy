import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { authorizeAdmin, generateAdminToken, logActivity } from '../../../_auth';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdmin(request, 'super_admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const token = generateAdminToken();
    const updated = await prisma.adminUser.update({
      where: { id },
      data: { token },
    });

    await logActivity({
      session: auth.session,
      action: 'admin_user.reset_token',
      entityType: 'admin_user',
      entityId: updated.id,
      metadata: { email: updated.email },
    });

    return Response.json({ ok: true, data: { id: updated.id, token } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Admin user not found' }, { status: 404 });
    }
    console.error('Admin user token reset error:', error);
    return Response.json({ ok: false, error: 'Unable to reset admin token' }, { status: 500 });
  }
}
