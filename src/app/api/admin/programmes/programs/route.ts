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

type ProgramProject = { title: string; description: string };
type CurriculumBlock = { label: string; topics: string[] };

function toProjects(value: unknown): ProgramProject[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const title = String((item as ProgramProject).title || '').trim();
        const description = String((item as ProgramProject).description || '').trim();
        if (!title) return null;
        return { title, description };
      })
      .filter(Boolean) as ProgramProject[];
  }
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split('|');
        return { title: title.trim(), description: rest.join('|').trim() };
      })
      .filter((item) => item.title);
  }
  return [];
}

function toCurriculum(value: unknown): CurriculumBlock[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const label = String((item as CurriculumBlock).label || '').trim();
        const topicsRaw = (item as CurriculumBlock).topics;
        const topics = Array.isArray(topicsRaw)
          ? topicsRaw.map((topic) => String(topic).trim()).filter(Boolean)
          : [];
        if (!label) return null;
        return { label, topics };
      })
      .filter(Boolean) as CurriculumBlock[];
  }
  if (typeof value === 'string') {
    const blocks = value
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);
    return blocks
      .map((block) => {
        const lines = block
          .split('\n')
          .map((line) => line.replace(/^-+\s*/, '').trim())
          .filter(Boolean);
        if (!lines.length) return null;
        const [label, ...topics] = lines;
        return { label, topics };
      })
      .filter(Boolean) as CurriculumBlock[];
  }
  return [];
}

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }

  const programs = await prisma.program.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ ok: true, data: programs });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const slug = String(payload?.slug || '').trim();
    const title = String(payload?.title || '').trim();
    const school = String(payload?.school || '').trim();
    const summary = String(payload?.summary || '').trim();
    const overview = String(payload?.overview || '').trim();
    const duration = String(payload?.duration || '').trim();
    const schedule = String(payload?.schedule || '').trim();
    const heroImage = String(payload?.heroImage || '').trim();
    const graduationStandard = String(payload?.graduationStandard || '').trim();
    const onsiteTuition = Number(payload?.onsiteTuition || 0);
    const onlineTuition = Number(payload?.onlineTuition || 0);

    if (!slug || !title || !school || !summary || !duration || !schedule || !heroImage || !graduationStandard) {
      return Response.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        slug,
        title,
        school,
        summary,
        overview: overview || summary,
        duration,
        schedule,
        onsiteTuition,
        onlineTuition,
        highlights: toStringArray(payload?.highlights),
        outcomes: toStringArray(payload?.outcomes),
        projects: toProjects(payload?.projects),
        assessment: toStringArray(payload?.assessment),
        tools: toStringArray(payload?.tools),
        roles: toStringArray(payload?.roles),
        curriculum: toCurriculum(payload?.curriculum),
        graduationStandard,
        heroImage,
      },
    });

    await logActivity({
      session: auth.session,
      action: 'programme.create',
      entityType: 'program',
      entityId: program.id,
      metadata: { slug, title },
    });

    return Response.json({ ok: true, data: program });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Programme slug already exists' }, { status: 409 });
    }
    console.error('Program create error:', error);
    return Response.json({ ok: false, error: 'Unable to create programme' }, { status: 500 });
  }
}
