import { prisma } from '../../lib/prisma';
import {
  programs as staticPrograms,
  locations as staticLocations,
  cohorts as staticCohorts,
  schedule as staticSchedule,
} from '../../lib/programs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeList(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export async function GET() {
  try {
    const [programs, locations, cohorts, schedule] = await Promise.all([
      prisma.program.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.location.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.cohort.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.schedule.findFirst({ where: { name: 'default' } }),
    ]);

    if (!programs.length) {
      return Response.json({
        ok: true,
        source: 'static',
        data: {
          programs: staticPrograms,
          locations: staticLocations,
          cohorts: staticCohorts,
          schedule: staticSchedule,
        },
      });
    }

    const normalizedPrograms = programs.map((program) => ({
      ...program,
      highlights: normalizeList(program.highlights),
      outcomes: normalizeList(program.outcomes),
      assessment: normalizeList(program.assessment),
      tools: normalizeList(program.tools),
      roles: normalizeList(program.roles),
      projects: normalizeList(program.projects),
      curriculum: normalizeList(program.curriculum),
    }));

    const normalizedLocations = locations.map((location) => ({
      ...location,
      id: location.code,
      recordId: location.id,
    }));

    const normalizedCohorts = cohorts.map((cohort) => ({
      ...cohort,
      id: cohort.code,
      recordId: cohort.id,
    }));

    return Response.json({
      ok: true,
      source: 'db',
      data: {
        programs: normalizedPrograms,
        locations: normalizedLocations,
        cohorts: normalizedCohorts,
        schedule: schedule ?? staticSchedule,
      },
    });
  } catch (error) {
    console.error('Public programmes error:', error);
    return Response.json({
      ok: true,
      source: 'static',
      data: {
        programs: staticPrograms,
        locations: staticLocations,
        cohorts: staticCohorts,
        schedule: staticSchedule,
      },
    });
  }
}
