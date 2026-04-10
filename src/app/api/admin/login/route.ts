import { authorizeAdmin, logActivity } from '../_auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  await logActivity({
    session: auth.session,
    action: 'auth.login',
    entityType: 'admin_auth',
  });

  return Response.json({
    ok: true,
    data: {
      user: auth.session.user,
      role: auth.session.role,
      isSuper: auth.session.isSuper,
    },
  });
}
