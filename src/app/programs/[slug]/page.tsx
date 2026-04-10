import { notFound } from 'next/navigation';
import { ProgramDetailPage } from '../../pages/ProgramDetailPage';
import { prisma } from '../../lib/prisma';
import { programs as staticPrograms } from '../../lib/programs';

export const dynamic = 'force-dynamic';

function normalizeProgram(program: any) {
  return {
    slug: program.slug,
    title: program.title,
    school: program.school,
    summary: program.summary,
    overview: program.overview,
    onsiteTuition: program.onsiteTuition,
    onlineTuition: program.onlineTuition,
    duration: program.duration,
    schedule: program.schedule,
    highlights: Array.isArray(program.highlights) ? program.highlights : [],
    outcomes: Array.isArray(program.outcomes) ? program.outcomes : [],
    projects: Array.isArray(program.projects) ? program.projects : [],
    assessment: Array.isArray(program.assessment) ? program.assessment : [],
    tools: Array.isArray(program.tools) ? program.tools : [],
    roles: Array.isArray(program.roles) ? program.roles : [],
    curriculum: Array.isArray(program.curriculum) ? program.curriculum : [],
    graduationStandard: program.graduationStandard ?? '',
    heroImage: program.heroImage ?? '',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let program = null;

  try {
    program = await prisma.program.findFirst({ where: { slug } });
  } catch (error) {
    console.error('Programme lookup failed:', error);
  }

  if (!program) {
    program = staticPrograms.find((item) => item.slug === slug) ?? null;
  }

  if (!program) {
    notFound();
  }

  return <ProgramDetailPage program={normalizeProgram(program)} />;
}
