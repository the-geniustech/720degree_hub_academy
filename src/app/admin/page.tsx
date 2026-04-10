'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, Users, Wallet } from 'lucide-react';
import { AdminGate } from './components/AdminGate';
import { StatusBadge } from './components/StatusBadge';
import { useAdminAuth } from './components/AdminAuthProvider';
import { formatDate, formatNaira } from './lib/format';

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

type OverviewData = {
  totals: { applications: number; contacts: number; totalPaid: number };
  statusCounts: Record<string, number>;
  applications: ApplicationRow[];
  contacts: ContactRow[];
};

export default function AdminOverviewPage() {
  const { token, status } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/overview', {
          headers: {
            'x-admin-token': token,
          },
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          throw new Error(result.error || 'Unable to load overview');
        }
        setData(result.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unable to load overview');
      } finally {
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [status, token]);

  return (
    <AdminGate>
      <div className="space-y-8 pt-8">
        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              label: 'Total Applications',
              value: data?.totals.applications ?? 0,
              icon: TrendingUp,
            },
            {
              label: 'Active Contacts',
              value: data?.totals.contacts ?? 0,
              icon: Users,
            },
            {
              label: 'Total Paid',
              value: formatNaira(data?.totals.totalPaid ?? 0),
              icon: Wallet,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                style={{ '--delay': `${index * 50}ms` } as CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '120ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Application Pipeline</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Monitor where applicants are in the funnel.</p>
            </div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Manage applications
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {data ? (
              Object.entries(data.statusCounts).map(([statusKey, count]) => (
                <div key={statusKey} className="flex items-center gap-2">
                  <StatusBadge status={statusKey} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{count} applicants</span>
                </div>
              ))
            ) : loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading pipeline...
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">No pipeline data yet.</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '160ms' } as CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Applications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">Last 50 submissions.</p>
              </div>
              <Link
                href="/admin/applications"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading applications...
                </div>
              ) : error ? (
                <p className="text-sm text-rose-600">{error}</p>
              ) : data?.applications.length ? (
                data.applications.slice(0, 6).map((application, index) => (
                  <div
                    key={application.id}
                    className="admin-reveal rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                    style={{ '--delay': `${200 + index * 40}ms` } as CSSProperties}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {application.fullName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{application.email}</p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{application.programTitle}</span>
                      <span>{application.location}</span>
                      <span>{application.cohort}</span>
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-300">No applications yet.</p>
              )}
            </div>
          </div>

          <div
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '220ms' } as CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Contacts</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">Last 20 enquiries.</p>
              </div>
              <Link
                href="/admin/contacts"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading contacts...
                </div>
              ) : error ? (
                <p className="text-sm text-rose-600">{error}</p>
              ) : data?.contacts.length ? (
                data.contacts.slice(0, 6).map((contact, index) => (
                  <div
                    key={contact.id}
                    className="admin-reveal rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                    style={{ '--delay': `${240 + index * 40}ms` } as CSSProperties}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{contact.email}</p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{contact.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-300">No contacts yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminGate>
  );
}
