'use client';

import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from './Reveal';
import { useProgrammesData } from './ProgrammesProvider';

export function CTA() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'cta',
          ...formData,
          message: 'Programme pack request (CTA)',
        }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : { ok: false, error: 'Unexpected server response' };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', program: '' });
    } catch (error) {
      console.error('CTA submission failed:', error);
      const message =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enroll" className="py-20 bg-[var(--brand-ink)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.2),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 texture-grid opacity-20" />
      <div className="absolute -bottom-24 right-10 h-40 w-40 rounded-full bg-[rgba(246,176,66,0.25)] blur-3xl parallax-slow dark:bg-[rgba(154,210,255,0.25)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left side - CTA content */}
          <div>
            <Reveal delay={0} speed="slow">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-display">
                Ready to Join the Next Cohort?
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-lg text-white/70 mb-8">
                Cohorts start in January, May, and September. Pay 75% at enrolment and the remaining 25% by
                the end of Month 2. Online learners receive 15% tuition reduction.
              </p>
            </Reveal>

            <div className="space-y-6 mb-8">
              <Reveal delay={200} speed="fast" className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                  <Mail className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <p className="text-white/70">info@720degreehub.com</p>
                </div>
              </Reveal>

              <Reveal delay={280} speed="fast" className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                  <Phone className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <p className="text-white/70">+234 (0) 800 720 TECH</p>
                </div>
              </Reveal>

              <Reveal delay={360} speed="fast" className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                  <MapPin className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Visit Us</h4>
                  <p className="text-white/70">Abeokuta Hub (Primary) + Lagos Facility</p>
                </div>
              </Reveal>
            </div>

            <div className="parallax-slow">
              <Reveal
                delay={420}
                speed="fast"
                className="bg-white/10 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:bg-white/5 dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
              >
                <h4 className="font-bold text-xl mb-2">Next Cohort: May 2026</h4>
                <p className="text-white/70">Limited seats per track. Admissions close when cohorts fill.</p>
              </Reveal>
            </div>
          </div>

          {/* Right side - Enrollment form */}
          <div className="parallax-medium">
            <Reveal
              delay={200}
              speed="fast"
              className="bg-white text-[var(--brand-ink)] p-8 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/20 transform-gpu hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)] transition dark:bg-[#141b29] dark:text-white dark:border-white/10 dark:shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            >
              <h3 className="text-2xl font-bold mb-6">Request the Programme Pack</h3>
              {submitted ? (
                <div className="bg-[var(--brand-sand)] border border-black/10 rounded-xl p-6 text-sm dark:bg-white/10 dark:border-white/10 dark:text-white/80">
                  Thanks! Our team will send the full programme overview and admissions guide within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition bg-white/80 dark:bg-white/10 dark:border-white/10 dark:text-white dark:focus:border-[var(--brand-teal)]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition bg-white/80 dark:bg-white/10 dark:border-white/10 dark:text-white dark:focus:border-[var(--brand-teal)]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition bg-white/80 dark:bg-white/10 dark:border-white/10 dark:text-white dark:focus:border-[var(--brand-teal)]"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-semibold mb-2">
                    Program of Interest *
                  </label>
                  <select
                    id="program"
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition bg-white/80 dark:bg-white/10 dark:border-white/10 dark:text-white dark:focus:border-[var(--brand-teal)]"
                  >
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                      <option key={program.slug} value={program.slug}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand-ink)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:hover:bg-[linear-gradient(135deg,#243152,#35e2cf)]"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Programme Pack'}
                  <ArrowRight size={20} />
                </button>

                <p className="text-xs text-slate-500 text-center dark:text-slate-400">
                  We respect your privacy. Your details are only used for admissions follow-up.
                </p>

                {submitError ? <p className="text-sm text-red-600 text-center">{submitError}</p> : null}
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
