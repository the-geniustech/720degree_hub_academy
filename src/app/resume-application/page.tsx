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
    value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());

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
      setError(err instanceof Error ? err.message : "Unable to resume application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-sand)] pt-24">
      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_20px_50px_rgba(11,16,32,0.12)]">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--brand-sand)] px-4 py-2 text-xs font-semibold text-[var(--brand-ink)]">
                <Search className="h-4 w-4" />
                Resume Application
              </div>
              <h1 className="mt-4 text-3xl font-bold text-[var(--brand-ink)]">
                Find your application and continue payment.
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                Use your Paystack reference or the email + phone you used when you applied.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Payment Reference</label>
                <input
                  value={form.reference}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, reference: event.target.value }))
                  }
                  placeholder="720D-XXXX-XXXX"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Email address</label>
                  <input
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Phone number</label>
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="+234 800 000 0000"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              {result ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="font-semibold">Application located</div>
                      <div className="text-emerald-700/80">
                        {result.message || "You can continue your payment below."}
                      </div>
                      {result.application ? (
                        <div className="mt-2 text-xs text-emerald-700/80">
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

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {loading ? "Searching..." : "Find Application"}
                </button>
                <Link
                  href="/admissions#apply"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 px-6 py-3 text-sm font-semibold text-[var(--brand-ink)] transition hover:bg-black/5"
                >
                  Start New Application
                </Link>
              </div>
            </form>

            {result?.paymentUrl ? (
              <div className="mt-6 rounded-2xl border border-black/10 bg-[var(--brand-sand)] p-5">
                <div className="text-sm text-slate-600">
                  Ready to complete payment? Use the button below.
                </div>
                <a
                  href={result.paymentUrl}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--brand-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_18px_40px_rgba(11,16,32,0.12)]">
            <h2 className="text-xl font-bold text-[var(--brand-ink)]">Need a hand?</h2>
            <p className="mt-3 text-sm text-slate-600">
              If you cannot locate your application, our admissions team can help you recover it
              quickly.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
                Support email: admissions@720degreehub.com
              </div>
              <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
                Community: join our free cohort updates group.
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={communityUrl}
                target={communityUrl.startsWith("http") ? "_blank" : undefined}
                rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-[var(--brand-ink)] transition hover:bg-black/5"
              >
                Join Our Community (Free)
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
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
