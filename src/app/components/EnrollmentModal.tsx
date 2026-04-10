'use client';

import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import {
  calculateAmountDue,
  formatNaira,
  getBaseTuition,
  PaymentPlan,
} from '../lib/programs';
import { useProgrammesData } from './ProgrammesProvider';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  programSlug?: string;
}

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  program: '',
  location: 'abeokuta',
  cohort: 'may',
  paymentPlan: 'deposit',
  hearAbout: '',
};

export function EnrollmentModal({ isOpen, onClose, programSlug }: EnrollmentModalProps) {
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
    [formData.program, programs]
  );
  const baseTuition = useMemo(() => {
    if (!program) return 0;
    return getBaseTuition(
      program,
      formData.location as 'abeokuta' | 'lagos' | 'online',
      locations
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
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : { ok: false, error: 'Unexpected server response' };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit enrollment');
      }

      setIsSubmitted(true);
      setPaymentUrl(data.payment?.authorization_url ?? null);
      if (data.payment?.authorization_url) {
        window.location.href = data.payment.authorization_url;
      }
    } catch (error) {
      console.error('Enrollment submission failed:', error);
      const message =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--brand-ink)] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Apply to the Cohort</h2>
            <p className="text-white/80 text-sm">Secure your seat with a 75% enrolment payment.</p>
          </div>
          <button onClick={resetAndClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Application Received</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Your application has been logged. Our admissions team will respond within 48 hours.
              </p>
              {paymentUrl ? (
                <div className="bg-[var(--brand-sand)] p-6 rounded-xl mb-6 text-left">
                  <h4 className="font-semibold mb-2">Payment Link</h4>
                  <p className="text-slate-700 text-sm">
                    You are being redirected to Paystack. If the redirect fails, use the button below.
                  </p>
                  <a
                    href={paymentUrl}
                    className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[var(--brand-ink)] text-white rounded-lg font-semibold"
                  >
                    Continue to Payment
                  </a>
                </div>
              ) : (
                <div className="bg-[var(--brand-sand)] p-6 rounded-xl mb-6 text-left">
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <p className="text-slate-700 text-sm">
                    You will receive the programme pack and next-step instructions by email.
                  </p>
                </div>
              )}
              <button
                onClick={resetAndClose}
                className="bg-[var(--brand-ink)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-black transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--brand-ink)]" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
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
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[var(--brand-ink)]" />
                  Program Selection
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="program" className="block text-sm font-semibold mb-2">
                      Program *
                    </label>
                    <select
                      id="program"
                      name="program"
                      required
                      value={formData.program}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="">Select a program</option>
                      {programs.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold mb-2">
                        Study Location *
                      </label>
                      <select
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="cohort" className="block text-sm font-semibold mb-2">
                        Cohort Start *
                      </label>
                      <select
                        id="cohort"
                        name="cohort"
                        required
                        value={formData.cohort}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
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
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[var(--brand-ink)]" />
                  Payment Plan
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="paymentPlan" className="block text-sm font-semibold mb-2">
                      Payment Plan *
                    </label>
                    <select
                      id="paymentPlan"
                      name="paymentPlan"
                      required
                      value={formData.paymentPlan}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="deposit">75% at enrolment (25% by end of Month 2)</option>
                      <option value="full">Pay 100% upfront (5% discount)</option>
                      <option value="scholarship">Apply for Scholarship</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-[var(--brand-sand)] p-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {program ? `${program.title} tuition` : 'Programme tuition'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Base tuition</span>
                      <span className="font-semibold">{program ? formatNaira(baseTuition) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span>Amount due now</span>
                      <span className="font-semibold">{program ? formatNaira(amountDue) : 'N/A'}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Online tuition already includes the 15% reduction. Full upfront discount is applied after
                      the base tuition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--brand-ink)]" />
                  Additional Context
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hearAbout" className="block text-sm font-semibold mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      id="hearAbout"
                      name="hearAbout"
                      value={formData.hearAbout}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none transition-colors"
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
                  className="flex-1 px-6 py-3 border border-black/20 rounded-lg font-semibold hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[var(--brand-ink)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                By submitting this form, you agree to our Terms of Service and Privacy Policy.
              </p>

              {submitError ? <p className="text-sm text-red-600 text-center">{submitError}</p> : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
