'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Reveal } from '../components/Reveal';

type ApplicationRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programTitle: string;
  location: string;
  cohort: string;
  paymentPlan: string;
  amountDue: number;
  baseTuition: number;
  status: string;
  paidAmount: number | null;
  createdAt: string;
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  program: string | null;
  message: string;
  createdAt: string;
};

export function AdminDashboardPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    totals: { applications: number; contacts: number; totalPaid: number };
    statusCounts: Record<string, number>;
    applications: ApplicationRow[];
    contacts: ContactRow[];
  } | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/overview', {
        headers: {
          'x-admin-token': token,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load admin data');
      }
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[var(--brand-sand)]">
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="absolute -top-20 right-10 h-40 w-40 rounded-full bg-[rgba(219,231,243,0.2)] blur-3xl parallax-medium" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[rgba(240,128,16,0.2)] blur-3xl parallax-fast" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Reveal delay={0} speed="slow" className="bg-white border border-black/10 rounded-2xl p-8 mb-10 shadow-[0_22px_55px_rgba(0,16,32,0.12)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-ink)] text-white flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--brand-ink)]">Admin Dashboard</h1>
                <p className="text-slate-600 text-sm">Admissions + payment tracking (MongoDB)</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter ADMIN_TOKEN"
                className="flex-1 px-4 py-3 border border-black/10 rounded-lg focus:border-black focus:outline-none"
              />
              <button
                onClick={fetchOverview}
                disabled={loading || !token}
                className="px-6 py-3 bg-[var(--brand-orange)] text-white rounded-lg font-semibold hover:bg-[var(--brand-orange-strong)] transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load Dashboard'
                )}
              </button>
            </div>

            {error ? <p className="text-red-600 mt-4 text-sm">{error}</p> : null}
          </Reveal>

          {data ? (
            <div className="space-y-10">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Applications', value: data.totals.applications },
                  { label: 'Total Contacts', value: data.totals.contacts },
                  { label: 'Total Paid (NGN)', value: data.totals.totalPaid.toLocaleString('en-NG') },
                ].map((stat, index) => (
                  <Reveal
                    key={stat.label}
                    delay={index * 120}
                    speed="fast"
                    className="bg-white border border-black/10 rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,16,32,0.12)]"
                  >
                    <div className="text-sm text-slate-500">{stat.label}</div>
                    <div className="text-3xl font-bold text-[var(--brand-ink)]">{stat.value}</div>
                  </Reveal>
                ))}
              </div>

              <Reveal
                delay={0}
                speed="fast"
                className="bg-white border border-black/10 rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,16,32,0.12)]"
              >
                <h2 className="text-xl font-bold text-[var(--brand-ink)] mb-4">Status Breakdown</h2>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(data.statusCounts).map(([status, count], index) => (
                    <Reveal
                      key={status}
                      delay={index * 80}
                      speed="fast"
                      className="px-4 py-2 rounded-full bg-[var(--brand-sand)] border border-black/10 text-sm"
                    >
                      {status}: {count}
                    </Reveal>
                  ))}
                </div>
              </Reveal>

              <Reveal
                delay={0}
                speed="fast"
                className="bg-white border border-black/10 rounded-2xl p-6 overflow-x-auto shadow-[0_18px_40px_rgba(0,16,32,0.12)]"
              >
                <h2 className="text-xl font-bold text-[var(--brand-ink)] mb-4">Latest Applications</h2>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-black/10">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Program</th>
                      <th className="py-2 pr-4">Cohort</th>
                      <th className="py-2 pr-4">Location</th>
                      <th className="py-2 pr-4">Plan</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map((application) => (
                      <tr key={application.id} className="border-b border-black/5">
                        <td className="py-2 pr-4">
                          <div className="font-semibold">{application.fullName}</div>
                          <div className="text-xs text-slate-500">{application.email}</div>
                        </td>
                        <td className="py-2 pr-4">{application.programTitle}</td>
                        <td className="py-2 pr-4">{application.cohort}</td>
                        <td className="py-2 pr-4">{application.location}</td>
                        <td className="py-2 pr-4">{application.paymentPlan}</td>
                        <td className="py-2 pr-4">{application.status}</td>
                        <td className="py-2 pr-4">
                          {application.paidAmount ? application.paidAmount.toLocaleString('en-NG') : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>

              <Reveal
                delay={0}
                speed="fast"
                className="bg-white border border-black/10 rounded-2xl p-6 overflow-x-auto shadow-[0_18px_40px_rgba(0,16,32,0.12)]"
              >
                <h2 className="text-xl font-bold text-[var(--brand-ink)] mb-4">Recent Enquiries</h2>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-black/10">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Program</th>
                      <th className="py-2 pr-4">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.contacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-black/5">
                        <td className="py-2 pr-4">
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-xs text-slate-500">{contact.email}</div>
                        </td>
                        <td className="py-2 pr-4">{contact.program || 'General'}</td>
                        <td className="py-2 pr-4">{contact.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
