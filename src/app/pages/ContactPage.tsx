"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { useProgrammesData } from "../components/ProgrammesProvider";

export function ContactPage() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          program: "",
          message: "",
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.4),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 opacity-20 texture-noise mix-blend-multiply" />
        <div className="-top-16 right-10 absolute bg-[rgba(35,182,168,0.22)] dark:bg-[rgba(35,182,168,0.28)] blur-3xl rounded-full w-40 h-40 parallax-slow" />
        <div className="bottom-4 left-10 absolute bg-[rgba(246,176,66,0.2)] dark:bg-[rgba(154,210,255,0.2)] blur-3xl rounded-full w-32 h-32 parallax-medium" />

        <div className="z-10 relative mx-auto px-6 max-w-7xl text-center">
          <Reveal delay={0}>
            <h1 className="mb-6 font-display font-bold text-[var(--brand-ink)] text-5xl">
              Let's Talk
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto max-w-2xl text-slate-700 dark:text-slate-300 text-xl">
              Questions about admissions, cohort dates, or payment plans? We'll
              respond within 24-48 hours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="right-10 -bottom-12 absolute bg-[rgba(154,210,255,0.2)] dark:bg-[rgba(35,182,168,0.22)] blur-3xl rounded-full w-36 h-36 parallax-medium" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <div className="gap-12 grid lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <Reveal delay={0}>
                <h2 className="mb-8 font-display font-bold text-[var(--brand-ink)] text-3xl">
                  Contact Information
                </h2>
              </Reveal>
              <div className="space-y-6">
                <Reveal
                  delay={0}
                  className="flex items-start gap-4 bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] p-5 border border-black/10 dark:border-white/10 rounded-2xl"
                >
                  <div className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_12px_30px_rgba(11,16,32,0.25)] dark:shadow-[0_16px_40px_rgba(35,182,168,0.35)] p-3 rounded-xl text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-[var(--brand-ink)] text-lg">
                      Visit Us
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      720Degree Innovation Hub
                      <br />
                      ADUN House, 85 Ijemo Agbadu Road
                      <br />
                      National Library Building, Ake
                      <br />
                      Abeokuta, Ogun State, Nigeria
                    </p>
                  </div>
                </Reveal>

                <Reveal
                  delay={120}
                  className="flex items-start gap-4 bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] p-5 border border-black/10 dark:border-white/10 rounded-2xl"
                >
                  <div className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_12px_30px_rgba(11,16,32,0.25)] dark:shadow-[0_16px_40px_rgba(35,182,168,0.35)] p-3 rounded-xl text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-[var(--brand-ink)] text-lg">
                      Call Us
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      +234 800 720 TECH
                      <br />
                      Mon - Fri: 9AM - 6PM WAT
                    </p>
                  </div>
                </Reveal>

                <Reveal
                  delay={240}
                  className="flex items-start gap-4 bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] p-5 border border-black/10 dark:border-white/10 rounded-2xl"
                >
                  <div className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_12px_30px_rgba(11,16,32,0.25)] dark:shadow-[0_16px_40px_rgba(35,182,168,0.35)] p-3 rounded-xl text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-[var(--brand-ink)] text-lg">
                      Email Us
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      info@720Degreehub.com
                      <br />
                      admissions@720Degreehub.com
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Google Map */}
              <Reveal
                delay={320}
                className="bg-white dark:bg-[#141b29] shadow-[0_24px_60px_rgba(11,16,32,0.18)] dark:shadow-[0_26px_60px_rgba(0,0,0,0.5)] mt-8 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.0234567890123!2d3.3513147!3d7.1624577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103a4be3ce9e1fab%3A0xbc49e9d0343768d1!2s720Degree%20Hub!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="720Degree Innovation Hub Location"
                  className="w-full"
                />
              </Reveal>

              {/* Office Hours */}
              <Reveal
                delay={420}
                className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] mt-8 p-6 border border-black/10 dark:border-white/10 rounded-xl"
              >
                <h3 className="mb-4 font-semibold text-[var(--brand-ink)] text-lg">
                  Office Hours
                </h3>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Enquiry Form */}
            <div>
              <Reveal delay={0}>
                <h2 className="mb-8 font-display font-bold text-[var(--brand-ink)] text-3xl">
                  Send Us an Enquiry
                </h2>
              </Reveal>

              {isSubmitted ? (
                <Reveal delay={120}>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_22px_55px_rgba(16,185,129,0.18)] p-12 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-center">
                    <CheckCircle className="mx-auto mb-4 w-16 h-16 text-emerald-600 dark:text-emerald-200" />
                    <h3 className="mb-2 font-bold text-emerald-900 dark:text-emerald-100 text-2xl">
                      Thank You!
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-200">
                      Your enquiry has been received. We'll get back to you
                      within 24-48 hours.
                    </p>
                  </div>
                </Reveal>
              ) : (
                <Reveal
                  delay={120}
                  className="space-y-6 bg-white dark:bg-[#141b29] shadow-[0_30px_70px_rgba(11,16,32,0.12)] dark:shadow-[0_32px_70px_rgba(0,0,0,0.5)] p-8 border border-black/10 dark:border-white/10 rounded-2xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-[var(--brand-sand)] dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-teal)] rounded-lg focus:outline-none focus:ring-[var(--brand-teal)]/30 focus:ring-2 w-full dark:text-white transition-colors"
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
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[var(--brand-sand)] dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-teal)] rounded-lg focus:outline-none focus:ring-[var(--brand-teal)]/30 focus:ring-2 w-full dark:text-white transition-colors"
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
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-[var(--brand-sand)] dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-teal)] rounded-lg focus:outline-none focus:ring-[var(--brand-teal)]/30 focus:ring-2 w-full dark:text-white transition-colors"
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
                        name="program"
                        required
                        value={formData.program}
                        onChange={handleChange}
                        className="bg-[var(--brand-sand)] dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-teal)] rounded-lg focus:outline-none focus:ring-[var(--brand-teal)]/30 focus:ring-2 w-full dark:text-white transition-colors"
                      >
                        <option value="">Select a program</option>
                        {programs.map((program) => (
                          <option key={program.slug} value={program.slug}>
                            {program.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 font-semibold text-sm"
                      >
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="bg-[var(--brand-sand)] dark:bg-white/10 px-4 py-3 border border-black/10 focus:border-black dark:border-white/10 dark:focus:border-[var(--brand-teal)] rounded-lg focus:outline-none focus:ring-[var(--brand-teal)]/30 focus:ring-2 w-full dark:text-white transition-colors resize-none"
                        placeholder="Tell us about your goals or questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex justify-center items-center gap-2 bg-[var(--brand-ink)] hover:bg-black dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:hover:bg-[linear-gradient(135deg,#243152,#35e2cf)] disabled:opacity-50 shadow-[0_20px_50px_rgba(11,16,32,0.28)] dark:shadow-[0_24px_60px_rgba(35,182,168,0.35)] px-8 py-4 rounded-lg w-full font-semibold text-white transition-all disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Enquiry
                        </>
                      )}
                    </button>

                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                      We respect your privacy and will never share your
                      information.
                    </p>

                    {submitError ? (
                      <p className="text-red-600 text-sm text-center">
                        {submitError}
                      </p>
                    ) : null}
                  </form>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative bg-[var(--brand-sand)] py-20 overflow-hidden">
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="-top-12 left-8 absolute bg-[rgba(239,107,93,0.2)] blur-3xl rounded-full w-36 h-36 parallax-slow" />
        <div className="z-10 relative mx-auto px-6 max-w-4xl">
          <Reveal delay={0}>
            <h2 className="mb-12 font-display font-bold text-[var(--brand-ink)] text-3xl text-center">
              FAQs
            </h2>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                q: "When do new cohorts start?",
                a: "Cohorts start every January, May, and September. Admissions open roughly 6 weeks before each start date.",
              },
              {
                q: "What is the weekly schedule?",
                a: "Classes run Monday to Wednesday, 10:00am to 2:00pm WAT. Assignments and project work run Thursday to Sunday.",
              },
              {
                q: "How does payment work?",
                a: "Pay 75% at enrolment and the remaining 25% by the end of Month 2. Full upfront payments receive a 5% discount.",
              },
              {
                q: "Do you guarantee jobs after graduation?",
                a: "We do not guarantee jobs. We guarantee a portfolio of real projects and 3 months of career support, mentorship, and hiring introductions.",
              },
              {
                q: "Can I join from Lagos or outside Nigeria?",
                a: "Yes. Lagos students use the Lagos facility and join Abeokuta classes online. Global online students get full programme parity.",
              },
            ].map((faq, index) => (
              <Reveal
                key={index}
                delay={index * 120}
                className="bg-white shadow-[0_20px_45px_rgba(11,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(11,16,32,0.2)] p-6 border border-black/10 rounded-xl transform-gpu transition hover:-translate-y-1"
              >
                <h3 className="mb-2 font-semibold text-[var(--brand-ink)] text-lg">
                  {faq.q}
                </h3>
                <p className="text-slate-600">{faq.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
