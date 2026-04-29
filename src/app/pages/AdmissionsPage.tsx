'use client';

import { useState } from 'react';
import { ArrowRight, ClipboardCheck, FileText, MailOpen, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { Reveal } from '../components/Reveal';
import { useProgrammesData } from '../components/ProgrammesProvider';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Apply',
    description: 'Complete the cohort application form and select your preferred programme and location.',
  },
  {
    icon: FileText,
    title: 'Review',
    description: 'Admissions reviews applications within 48 hours and confirms eligibility.',
  },
  {
    icon: MailOpen,
    title: 'Offer',
    description: 'Receive your offer letter and onboarding pack.',
  },
  {
    icon: CreditCard,
    title: 'Enrol',
    description: 'Pay 75% to secure your seat (or 100% upfront for 5% discount).',
  },
  {
    icon: CheckCircle,
    title: 'Welcome',
    description: 'Join your cohort WhatsApp group and receive Day 1 instructions.',
  },
];

export function AdmissionsPage() {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const { data } = useProgrammesData();
  const { cohorts, programs, locations, schedule } = data;

  return (
    <div className="pt-20">
      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.35),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 texture-noise opacity-20 mix-blend-multiply" />
        <div className="absolute -top-16 right-10 h-40 w-40 rounded-full bg-[rgba(240,128,16,0.25)] blur-3xl parallax-slow dark:bg-[rgba(240,128,16,0.3)]" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[rgba(240,128,16,0.25)] blur-3xl parallax-medium dark:bg-[rgba(219,231,243,0.22)]" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0}>
            <h1 className="text-5xl font-bold text-[var(--brand-ink)] mb-6 font-display">Admissions</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Cohorts run in January, May, and September. Admissions open about six weeks before each cohort
              begins.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[linear-gradient(160deg,#00152a,#071a33)] relative overflow-hidden">
        <div className="absolute -top-10 left-12 h-28 w-28 rounded-full bg-[rgba(219,231,243,0.2)] blur-3xl parallax-fast dark:bg-[rgba(240,128,16,0.22)]" />
        <div className="absolute inset-0 texture-dots opacity-25" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Reveal delay={0}>
            <h2 className="text-3xl font-bold text-[var(--brand-ink)] mb-10 font-display text-center">
              Admissions Steps
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={step.title}
                  delay={index * 120}
                  className="bg-[var(--brand-sand)] border border-black/10 rounded-2xl p-5 shadow-[0_18px_40px_rgba(0,16,32,0.12)] hover:shadow-[0_30px_60px_rgba(0,16,32,0.18)] transition transform-gpu hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)] dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_30px_65px_rgba(240,128,16,0.25)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-ink)] text-white flex items-center justify-center mb-4 shadow-[0_12px_30px_rgba(0,16,32,0.25)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] dark:shadow-[0_18px_40px_rgba(240,128,16,0.35)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--brand-ink)] mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#00152a,#001b36)] relative overflow-hidden">
        <div className="absolute right-0 top-20 h-40 w-40 rounded-full bg-[rgba(217,103,4,0.2)] blur-3xl parallax-medium dark:bg-[rgba(219,231,243,0.2)]" />
        <div className="absolute inset-0 texture-dots opacity-20" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 relative z-10">
          <Reveal
            delay={0}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(0,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Cohort Schedule</h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              {cohorts.map((cohort) => (
                <li key={cohort.id}>
                  <span className="font-semibold">{cohort.label}</span> | {cohort.window}
                  <div className="text-sm text-slate-500 dark:text-slate-400">{cohort.note}</div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
              Weekly schedule: {schedule.days} | {schedule.time}
            </div>
          </Reveal>

          <Reveal
            delay={160}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(0,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Locations</h3>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              {locations.map((location) => (
                <li key={location.id}>
                  <div className="font-semibold">{location.label}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{location.description}</div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[linear-gradient(160deg,#00152a,#071a33)] relative overflow-hidden">
        <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-[rgba(240,128,16,0.18)] blur-3xl parallax-medium dark:bg-[rgba(240,128,16,0.25)]" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            <Reveal delay={0}>
              <div>
                <h3 className="text-3xl font-bold text-[var(--brand-ink)] mb-4 font-display">
                  Scholarships & Inclusion
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  We reserve scholarship seats every cohort and provide automatic discounts for women in tech.
                </p>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li>Full Scholarship: 2 seats per cohort (100% tuition)</li>
                  <li>Partial Scholarship: 3 seats per cohort (50% tuition)</li>
                  <li>Full scholarship requires a 300-word essay and a 15-minute interview.</li>
                  <li>Women in Tech Discount: 15% automatic discount</li>
                  <li>Sibling / Referral Discount: NGN 10,000 off for both parties</li>
                </ul>
              </div>
            </Reveal>

            <div>
              <Reveal delay={140}>
                <h3 className="text-3xl font-bold text-[var(--brand-ink)] mb-4 font-display">Programme Options</h3>
              </Reveal>
              <div className="grid gap-4">
                {programs.map((program, index) => (
                  <Reveal
                    key={program.slug}
                    delay={200 + index * 90}
                    className="bg-[var(--brand-sand)] border border-black/10 rounded-xl p-4 shadow-[0_14px_30px_rgba(0,16,32,0.12)] hover:shadow-[0_26px_55px_rgba(0,16,32,0.18)] transition dark:bg-[rgba(20,27,41,0.85)] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_28px_60px_rgba(240,128,16,0.25)]"
                  >
                    <div className="font-semibold text-[var(--brand-ink)]">{program.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{program.summary}</div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#00152a,#001b36)] relative overflow-hidden">
        <div className="absolute inset-0 texture-dots opacity-20" />
        <div className="absolute -bottom-10 right-12 h-32 w-32 rounded-full bg-[rgba(219,231,243,0.2)] blur-3xl parallax-fast dark:bg-[rgba(240,128,16,0.22)]" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start relative z-10">
          <Reveal
            delay={0}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_55px_rgba(0,16,32,0.12)] hover:shadow-[0_34px_70px_rgba(0,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Corporate Training</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              We partner with HR teams, founders, and SMEs to upskill staff or sponsor seats in the public
              cohort.
            </p>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>Sponsored student seats (staff enrolment) with priority onboarding.</li>
              <li>Dedicated private cohort for 10+ staff members.</li>
              <li>Custom curriculum mapping to company tools and stack.</li>
            </ul>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_55px_rgba(0,16,32,0.12)] hover:shadow-[0_34px_70px_rgba(0,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Why Companies Choose Us</h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>Industry practitioners deliver the sessions, not just instructors.</li>
              <li>AI integration improves output speed and team productivity.</li>
              <li>Dedicated reporting and progress updates for HR teams.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="apply" className="py-20 bg-[var(--brand-ink)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.25),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.35),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-25" />
        <div className="absolute -bottom-16 right-10 h-36 w-36 rounded-full bg-[rgba(240,128,16,0.25)] blur-3xl parallax-slow dark:bg-[rgba(219,231,243,0.25)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0}>
            <h2 className="text-4xl font-bold mb-6 font-display">Apply for the Next Cohort</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lg text-white/80 mb-8">
              Secure your seat with a 75% enrolment payment and get your onboarding pack instantly.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowEnrollModal(true)}
                className="inline-flex items-center gap-2 bg-white text-[var(--brand-ink)] px-8 py-4 rounded-lg font-semibold hover:bg-black/5 transition shadow-[0_20px_50px_rgba(0,0,0,0.35)] dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border dark:border-white/20 dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
              >
                Start Application
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/resume-application"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white/90 border border-white/40 hover:bg-white/10 transition"
              >
                Resume Application
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <EnrollmentModal isOpen={showEnrollModal} onClose={() => setShowEnrollModal(false)} />
    </div>
  );
}
