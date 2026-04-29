import { BookOpen, Layers, Briefcase, Rocket, Sparkles, BadgeCheck } from 'lucide-react';
import { Reveal } from './Reveal';

const phases = [
  {
    icon: BookOpen,
    phase: 'Month 1',
    title: 'Foundation',
    description: 'Core fundamentals, professional tools, AI orientation, and first hands-on exercises.',
    format: '3 x 4-hour sessions per week + assignments',
  },
  {
    icon: Layers,
    phase: 'Months 2-3',
    title: 'Core Build',
    description: 'Deep curriculum execution with the first real project and monthly expert sessions.',
    format: 'Sessions + real project hours (async)',
  },
  {
    icon: Sparkles,
    phase: 'Month 4',
    title: 'Advanced Application',
    description: 'Business Module I begins; cross-school teams form for shared product brief.',
    format: 'Sessions + cross-school project',
  },
  {
    icon: Briefcase,
    phase: 'Month 5',
    title: 'Industry Immersion',
    description: 'Live brief from industry partner with expert panel review.',
    format: 'Intensive project + sessions',
  },
  {
    icon: Rocket,
    phase: 'Month 6',
    title: 'Graduation Sprint',
    description: 'Personal graduation project, portfolio completion, CV and job prep.',
    format: 'Build sprint + 2 instruction sessions',
  },
  {
    icon: BadgeCheck,
    phase: 'Months 7-9',
    title: 'Post-Grad Support (Free)',
    description: 'Free workspace, bi-weekly career mentorship, hiring introductions, alumni community.',
    format: 'Self-directed + monthly sessions',
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="py-20 bg-white dark:bg-[linear-gradient(160deg,#00152a,#001b36)] relative overflow-hidden">
      <div className="absolute left-0 top-24 h-48 w-48 rounded-full bg-[rgba(240,128,16,0.18)] blur-3xl parallax-medium dark:bg-[rgba(240,128,16,0.25)]" />
      <div className="absolute right-0 bottom-10 h-40 w-40 rounded-full bg-[rgba(240,128,16,0.22)] blur-3xl parallax-fast dark:bg-[rgba(219,231,243,0.2)]" />
      <div className="absolute inset-0 texture-dots opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Reveal delay={0} speed="slow">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--brand-ink)] mb-4 font-display">
              The 6-Month Learning Journey
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Structured, cohort-based learning with a clear path from foundations to portfolio-ready outcomes.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <Reveal
                key={phase.title}
                delay={index * 110}
                speed="fast"
                className="bg-[var(--brand-sand)] border border-black/10 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,16,32,0.1)] hover:shadow-[0_26px_55px_rgba(0,16,32,0.18)] transition transform-gpu hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)] dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_30px_65px_rgba(240,128,16,0.25)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-ink)] flex items-center justify-center shadow-[0_12px_30px_rgba(0,16,32,0.25)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] dark:shadow-[0_18px_40px_rgba(240,128,16,0.35)]">
                    <Icon className="text-white" size={22} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {phase.phase}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-ink)] mb-2">{phase.title}</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">{phase.description}</p>
                <div className="text-sm text-slate-500 dark:text-slate-400">{phase.format}</div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
