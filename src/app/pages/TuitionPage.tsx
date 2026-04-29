import Link from "next/link";
import type { ProgramDetail } from "../lib/programs";
import { calculateAmountDue, formatNaira } from "../lib/programs";
import { Reveal } from "../components/Reveal";

interface TuitionPageProps {
  programs: ProgramDetail[];
  unavailableMessage?: string;
}

export function TuitionPage({
  programs,
  unavailableMessage,
}: TuitionPageProps) {
  const hasLivePricing = programs.length > 0 && !unavailableMessage;

  return (
    <div className="pt-20">
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.35),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 opacity-20 texture-noise mix-blend-multiply" />
        <div className="-top-16 right-10 absolute bg-[rgba(240,128,16,0.25)] dark:bg-[rgba(240,128,16,0.3)] blur-3xl rounded-full w-36 h-36 parallax-slow" />
        <div className="z-10 relative mx-auto px-6 max-w-6xl text-center">
          <Reveal delay={0}>
            <h1 className="mb-6 font-display font-bold text-[var(--brand-ink)] text-5xl">
              Tuition & Payment
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto max-w-3xl text-slate-700 dark:text-slate-300 text-xl">
              Pay 75% at enrolment and the remaining 25% by the end of Month 2.
              Full upfront payments receive a 5% discount. Online students
              receive 15% reduction on the base tuition.
            </p>
          </Reveal>
          {/* <Reveal delay={220}>
            <div className="inline-flex items-center bg-white/70 dark:bg-white/10 shadow-[0_12px_30px_rgba(0,16,32,0.08)] backdrop-blur mt-6 px-4 py-2 border border-black/10 dark:border-white/10 rounded-full font-medium text-slate-700 dark:text-slate-200 text-sm">
              {hasLivePricing
                ? 'Live programme pricing from backend'
                : 'Live programme pricing is temporarily unavailable'}
            </div>
          </Reveal> */}
        </div>
      </section>

      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#00152a,#071a33)] py-20 overflow-hidden">
        <div className="-bottom-10 left-10 absolute bg-[rgba(240,128,16,0.2)] dark:bg-[rgba(219,231,243,0.2)] blur-3xl rounded-full w-32 h-32 parallax-medium" />
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="z-10 relative mx-auto px-6 max-w-6xl">
          {hasLivePricing ? (
            <Reveal
              delay={0}
              className="shadow-[0_30px_70px_rgba(0,16,32,0.15)] dark:shadow-[0_32px_70px_rgba(0,0,0,0.45)] border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto"
            >
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] text-white">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">School</th>
                    <th className="px-6 py-4">Onsite Tuition</th>
                    <th className="px-6 py-4">Online Tuition</th>
                    <th className="px-6 py-4">75% Enrolment</th>
                    <th className="px-6 py-4">25% Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program, index) => {
                    const deposit = calculateAmountDue(
                      program.onsiteTuition,
                      "deposit",
                    );
                    const balance = program.onsiteTuition - deposit;
                    return (
                      <tr
                        key={program.slug}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-[#071a33]"
                            : "bg-[var(--brand-sand)] dark:bg-[#00152a]"
                        }
                      >
                        <td className="px-6 py-4 font-semibold text-[var(--brand-ink)]">
                          {program.title}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {program.school}
                        </td>
                        <td className="px-6 py-4">
                          {formatNaira(program.onsiteTuition)}
                        </td>
                        <td className="px-6 py-4">
                          {formatNaira(program.onlineTuition)}
                        </td>
                        <td className="px-6 py-4">{formatNaira(deposit)}</td>
                        <td className="px-6 py-4">{formatNaira(balance)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Reveal>
          ) : (
            <Reveal
              delay={0}
              className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.88)] shadow-[0_30px_70px_rgba(0,16,32,0.12)] dark:shadow-[0_32px_70px_rgba(0,0,0,0.45)] p-10 border border-black/10 dark:border-white/10 rounded-[28px]"
            >
              <div className="max-w-3xl">
                <div className="inline-flex items-center bg-amber-100/80 dark:bg-amber-300/10 px-4 py-2 border border-amber-300/60 dark:border-amber-400/20 rounded-full font-semibold text-amber-800 dark:text-amber-200 text-xs uppercase tracking-[0.2em]">
                  Backend sync pending
                </div>
                <h2 className="mt-5 font-display font-bold text-[var(--brand-ink)] text-3xl">
                  Live tuition data is not published yet
                </h2>
                <p className="mt-4 text-slate-700 dark:text-slate-300 text-base leading-7">
                  We are keeping this page backend-driven only, so tuition
                  figures will appear here as soon as programmes, locations,
                  cohorts, and schedule data are configured in MongoDB.
                </p>
                {unavailableMessage ? (
                  <p className="bg-white/80 dark:bg-white/5 mt-4 px-4 py-3 border border-black/10 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-300 text-sm">
                    {unavailableMessage}
                  </p>
                ) : null}
                <div className="flex sm:flex-row flex-col gap-3 mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex justify-center items-center bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] dark:hover:bg-[linear-gradient(135deg,#00305c,#ff9a2c)] shadow-[0_18px_50px_rgba(0,16,32,0.24)] px-6 py-3 rounded-full font-semibold text-white text-sm transition"
                  >
                    Contact Admissions
                  </Link>
                  <Link
                    href="/admissions"
                    className="inline-flex justify-center items-center bg-white hover:bg-black/5 dark:bg-white/10 dark:hover:bg-white/15 px-6 py-3 border border-black/10 dark:border-white/10 rounded-full font-semibold text-[var(--brand-ink)] dark:text-white text-sm transition"
                  >
                    View Admissions Guide
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#00152a,#001b36)] py-20 overflow-hidden">
        <div className="top-10 right-10 absolute bg-[rgba(219,231,243,0.25)] dark:bg-[rgba(240,128,16,0.22)] blur-3xl rounded-full w-32 h-32 parallax-medium" />
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="z-10 relative gap-10 grid md:grid-cols-2 mx-auto px-6 max-w-6xl">
          <Reveal
            delay={0}
            className="bg-white dark:bg-[#071a33] shadow-[0_22px_50px_rgba(0,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(0,16,32,0.2)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)] dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h3 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-2xl">
              Payment Structure
            </h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>75% due at enrolment to confirm your seat.</li>
              <li>25% balance due by the end of Month 2.</li>
              <li>Full upfront payment earns a 5% discount.</li>
              <li>Online discount (15%) is applied before upfront discount.</li>
              <li>
                Grace period of 7 days after Month 2 for outstanding balance.
              </li>
            </ul>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-white dark:bg-[#071a33] shadow-[0_22px_50px_rgba(0,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(0,16,32,0.2)] dark:hover:shadow-[0_32px_70px_rgba(240,128,16,0.25)] dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h3 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-2xl">
              Scholarships
            </h3>
            {hasLivePricing ? (
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li>Full Scholarship: 2 seats per cohort (100% tuition).</li>
                <li>Partial Scholarship: 3 seats per cohort (50% tuition).</li>
                <li>
                  Women in Tech: 15% automatic discount for female applicants.
                </li>
                <li>
                  Sibling / Referral: NGN 10,000 discount for both parties.
                </li>
                <li>
                  Corporate Sponsored: direct invoicing for sponsored staff.
                </li>
              </ul>
            ) : (
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  Scholarship availability is published alongside each live
                  cohort setup.
                </p>
                <p>
                  Once the backend tuition catalogue is configured, this section
                  will reflect the current scholarship options and commercial
                  terms for the active intake.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
