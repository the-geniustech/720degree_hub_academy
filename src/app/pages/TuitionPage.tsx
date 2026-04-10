'use client';

import { calculateAmountDue, formatNaira } from '../lib/programs';
import { Reveal } from '../components/Reveal';
import { useProgrammesData } from '../components/ProgrammesProvider';

export function TuitionPage() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  return (
    <div className="pt-20">
      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.35),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 texture-noise opacity-20 mix-blend-multiply" />
        <div className="absolute -top-16 right-10 h-36 w-36 rounded-full bg-[rgba(35,182,168,0.25)] blur-3xl parallax-slow dark:bg-[rgba(35,182,168,0.3)]" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0}>
            <h1 className="text-5xl font-bold text-[var(--brand-ink)] mb-6 font-display">Tuition & Payment</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Pay 75% at enrolment and the remaining 25% by the end of Month 2. Full upfront payments receive
              a 5% discount. Online students receive 15% reduction on the base tuition.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] relative overflow-hidden">
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-[rgba(246,176,66,0.2)] blur-3xl parallax-medium dark:bg-[rgba(154,210,255,0.2)]" />
        <div className="absolute inset-0 texture-dots opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Reveal delay={0} className="overflow-x-auto border border-black/10 rounded-2xl shadow-[0_30px_70px_rgba(11,16,32,0.15)] dark:border-white/10 dark:shadow-[0_32px_70px_rgba(0,0,0,0.45)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--brand-ink)] text-white dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]">
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
                  const deposit = calculateAmountDue(program.onsiteTuition, 'deposit');
                  const balance = program.onsiteTuition - deposit;
                  return (
                    <tr
                      key={program.slug}
                      className={
                        index % 2 === 0
                          ? 'bg-white dark:bg-[#141b29]'
                          : 'bg-[var(--brand-sand)] dark:bg-[#0f1522]'
                      }
                    >
                      <td className="px-6 py-4 font-semibold text-[var(--brand-ink)]">{program.title}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{program.school}</td>
                      <td className="px-6 py-4">{formatNaira(program.onsiteTuition)}</td>
                      <td className="px-6 py-4">{formatNaira(program.onlineTuition)}</td>
                      <td className="px-6 py-4">{formatNaira(deposit)}</td>
                      <td className="px-6 py-4">{formatNaira(balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] relative overflow-hidden">
        <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-[rgba(154,210,255,0.25)] blur-3xl parallax-medium dark:bg-[rgba(35,182,168,0.22)]" />
        <div className="absolute inset-0 texture-dots opacity-20" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 relative z-10">
          <Reveal
            delay={0}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_50px_rgba(11,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(11,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Payment Structure</h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>75% due at enrolment to confirm your seat.</li>
              <li>25% balance due by the end of Month 2.</li>
              <li>Full upfront payment earns a 5% discount.</li>
              <li>Online discount (15%) is applied before upfront discount.</li>
              <li>Grace period of 7 days after Month 2 for outstanding balance.</li>
            </ul>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-white border border-black/10 rounded-2xl p-8 shadow-[0_22px_50px_rgba(11,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(11,16,32,0.2)] transition transform-gpu hover:-translate-y-1 dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)]"
          >
            <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-4 font-display">Scholarships</h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>Full Scholarship: 2 seats per cohort (100% tuition).</li>
              <li>Partial Scholarship: 3 seats per cohort (50% tuition).</li>
              <li>Women in Tech: 15% automatic discount for female applicants.</li>
              <li>Sibling / Referral: NGN 10,000 discount for both parties.</li>
              <li>Corporate Sponsored: direct invoicing for sponsored staff.</li>
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
