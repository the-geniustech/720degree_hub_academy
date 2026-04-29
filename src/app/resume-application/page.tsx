"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Search, ArrowRight } from "lucide-react";

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL || "/contact";

export default function ResumeApplicationPage() {
  const [form, setForm] = useState({
    reference: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    status: string;
    message?: string;
    paymentUrl?: string;
    application?: { programTitle: string; cohort: string };
  } | null>(null);

  const formatCohort = (value: string) =>
    value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/enroll/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to resume application");
      }
      setResult({
        status: data.data?.status || "awaiting_payment",
        message: data.data?.message,
        paymentUrl: data.data?.payment?.authorization_url,
        application: data.data?.application,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resume application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--brand-sand)] pt-24 min-h-screen">
      <section className="mx-auto px-6 pb-16 w-full max-w-5xl">
        <div className="gap-8 grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white shadow-[0_20px_50px_rgba(0,16,32,0.12)] p-8 border border-black/10 rounded-3xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[var(--brand-sand)] px-4 py-2 border border-black/10 rounded-full font-semibold text-[var(--brand-ink)] text-xs">
                <Search className="w-4 h-4" />
                Resume Application
              </div>
              <h1 className="mt-4 font-bold text-[var(--brand-ink)] text-3xl">
                Find your application and continue payment.
              </h1>
              <p className="mt-3 text-slate-600 text-sm">
                Use your Paystack reference or the email + phone you used when
                you applied.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-sm">
                  Payment Reference
                </label>
                <input
                  value={form.reference}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      reference: event.target.value,
                    }))
                  }
                  placeholder="720D-XXXX-XXXX"
                  className="px-4 py-3 border border-black/10 focus:border-black rounded-xl focus:outline-none w-full text-sm"
                />
              </div>

              <div className="gap-4 grid md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Email address
                  </label>
                  <input
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    className="px-4 py-3 border border-black/10 focus:border-black rounded-xl focus:outline-none w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Phone number
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="+234 800 000 0000"
                    className="px-4 py-3 border border-black/10 focus:border-black rounded-xl focus:outline-none w-full text-sm"
                  />
                </div>
              </div>

              {error ? (
                <div className="bg-rose-50 px-4 py-3 border border-rose-200 rounded-xl text-rose-600 text-sm">
                  {error}
                </div>
              ) : null}

              {result ? (
                <div className="bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 w-4 h-4" />
                    <div>
                      <div className="font-semibold">Application located</div>
                      <div className="text-emerald-700/80">
                        {result.message ||
                          "You can continue your payment below."}
                      </div>
                      {result.application ? (
                        <div className="mt-2 text-emerald-700/80 text-xs">
                          Programme:{" "}
                          <span className="font-semibold">
                            {result.application.programTitle}
                          </span>{" "}
                          · Cohort:{" "}
                          <span className="font-semibold">
                            {formatCohort(result.application.cohort)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex sm:flex-row flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 justify-center items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] disabled:opacity-60 px-6 py-3 rounded-xl font-semibold text-white text-sm transition"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {loading ? "Searching..." : "Find Application"}
                </button>
                <Link
                  href="/admissions#apply"
                  className="inline-flex flex-1 justify-center items-center gap-2 hover:bg-black/5 px-6 py-3 border border-black/10 rounded-xl font-semibold text-[var(--brand-ink)] text-sm transition"
                >
                  Start New Application
                </Link>
              </div>
            </form>

            {result?.paymentUrl ? (
              <div className="bg-[var(--brand-sand)] mt-6 p-5 border border-black/10 rounded-2xl">
                <div className="text-slate-600 text-sm">
                  Ready to complete payment? Use the button below.
                </div>
                <a
                  href={result.paymentUrl}
                  className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] mt-3 px-6 py-3 rounded-xl font-semibold text-white text-sm transition"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : null}
          </div>

          <aside className="bg-white/80 shadow-[0_18px_40px_rgba(0,16,32,0.12)] p-8 border border-black/10 rounded-3xl">
            <h2 className="font-bold text-[var(--brand-ink)] text-xl">
              Need a hand?
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              If you cannot locate your application, our admissions team can
              help you recover it quickly.
            </p>
            <div className="space-y-3 mt-6 text-slate-600 text-sm">
              <div className="bg-white px-4 py-3 border border-black/10 rounded-xl">
                Support email: admissions@720Degreehub.com
              </div>
              <div className="bg-white px-4 py-3 border border-black/10 rounded-xl">
                Community: join our free cohort updates group.
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <a
                href={communityUrl}
                target={communityUrl.startsWith("http") ? "_blank" : undefined}
                rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex justify-center items-center hover:bg-black/5 px-5 py-3 border border-black/10 rounded-xl font-semibold text-[var(--brand-ink)] text-sm transition"
              >
                Join Our Community (Free)
              </a>
              <Link
                href="/contact"
                className="inline-flex justify-center items-center bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] px-5 py-3 rounded-xl font-semibold text-white text-sm transition"
              >
                Contact Admissions
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
