import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { authorizeAdmin, logActivity } from '../../../_auth';

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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const data: Record<string, unknown> = {};

    if (payload?.slug !== undefined) {
      const slug = String(payload.slug || '').trim();
      if (!slug) {
        return Response.json({ ok: false, error: 'Slug is required' }, { status: 400 });
      }
      data.slug = slug;
    }
    if (payload?.title !== undefined) {
      const title = String(payload.title || '').trim();
      if (!title) {
        return Response.json({ ok: false, error: 'Title is required' }, { status: 400 });
      }
      data.title = title;
    }
    if (payload?.school !== undefined) {
      const school = String(payload.school || '').trim();
      if (!school) {
        return Response.json({ ok: false, error: 'School is required' }, { status: 400 });
      }
      data.school = school;
    }
    if (payload?.summary !== undefined) {
      const summary = String(payload.summary || '').trim();
      if (!summary) {
        return Response.json({ ok: false, error: 'Summary is required' }, { status: 400 });
      }
      data.summary = summary;
    }
    if (payload?.overview !== undefined) data.overview = String(payload.overview || '').trim();
    if (payload?.duration !== undefined) {
      const duration = String(payload.duration || '').trim();
      if (!duration) {
        return Response.json({ ok: false, error: 'Duration is required' }, { status: 400 });
      }
      data.duration = duration;
    }
    if (payload?.schedule !== undefined) {
      const schedule = String(payload.schedule || '').trim();
      if (!schedule) {
        return Response.json({ ok: false, error: 'Schedule is required' }, { status: 400 });
      }
      data.schedule = schedule;
    }
    if (payload?.heroImage !== undefined) {
      const heroImage = String(payload.heroImage || '').trim();
      if (!heroImage) {
        return Response.json({ ok: false, error: 'Hero image is required' }, { status: 400 });
      }
      data.heroImage = heroImage;
    }
    if (payload?.graduationStandard !== undefined) {
      const graduationStandard = String(payload.graduationStandard || '').trim();
      if (!graduationStandard) {
        return Response.json({ ok: false, error: 'Graduation standard is required' }, { status: 400 });
      }
      data.graduationStandard = graduationStandard;
    }
    if (payload?.onsiteTuition !== undefined)
      data.onsiteTuition = Number(payload.onsiteTuition);
    if (payload?.onlineTuition !== undefined)
      data.onlineTuition = Number(payload.onlineTuition);
    if (payload?.highlights !== undefined) data.highlights = toStringArray(payload.highlights);
    if (payload?.outcomes !== undefined) data.outcomes = toStringArray(payload.outcomes);
    if (payload?.projects !== undefined) data.projects = toProjects(payload.projects);
    if (payload?.assessment !== undefined) data.assessment = toStringArray(payload.assessment);
    if (payload?.tools !== undefined) data.tools = toStringArray(payload.tools);
    if (payload?.roles !== undefined) data.roles = toStringArray(payload.roles);
    if (payload?.curriculum !== undefined) data.curriculum = toCurriculum(payload.curriculum);

    if (!Object.keys(data).length) {
      return Response.json({ ok: false, error: 'No updates provided' }, { status: 400 });
    }

    const updated = await prisma.program.update({
      where: { id },
      data,
    });

    await logActivity({
      session: auth.session,
      action: 'programme.update',
      entityType: 'program',
      entityId: updated.id,
      metadata: { title: updated.title },
    });

    return Response.json({ ok: true, data: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Programme not found' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return Response.json({ ok: false, error: 'Programme slug already exists' }, { status: 409 });
    }
    console.error('Program update error:', error);
    return Response.json({ ok: false, error: 'Unable to update programme' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin(request, 'admin');
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const deleted = await prisma.program.delete({
      where: { id },
    });

    await logActivity({
      session: auth.session,
      action: 'programme.delete',
      entityType: 'program',
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ ok: false, error: 'Programme not found' }, { status: 404 });
    }
    console.error('Program delete error:', error);
    return Response.json({ ok: false, error: 'Unable to delete programme' }, { status: 500 });
  }
}
