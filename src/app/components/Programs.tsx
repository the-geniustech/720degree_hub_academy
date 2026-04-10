'use client';

import Link from 'next/link';
import { ArrowRight, Cpu, LayoutGrid, PenTool, ClipboardList, Database, LineChart } from 'lucide-react';
import { Reveal } from './Reveal';
import { useProgrammesData } from './ProgrammesProvider';

const iconMap = {
  'frontend-engineering': LayoutGrid,
  'backend-engineering': Cpu,
  'product-design': PenTool,
  'product-management': ClipboardList,
  'data-analytics': LineChart,
  'data-science': Database,
} as const;

export function Programs() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  return (
    <section id="programs" className="py-20 bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] relative overflow-hidden">
      <div className="absolute -top-16 right-12 h-36 w-36 rounded-full bg-[rgba(154,210,255,0.25)] blur-3xl parallax-medium dark:bg-[rgba(35,182,168,0.25)]" />
      <div className="absolute bottom-6 left-8 h-28 w-28 rounded-full bg-[rgba(246,176,66,0.2)] blur-3xl parallax-fast dark:bg-[rgba(154,210,255,0.2)]" />
      <div className="absolute inset-0 texture-dots opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Reveal delay={0} speed="slow">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--brand-ink)] mb-4 font-display">
              Six Courses. Three Schools. One Cohort.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Choose a track and learn alongside a multi-disciplinary cohort. Cross-school projects in Months 4
              and 5 mirror how real product teams work.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = iconMap[program.slug as keyof typeof iconMap];
            return (
              <Reveal
                key={program.slug}
                delay={index * 120}
                speed="fast"
                className="group relative p-8 rounded-2xl border border-black/10 transition-all duration-300 hover:shadow-[0_30px_60px_rgba(11,16,32,0.18)] bg-[var(--brand-sand)] overflow-hidden transform-gpu hover:-translate-y-1 hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)] dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:border-white/20 dark:hover:shadow-[0_30px_70px_rgba(35,182,168,0.28)]"
              >
                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[rgba(35,182,168,0.18)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity dark:bg-[rgba(35,182,168,0.28)]" />
                <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-[rgba(246,176,66,0.2)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity dark:bg-[rgba(154,210,255,0.22)]" />
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-[0_10px_30px_rgba(11,16,32,0.12)] border border-black/10 dark:bg-white/10 dark:border-white/10 dark:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
                    <Icon className="text-[var(--brand-ink)]" size={28} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {program.school} School
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-2">{program.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-4">
                  6 months + 3 months support
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-6">{program.summary}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {program.tools.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="bg-white text-slate-700 px-3 py-1 rounded-full text-xs border border-black/10 shadow-[0_8px_20px_rgba(11,16,32,0.08)] dark:bg-white/10 dark:text-white/80 dark:border-white/10 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/programs/${program.slug}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all bg-white text-[var(--brand-ink)] hover:bg-black/5 border border-black/10 shadow-[0_10px_25px_rgba(11,16,32,0.12)] dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                >
                  Explore Track
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
