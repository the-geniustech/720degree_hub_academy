"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  CheckCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import {
  calculateAmountDue,
  formatNaira,
  getBaseTuition,
  PaymentPlan,
} from "../lib/programs";
import { useProgrammesData } from "./ProgrammesProvider";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  programSlug?: string;
}

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  program: "",
  location: "abeokuta",
  cohort: "may",
  paymentPlan: "deposit",
  hearAbout: "",
};

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL || "/contact";

export function EnrollmentModal({
  isOpen,
  onClose,
  programSlug,
}: EnrollmentModalProps) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { data } = useProgrammesData();
  const programs = data.programs;
  const locations = data.locations;
  const cohorts = data.cohorts;

  useEffect(() => {
    if (programSlug) {
      setFormData((prev) => ({ ...prev, program: programSlug }));
    }
  }, [programSlug]);

  const program = useMemo(
    () => programs.find((item) => item.slug === formData.program),
    [formData.program, programs],
  );
  const baseTuition = useMemo(() => {
    if (!program) return 0;
    return getBaseTuition(
      program,
      formData.location as "abeokuta" | "lagos" | "online",
      locations,
    );
  }, [program, formData.location, locations]);

  const amountDue = useMemo(() => {
    return calculateAmountDue(baseTuition, formData.paymentPlan as PaymentPlan);
  }, [baseTuition, formData.paymentPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson
        ? await response.json()
        : { ok: false, error: "Unexpected server response" };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit enrollment");
      }

      setIsSubmitted(true);
      setPaymentUrl(data.payment?.authorization_url ?? null);
    } catch (error) {
      console.error("Enrollment submission failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetAndClose = () => {
    setFormData(initialForm);
    setIsSubmitted(false);
    setSubmitError(null);
    setPaymentUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="top-0 sticky flex justify-between items-center bg-[var(--brand-ink)] p-6 rounded-t-2xl text-white">
          <div>
            <h2 className="font-bold text-2xl">Apply to the Cohort</h2>
            <p className="text-white/80 text-sm">
              Secure your seat with a 75% enrolment payment.
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="py-10 text-center">
              <CheckCircle className="mx-auto mb-6 w-20 h-20 text-emerald-500" />
              <h3 className="mb-4 font-bold text-3xl">Application Received</h3>
              <p className="mb-6 text-slate-600 text-lg">
                Your application has been logged. Our admissions team will
                respond within 48 hours.
              </p>
              {paymentUrl ? (
                <div className="bg-[var(--brand-sand)] mb-6 p-6 rounded-xl text-left">
                  <h4 className="mb-2 font-semibold">Payment Link</h4>
                  <p className="text-slate-700 text-sm">
                    Click continue to securely complete your payment when you
                    are ready.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={paymentUrl}
                      className="inline-flex justify-center items-center bg-[var(--brand-ink)] px-6 py-3 rounded-lg font-semibold text-white transition hover:bg-black"
                    >
                      Continue to Payment
                    </a>
                    <a
                      href={communityUrl}
                      target={communityUrl.startsWith("http") ? "_blank" : undefined}
                      rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex justify-center items-center border border-black/10 px-6 py-3 rounded-lg font-semibold text-[var(--brand-ink)] transition hover:bg-black/5"
                    >
                      Join Our Community (Free)
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--brand-sand)] mb-6 p-6 rounded-xl text-left">
                  <h4 className="mb-2 font-semibold">Next Steps</h4>
                  <p className="text-slate-700 text-sm">
                    You will receive the programme pack and next-step
                    instructions by email.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={communityUrl}
                      target={communityUrl.startsWith("http") ? "_blank" : undefined}
                      rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex justify-center items-center border border-black/10 px-6 py-3 rounded-lg font-semibold text-[var(--brand-ink)] transition hover:bg-black/5"
                    >
                      Join Our Community (Free)
                    </a>
                  </div>
                </div>
              )}
              <button
                onClick={resetAndClose}
                className="bg-[var(--brand-ink)] hover:bg-black px-8 py-3 rounded-lg font-semibold text-white transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Information */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-lg">
                  <User className="w-5 h-5 text-[var(--brand-ink)]" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="gap-4 grid md:grid-cols-2">
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
                        className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
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
                        className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-lg">
                  <GraduationCap className="w-5 h-5 text-[var(--brand-ink)]" />
                  Program Selection
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="program"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Program *
                    </label>
                    <select
                      id="program"
                      name="program"
                      required
                      value={formData.program}
                      onChange={handleChange}
                      className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                    >
                      <option value="">Select a program</option>
                      {programs.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gap-4 grid md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="location"
                        className="block mb-2 font-semibold text-sm"
                      >
                        Study Location *
                      </label>
                      <select
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="cohort"
                        className="block mb-2 font-semibold text-sm"
                      >
                        Cohort Start *
                      </label>
                      <select
                        id="cohort"
                        name="cohort"
                        required
                        value={formData.cohort}
                        onChange={handleChange}
                        className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                      >
                        {cohorts.map((cohort) => (
                          <option key={cohort.id} value={cohort.id}>
                            {cohort.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-lg">
                  <CreditCard className="w-5 h-5 text-[var(--brand-ink)]" />
                  Payment Plan
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="paymentPlan"
                      className="block mb-2 font-semibold text-sm"
                    >
                      Payment Plan *
                    </label>
                    <select
                      id="paymentPlan"
                      name="paymentPlan"
                      required
                      value={formData.paymentPlan}
                      onChange={handleChange}
                      className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                    >
                      <option value="deposit">
                        75% at enrolment (25% by end of Month 2)
                      </option>
                      <option value="full">
                        Pay 100% upfront (5% discount)
                      </option>
                      <option value="scholarship">Apply for Scholarship</option>
                    </select>
                  </div>

                  <div className="bg-[var(--brand-sand)] p-4 border border-black/10 rounded-xl text-slate-700 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {program
                          ? `${program.title} tuition`
                          : "Programme tuition"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Base tuition</span>
                      <span className="font-semibold">
                        {program ? formatNaira(baseTuition) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Amount due now</span>
                      <span className="font-semibold">
                        {program ? formatNaira(amountDue) : "N/A"}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-500 text-xs">
                      Online tuition already includes the 15% reduction. Full
                      upfront discount is applied after the base tuition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-lg">
                  <Calendar className="w-5 h-5 text-[var(--brand-ink)]" />
                  Additional Context
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="hearAbout"
                      className="block mb-2 font-semibold text-sm"
                    >
                      How did you hear about us?
                    </label>
                    <select
                      id="hearAbout"
                      name="hearAbout"
                      value={formData.hearAbout}
                      onChange={handleChange}
                      className="px-4 py-3 border border-black/10 focus:border-black rounded-lg focus:outline-none w-full transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="instagram">Instagram</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="radio">Radio</option>
                      <option value="referral">Referral</option>
                      <option value="open-day">Open Day</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 hover:bg-black/5 px-6 py-3 border border-black/20 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[var(--brand-ink)] hover:bg-black disabled:opacity-50 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex justify-center items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>

              <p className="text-slate-500 text-xs text-center">
                By submitting this form, you agree to our Terms of Service and
                Privacy Policy.
              </p>

              {submitError ? (
                <p className="text-red-600 text-sm text-center">
                  {submitError}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
