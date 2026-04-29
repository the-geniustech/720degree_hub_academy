"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { useProgrammesData } from "../components/ProgrammesProvider";

export function AboutPage() {
  const { data } = useProgrammesData();
  const { schedule } = data;
  return (
    <div className="pt-20">
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.4),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 opacity-20 texture-noise mix-blend-multiply" />
        <div className="-top-16 right-16 absolute bg-[rgba(240,128,16,0.22)] dark:bg-[rgba(240,128,16,0.28)] blur-3xl rounded-full w-44 h-44 parallax-slow" />
        <div className="bottom-4 left-8 absolute bg-[rgba(240,128,16,0.25)] dark:bg-[rgba(219,231,243,0.22)] blur-3xl rounded-full w-28 h-28 parallax-medium" />
        <div className="z-10 relative mx-auto px-6 max-w-6xl text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 shadow-[0_16px_40px_rgba(0,16,32,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.4)] mb-6 px-4 py-2 border border-black/10 dark:border-white/10 rounded-full">
              <Sparkles className="w-4 h-4 text-[var(--brand-orange)]" />
              <span className="font-semibold text-[var(--brand-ink)] text-sm">
                Our Philosophy
              </span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mb-6 font-display font-bold text-[var(--brand-ink)] text-5xl">
              We build builders who understand the business of what they build.
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto max-w-3xl text-slate-700 dark:text-slate-300 text-xl">
              720Degree Innovation Hub is a cohort-based, AI-integrated tech
              programme with a primary classroom in Abeokuta, a Lagos facility
              for online access, and global online delivery with full parity.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#00152a,#071a33)] py-20 overflow-hidden">
        <div className="-top-12 right-10 absolute bg-[rgba(219,231,243,0.2)] dark:bg-[rgba(240,128,16,0.22)] blur-3xl rounded-full w-32 h-32 parallax-fast" />
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="z-10 relative items-start gap-12 grid md:grid-cols-2 mx-auto px-6 max-w-6xl">
          <Reveal delay={0}>
            <div>
              <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-3xl">
                Why We Exist
              </h2>
              <p className="mb-6 text-slate-700 dark:text-slate-300">
                Nigeria has over 100 million people under 30, but access to
                quality tech education outside Lagos remains deeply inadequate.
                We built 720Degree to unlock world-class training in Abeokuta
                and make it accessible across Africa and the diaspora without
                compromising quality.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                The goal is simple: produce AI-literate professionals who can
                ship real products, understand how businesses make money, and
                raise the standard of tech work in their communities.
              </p>
            </div>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_22px_50px_rgba(0,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(0,16,32,0.18)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h3 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-xl">
              Programme at a Glance
            </h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>3 schools | 6 courses | 3 cohorts per year</li>
              <li>
                6 months of structured learning + 3 months post-grad support
              </li>
              <li>
                {schedule.days} | {schedule.time}
              </li>
              <li>
                Abeokuta primary classroom + Lagos facility + Global online
              </li>
              <li>AI integration and business modules across all tracks</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#00152a,#001b36)] py-20 overflow-hidden">
        <div className="-bottom-12 left-8 absolute bg-[rgba(240,128,16,0.2)] dark:bg-[rgba(240,128,16,0.25)] blur-3xl rounded-full w-36 h-36 parallax-medium" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="z-10 relative gap-8 grid md:grid-cols-2 mx-auto px-6 max-w-6xl">
          <Reveal
            delay={0}
            className="bg-white dark:bg-[#071a33] shadow-[0_22px_55px_rgba(0,16,32,0.12)] hover:shadow-[0_35px_70px_rgba(0,16,32,0.2)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h3 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-2xl">
              The 720Degree Difference
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              720Degree represents a double revolution: the first 360 is
              personal transformation - skills, professional identity, and
              earning power. The second 360 is the transformation graduates
              bring to their communities, clients, and industries.
            </p>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-white dark:bg-[#071a33] shadow-[0_22px_55px_rgba(0,16,32,0.12)] hover:shadow-[0_35px_70px_rgba(0,16,32,0.2)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h3 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-2xl">
              Community Compounds
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Alumni return as mentors, collaborators, and future employers.
              Every cohort strengthens the next, creating a compounding network
              of builders across Abeokuta, Lagos, and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#00152a,#071a33)] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-25 texture-dots" />
        <div className="-top-10 right-12 absolute bg-[rgba(240,128,16,0.2)] dark:bg-[rgba(219,231,243,0.2)] blur-3xl rounded-full w-32 h-32 parallax-fast" />
        <div className="z-10 relative mx-auto px-6 max-w-4xl text-center">
          <Reveal delay={0}>
            <h2 className="mb-6 font-display font-bold text-[var(--brand-ink)] text-4xl">
              Ready to Join the Next Cohort?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-8 text-slate-600 dark:text-slate-300 text-lg">
              Admissions are open for January, May, and September cohorts. Apply
              early to secure a seat.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Link
              href="/admissions#apply"
              className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] dark:hover:bg-[linear-gradient(135deg,#00305c,#ff9a2c)] shadow-[0_18px_50px_rgba(0,16,32,0.28)] dark:shadow-[0_22px_60px_rgba(240,128,16,0.35)] px-8 py-4 rounded-lg font-semibold text-white transition"
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
