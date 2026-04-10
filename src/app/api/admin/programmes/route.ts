import { prisma } from '../../../lib/prisma';
import { authorizeAdmin } from '../_auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request, 'viewer');
  if (!auth.ok) {
    return auth.response;
  }
  try {
    const [locations, cohorts, programs, schedule] = await Promise.all([
      prisma.location.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.cohort.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.program.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.schedule.findFirst({ where: { name: 'default' } }),
    ]);

    const schoolsMap = programs.reduce<Record<string, { name: string; programs: string[] }>>(
      (acc, program) => {
        if (!acc[program.school]) {
          acc[program.school] = { name: program.school, programs: [] };
        }
        acc[program.school].programs.push(program.title);
        return acc;
      },
      {}
    );

    const schools = Object.values(schoolsMap).map((school) => ({
      name: school.name,
      programs: school.programs,
      totalPrograms: school.programs.length,
    }));

    return Response.json({
      ok: true,
      data: {
        locations,
        cohorts,
        schedule,
        programs,
        schools,
      },
    });
  } catch (error) {
    console.error('Admin programmes error:', error);
    return Response.json({ ok: false, error: 'Unable to load programmes data' }, { status: 500 });
  }
}
