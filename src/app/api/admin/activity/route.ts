import { prisma } from '../../../lib/prisma';
import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(5, Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE))
  );
  const action = searchParams.get('action');
  const entityType = searchParams.get('entityType');

  const where: Record<string, unknown> = {};
  if (action) where.action = action;
  if (entityType) where.entityType = entityType;

  const total = await prisma.activityLog.count({ where });
  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return Response.json({
    ok: true,
    data: {
      total,
      page,
      pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize)),
      logs,
    },
  });
}
