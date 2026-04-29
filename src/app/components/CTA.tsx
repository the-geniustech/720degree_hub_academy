"use client";

import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { useProgrammesData } from "./ProgrammesProvider";

export function CTA() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cta",
          ...formData,
          message: "Programme pack request (CTA)",
        }),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson
        ? await response.json()
        : { ok: false, error: "Unexpected server response" };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", program: "" });
    } catch (error) {
      console.error("CTA submission failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="enroll"
      className="relative bg-[var(--brand-ink)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] py-20 overflow-hidden text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.2),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 texture-grid opacity-20" />
      <div className="right-10 -bottom-24 absolute bg-[rgba(240,128,16,0.25)] dark:bg-[rgba(219,231,243,0.25)] blur-3xl rounded-full w-40 h-40 parallax-slow" />
      <div className="z-10 relative mx-auto px-6 max-w-7xl">
        <div className="items-start gap-12 grid md:grid-cols-2">
          {/* Left side - CTA content */}
          <div>
            <Reveal delay={0} speed="slow">
              <h2 className="mb-6 font-display font-bold text-3xl md:text-4xl lg:text-5xl">
                Ready to Join the Next Cohort?
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mb-8 text-white/70 text-lg">
                Cohorts start in January, May, and September. Pay 75% at
                enrolment and the remaining 25% by the end of Month 2. Online
                learners receive 15% tuition reduction.
              </p>
            </Reveal>

            <div className="space-y-6 mb-8">
              <Reveal
                delay={200}
                speed="fast"
                className="flex items-start gap-4"
              >
                <div className="flex flex-shrink-0 justify-center items-center bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] rounded-lg w-12 h-12">
                  <Mail className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Email Us</h4>
                  <p className="text-white/70">info@720Degreehub.com</p>
                </div>
              </Reveal>

              <Reveal
                delay={280}
                speed="fast"
                className="flex items-start gap-4"
              >
                <div className="flex flex-shrink-0 justify-center items-center bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] rounded-lg w-12 h-12">
                  <Phone className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Call Us</h4>
                  <p className="text-white/70">+234 (0) 800 720 TECH</p>
                </div>
              </Reveal>

              <Reveal
                delay={360}
                speed="fast"
                className="flex items-start gap-4"
              >
                <div className="flex flex-shrink-0 justify-center items-center bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] rounded-lg w-12 h-12">
                  <MapPin className="text-white" size={22} />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Visit Us</h4>
                  <p className="text-white/70">
                    Abeokuta Hub (Primary) + Lagos Facility
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="parallax-slow">
              <Reveal
                delay={420}
                speed="fast"
                className="bg-white/10 dark:bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)] p-6 rounded-2xl"
              >
                <h4 className="mb-2 font-bold text-xl">
                  Next Cohort: May 2026
                </h4>
                <p className="text-white/70">
                  Limited seats per track. Admissions close when cohorts fill.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Right side - Enrollment form */}
          <div className="parallax-medium">
            <Reveal
              delay={200}
              speed="fast"
              className="bg-white dark:bg-[#071a33] shadow-[0_30px_70px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.55)] p-8 border border-white/20 dark:border-white/10 rounded-2xl text-[var(--brand-ink)] dark:text-white transform-gpu transition hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)]"
            >
              <h3 className="mb-6 font-bold text-2xl">
                Request the Programme Pack
              </h3>
              {submitted ? (
                <div className="bg-[var(--brand-sand)] dark:bg-white/10 p-6 border border-black/10 dark:border-white/10 rounded-xl dark:text-white/80 text-sm">
                  Thanks! Our team will send the full programme overview and
                  admissions guide within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white/80 dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-orange)] rounded-lg focus:outline-none w-full dark:text-white transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white/80 dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-orange)] rounded-lg focus:outline-none w-full dark:text-white transition"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-white/80 dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-orange)] rounded-lg focus:outline-none w-full dark:text-white transition"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="program"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Program of Interest *
                    </label>
                    <select
                      id="program"
                      required
                      value={formData.program}
                      onChange={(e) =>
                        setFormData({ ...formData, program: e.target.value })
                      }
                      className="bg-white/80 dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-orange)] rounded-lg focus:outline-none w-full dark:text-white transition"
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
                    className="flex justify-center items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] dark:bg-[linear-gradient(135deg,#002040,#f08010)] dark:hover:bg-[linear-gradient(135deg,#00305c,#ff9a2c)] disabled:opacity-60 px-8 py-4 rounded-lg w-full font-semibold text-white transition disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Send Programme Pack"}
                    <ArrowRight size={20} />
                  </button>

                  <p className="text-slate-500 dark:text-slate-400 text-xs text-center">
                    We respect your privacy. Your details are only used for
                    admissions follow-up.
                  </p>

                  {submitError ? (
                    <p className="text-red-600 text-sm text-center">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
