import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  return Response.json({
    ok: true,
    data: {
      user: auth.session.user,
      role: auth.session.role,
      isSuper: auth.session.isSuper,
    },
  });
}
