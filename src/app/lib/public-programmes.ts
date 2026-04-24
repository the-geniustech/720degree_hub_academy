import "server-only";

import { prisma } from "./prisma";
import type { CohortOption, LocationOption, ProgramDetail } from "./programs";

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
  source: "db";
  data: PublicProgrammesData;
};

const PROGRAM_SLUG_ORDER = [
  "frontend-engineering",
  "backend-engineering",
  "product-design",
  "product-management",
  "data-analytics",
  "data-science",
] as const;

const LOCATION_CODE_ORDER = ["abeokuta", "lagos", "online"] as const;

const COHORT_CODE_ORDER = ["january", "may", "september"] as const;

const programOrder = new Map(
  PROGRAM_SLUG_ORDER.map((slug, index) => [slug, index]),
);
const locationOrder = new Map(
  LOCATION_CODE_ORDER.map((code, index) => [code, index]),
);
const cohortOrder = new Map(
  COHORT_CODE_ORDER.map((code, index) => [code, index]),
);

export class PublicProgrammesDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicProgrammesDataError";
  }
}

export function isPublicProgrammesDataError(
  error: unknown,
): error is PublicProgrammesDataError {
  return error instanceof PublicProgrammesDataError;
}

function normalizeStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeSchool(value: string): ProgramDetail["school"] {
  if (value === "Engineering" || value === "Product" || value === "Data") {
    return value;
  }
  return "Engineering";
}

function normalizeLocationMode(value: string): LocationOption["mode"] {
  return value === "online" ? "online" : "onsite";
}

function sortByReference<T>(
  items: T[],
  getKey: (item: T) => string,
  order: Map<string, number>,
) {
  return [...items].sort((left, right) => {
    const leftOrder = order.get(getKey(left)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = order.get(getKey(right)) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return getKey(left).localeCompare(getKey(right));
  });
}

function normalizePrograms(
  programs: Awaited<ReturnType<typeof prisma.program.findMany>>,
): ProgramDetail[] {
  const normalized = programs.map((program) => ({
    ...program,
    school: normalizeSchool(program.school),
    highlights: normalizeStringList(program.highlights),
    outcomes: normalizeStringList(program.outcomes),
    assessment: normalizeStringList(program.assessment),
    tools: normalizeStringList(program.tools),
    roles: normalizeStringList(program.roles),
    projects: Array.isArray(program.projects)
      ? (program.projects as ProgramDetail["projects"])
      : [],
    curriculum: Array.isArray(program.curriculum)
      ? (program.curriculum as ProgramDetail["curriculum"])
      : [],
  }));
  return sortByReference(normalized, (program) => program.slug, programOrder);
}

function normalizeLocations(
  locations: Awaited<ReturnType<typeof prisma.location.findMany>>,
): LocationOption[] {
  const normalized = locations.map((location) => ({
    id: location.code as LocationOption["id"],
    label: location.label,
    mode: normalizeLocationMode(location.mode),
    description: location.description,
    perks: normalizeStringList(location.perks),
  }));
  return sortByReference(normalized, (location) => location.id, locationOrder);
}

function normalizeCohorts(
  cohorts: Awaited<ReturnType<typeof prisma.cohort.findMany>>,
): CohortOption[] {
  const normalized = cohorts.map((cohort) => ({
    id: cohort.code as CohortOption["id"],
    label: cohort.label,
    window: cohort.window,
    note: cohort.note,
  }));
  return sortByReference(normalized, (cohort) => cohort.id, cohortOrder);
}

function normalizeSchedule(
  schedule: Awaited<ReturnType<typeof prisma.schedule.findFirst>>,
): ProgrammeSchedule {
  if (!schedule) {
    throw new PublicProgrammesDataError(
      "Programme schedule has not been configured in the backend yet.",
    );
  }

  return {
    days: schedule.days,
    time: schedule.time,
    note: schedule.note,
  };
}

function assertConfiguredData(
  programs: Awaited<ReturnType<typeof prisma.program.findMany>>,
  locations: Awaited<ReturnType<typeof prisma.location.findMany>>,
  cohorts: Awaited<ReturnType<typeof prisma.cohort.findMany>>,
  schedule: Awaited<ReturnType<typeof prisma.schedule.findFirst>>,
) {
  if (!programs.length) {
    throw new PublicProgrammesDataError(
      "Programmes are not available from the backend yet.",
    );
  }

  if (!locations.length) {
    throw new PublicProgrammesDataError(
      "Programme locations are not available from the backend yet.",
    );
  }

  if (!cohorts.length) {
    throw new PublicProgrammesDataError(
      "Programme cohorts are not available from the backend yet.",
    );
  }

  if (!schedule) {
    throw new PublicProgrammesDataError(
      "Programme schedule has not been configured in the backend yet.",
    );
  }
}

export async function getPublicProgrammesData(): Promise<PublicProgrammesResult> {
  const [programs, locations, cohorts, schedule] = await Promise.all([
    prisma.program.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.location.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.cohort.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.schedule.findFirst({ where: { name: "default" } }),
  ]);

  console.log("Programs: ", JSON.stringify(programs, null, 2));
  console.log("locations: ", JSON.stringify(locations, null, 2));
  console.log("cohorts: ", JSON.stringify(cohorts, null, 2));
  console.log("schedule: ", JSON.stringify(schedule, null, 2));

  assertConfiguredData(programs, locations, cohorts, schedule);

  return {
    ok: true,
    source: "db",
    data: {
      programs: normalizePrograms(programs),
      locations: normalizeLocations(locations),
      cohorts: normalizeCohorts(cohorts),
      schedule: normalizeSchedule(schedule),
    },
  };
}
