'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useProgrammesData } from '../components/ProgrammesProvider';

export function AboutPage() {
  const { data } = useProgrammesData();
  const { schedule } = data;
  return (
    <div className="pt-20">
      <section className="relative py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.4),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 texture-noise opacity-20 mix-blend-multiply" />
        <div className="absolute -top-16 right-16 h-44 w-44 rounded-full bg-[rgba(35,182,168,0.22)] blur-3xl parallax-slow dark:bg-[rgba(35,182,168,0.28)]" />
        <div className="absolute bottom-4 left-8 h-28 w-28 rounded-full bg-[rgba(246,176,66,0.25)] blur-3xl parallax-medium dark:bg-[rgba(154,210,255,0.22)]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-black/10 mb-6 shadow-[0_16px_40px_rgba(11,16,32,0.12)] dark:bg-white/10 dark:border-white/10 dark:shadow-[0_18px_45px_rgba(0,0,0,0.4)]">
              <Sparkles className="w-4 h-4 text-[var(--brand-teal)]" />
              <span className="text-sm font-semibold text-[var(--brand-ink)]">Our Philosophy</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-5xl font-bold mb-6 text-[var(--brand-ink)] font-display">
              We build builders who understand the business of what they build.
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              720degree Innovation Hub is a cohort-based, AI-integrated tech programme with a primary classroom in
              Abeokuta, a Lagos facility for online access, and global online delivery with full parity.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] relative overflow-hidden">
        <div className="absolute -top-12 right-10 h-32 w-32 rounded-full bg-[rgba(154,210,255,0.2)] blur-3xl parallax-fast dark:bg-[rgba(35,182,168,0.22)]" />
        <div className="absolute inset-0 texture-dots opacity-20" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start relative z-10">
          <Reveal delay={0}>
            <div>
              <h2 className="text-3xl font-bold text-[var(--brand-ink)] mb-4 font-display">Why We Exist</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Nigeria has over 100 million people under 30, but access to quality tech education outside Lagos
                remains deeply inadequate. We built 720degree to unlock world-class training in Abeokuta and make
                it accessible across Africa and the diaspora without compromising quality.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                The goal is simple: produce AI-literate professionals who can ship real products, understand how
                businesses make money, and raise the standard of tech work in their communities.
              </p>
            </div>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-[var(--brand-sand)] border border-black/10 rounded-2xl p-8 shadow-[0_22px_50px_rgba(11,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(11,16,32,0.18)] transition transform-gpu hover:-translate-y-1 dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)]"
          >
            <h3 className="text-xl font-bold text-[var(--brand-ink)] mb-4 font-display">Programme at a Glance</h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>3 schools | 6 courses | 3 cohorts per year</li>
              <li>6 months of structured learning + 3 months post-grad support</li>
              <li>
                {schedule.days} | {schedule.time}
              </li>
              <li>Abeokuta primary classroom + Lagos facility + Global online</li>
              <li>AI integration and business modules across all tracks</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] relative overflow-hidden">
        <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-[rgba(35,182,168,0.2)] blur-3xl parallax-medium dark:bg-[rgba(35,182,168,0.25)]" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 relative z-10">
          <Reveal
            delay={0}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_55px_rgba(11,16,32,0.12)] hover:shadow-[0_35px_70px_rgba(11,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">The 720degree Difference</h3>
            <p className="text-slate-700 dark:text-slate-300">
              720degree represents a double revolution: the first 360 is personal transformation - skills,
              professional identity, and earning power. The second 360 is the transformation graduates bring to
              their communities, clients, and industries.
            </p>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_55px_rgba(11,16,32,0.12)] hover:shadow-[0_35px_70px_rgba(11,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Community Compounds</h3>
            <p className="text-slate-700 dark:text-slate-300">
              Alumni return as mentors, collaborators, and future employers. Every cohort strengthens the next,
              creating a compounding network of builders across Abeokuta, Lagos, and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] relative overflow-hidden">
        <div className="absolute inset-0 texture-dots opacity-25" />
        <div className="absolute -top-10 right-12 h-32 w-32 rounded-full bg-[rgba(246,176,66,0.2)] blur-3xl parallax-fast dark:bg-[rgba(154,210,255,0.2)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0}>
            <h2 className="text-4xl font-bold text-[var(--brand-ink)] mb-6 font-display">
              Ready to Join the Next Cohort?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Admissions are open for January, May, and September cohorts. Apply early to secure a seat.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Link
              href="/admissions#apply"
              className="inline-flex items-center gap-2 bg-[var(--brand-ink)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-black transition shadow-[0_18px_50px_rgba(11,16,32,0.28)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:hover:bg-[linear-gradient(135deg,#243152,#35e2cf)] dark:shadow-[0_22px_60px_rgba(35,182,168,0.35)]"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
