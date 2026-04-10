import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }
  try {
    const { searchParams } = new URL(request.url);
    const exportMode = searchParams.get('export') === '1';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(5, Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE))
    );
    const source = searchParams.get('source');
    const search = searchParams.get('search')?.trim();

    const where: Prisma.ContactWhereInput = {};
    if (source && source !== 'all') {
      where.source = source;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { program: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const total = await prisma.contact.count({ where });
    const effectivePageSize = exportMode ? total : pageSize;
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: exportMode ? 0 : (page - 1) * pageSize,
      take: exportMode ? total : pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        program: true,
        message: true,
        source: true,
        createdAt: true,
      },
    });

    const sourceRows = await prisma.contact.findMany({ select: { source: true } });
    const sourceCounts = sourceRows.reduce<Record<string, number>>((acc, row) => {
      const key = row.source || 'contact';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Response.json({
      ok: true,
      data: {
        total,
        page: exportMode ? 1 : page,
        pageSize: effectivePageSize,
        pages: exportMode ? 1 : Math.max(1, Math.ceil(total / pageSize)),
        sourceCounts,
        contacts,
      },
    });
  } catch (error) {
    console.error('Admin contacts error:', error);
    return Response.json({ ok: false, error: 'Unable to load contacts' }, { status: 500 });
  }
}
