'use client';

import { Award, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';
import { useProgrammesData } from './ProgrammesProvider';

export function SuccessStories() {
  const { data } = useProgrammesData();
  const standards = data.programs.map((program) => ({
    title: program.title,
    school: program.school,
    standard: program.graduationStandard,
  }));

  return (
    <section className="py-20 px-6 bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] relative overflow-hidden">
      <div className="absolute -top-24 left-10 h-36 w-36 rounded-full bg-[rgba(35,182,168,0.15)] blur-3xl parallax-medium dark:bg-[rgba(35,182,168,0.24)]" />
      <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-[rgba(154,210,255,0.2)] blur-3xl parallax-fast dark:bg-[rgba(154,210,255,0.2)]" />
      <div className="absolute inset-0 texture-dots opacity-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Reveal delay={0} speed="slow">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-sand)] border border-black/10 mb-4 dark:bg-white/10 dark:border-white/10">
              <Award className="w-4 h-4 text-[var(--brand-ink)]" />
              <span className="text-sm font-semibold text-[var(--brand-ink)]">Graduate Benchmarks</span>
            </div>
          </Reveal>
          <Reveal delay={120} speed="slow">
            <h2 className="text-4xl md:text-5xl mb-4 font-display text-[var(--brand-ink)]">
              What Every Graduate Leaves With
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              These are the non-negotiable outcomes baked into the curriculum for every track.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {standards.map((standard, index) => (
            <Reveal
              key={standard.title}
              delay={index * 120}
              speed="fast"
              className="bg-[var(--brand-sand)] rounded-2xl border border-black/10 p-8 shadow-[0_20px_45px_rgba(11,16,32,0.12)] hover:shadow-[0_30px_60px_rgba(11,16,32,0.18)] transition transform-gpu hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(1deg)] dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_30px_70px_rgba(35,182,168,0.25)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--brand-ink)]">{standard.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{standard.school} School</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-[var(--brand-teal)]" />
              </div>
              <p className="text-slate-700 dark:text-slate-300">{standard.standard}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            '4+ deployed projects or case studies, verified and portfolio-ready.',
            'AI literacy built into every workflow, not an optional add-on.',
            '3 months of post-grad career support and hiring introductions.',
          ].map((note, index) => (
            <Reveal
              key={note}
              delay={index * 120}
              speed="fast"
              className="bg-white border border-black/10 rounded-2xl p-6 text-sm text-slate-700 shadow-[0_16px_35px_rgba(11,16,32,0.08)] dark:bg-[#141b29] dark:border-white/10 dark:text-slate-300 dark:shadow-[0_20px_45px_rgba(0,0,0,0.4)]"
            >
              {note}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
