import 'server-only';

import { prisma } from './prisma';
import type { CohortOption, LocationOption, ProgramDetail } from './programs';
import {
  cohorts as staticCohorts,
  locations as staticLocations,
  programs as staticPrograms,
  schedule as staticSchedule,
} from './programs';

type ProgrammeSchedule = {
  days: string;
  time: string;
  note: string;
};

export type PublicProgrammesData = {
  programs: ProgramDetail[];
  locations: LocationOption[];
  cohorts: CohortOption[];
  schedule: ProgrammeSchedule;
};

export type PublicProgrammesResult = {
  ok: true;
  source: 'db' | 'static';
  data: PublicProgrammesData;
};

const staticProgrammesData: PublicProgrammesData = {
  programs: staticPrograms,
  locations: staticLocations,
  cohorts: staticCohorts,
  schedule: staticSchedule,
};

const programOrder = new Map(staticPrograms.map((program, index) => [program.slug, index]));
const locationOrder = new Map(staticLocations.map((location, index) => [location.id, index]));
const cohortOrder = new Map(staticCohorts.map((cohort, index) => [cohort.id, index]));

function normalizeStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeSchool(value: string): ProgramDetail['school'] {
  if (value === 'Engineering' || value === 'Product' || value === 'Data') {
    return value;
  }
  return 'Engineering';
}

function normalizeLocationMode(value: string): LocationOption['mode'] {
  return value === 'online' ? 'online' : 'onsite';
}

function sortByReference<T>(items: T[], getKey: (item: T) => string, order: Map<string, number>) {
  return [...items].sort((left, right) => {
    const leftOrder = order.get(getKey(left)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = order.get(getKey(right)) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return getKey(left).localeCompare(getKey(right));
  });
}

function normalizePrograms(programs: Awaited<ReturnType<typeof prisma.program.findMany>>): ProgramDetail[] {
  const normalized = programs.map((program) => ({
    ...program,
    school: normalizeSchool(program.school),
    highlights: normalizeStringList(program.highlights),
    outcomes: normalizeStringList(program.outcomes),
    assessment: normalizeStringList(program.assessment),
    tools: normalizeStringList(program.tools),
    roles: normalizeStringList(program.roles),
    projects: Array.isArray(program.projects) ? (program.projects as ProgramDetail['projects']) : [],
    curriculum: Array.isArray(program.curriculum)
      ? (program.curriculum as ProgramDetail['curriculum'])
      : [],
  }));
  return sortByReference(normalized, (program) => program.slug, programOrder);
}

function normalizeLocations(
  locations: Awaited<ReturnType<typeof prisma.location.findMany>>
): LocationOption[] {
  const normalized = locations.map((location) => ({
    id: location.code as LocationOption['id'],
    label: location.label,
    mode: normalizeLocationMode(location.mode),
    description: location.description,
    perks: normalizeStringList(location.perks),
  }));
  return sortByReference(normalized, (location) => location.id, locationOrder);
}

function normalizeCohorts(cohorts: Awaited<ReturnType<typeof prisma.cohort.findMany>>): CohortOption[] {
  const normalized = cohorts.map((cohort) => ({
    id: cohort.code as CohortOption['id'],
    label: cohort.label,
    window: cohort.window,
    note: cohort.note,
  }));
  return sortByReference(normalized, (cohort) => cohort.id, cohortOrder);
}

export async function getPublicProgrammesData(): Promise<PublicProgrammesResult> {
  try {
    const [programs, locations, cohorts, schedule] = await Promise.all([
      prisma.program.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.location.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.cohort.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.schedule.findFirst({ where: { name: 'default' } }),
    ]);

    if (!programs.length) {
      return {
        ok: true,
        source: 'static',
        data: staticProgrammesData,
      };
    }

    return {
      ok: true,
      source: 'db',
      data: {
        programs: normalizePrograms(programs),
        locations: locations.length ? normalizeLocations(locations) : staticLocations,
        cohorts: cohorts.length ? normalizeCohorts(cohorts) : staticCohorts,
        schedule: schedule ?? staticSchedule,
      },
    };
  } catch (error) {
    console.error('Public programmes error:', error);
    return {
      ok: true,
      source: 'static',
      data: staticProgrammesData,
    };
  }
}
