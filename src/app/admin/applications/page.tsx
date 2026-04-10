'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Loader2, RefreshCw, Download } from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { applicationStatuses } from '../lib/status';
import { formatDate, formatNaira } from '../lib/format';
import { exportRows, type ExportFormat } from '../lib/export';

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
  balanceDue: number;
  status: string;
  paidAmount: number | null;
  createdAt: string;
  updatedAt?: string;
};

type ApplicationsData = {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  totalPaid: number;
  statusCounts: Record<string, number>;
  applications: ApplicationRow[];
};

export default function ApplicationsPage() {
  const { token, status, profile } = useAdminAuth();
  const [data, setData] = useState<ApplicationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canEdit = profile?.role !== 'viewer';

  const exportApplications = async (format: ExportFormat) => {
    if (!token) return;
    setExporting(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('export', '1');
    if (search) params.set('search', search);
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);

    try {
      const response = await fetch(`/api/admin/applications?${params.toString()}`, {
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to export applications');
      }
      const rows = (result.data?.applications || []).map((application: ApplicationRow) => ({
        'Full Name': application.fullName,
        Email: application.email,
        Phone: application.phone,
        Programme: application.programTitle,
        Cohort: application.cohort,
        Location: application.location,
        'Payment Plan': application.paymentPlan,
        'Amount Due': application.amountDue,
        'Balance Due': application.balanceDue,
        'Paid Amount': application.paidAmount ?? 0,
        Status: application.status,
        'Submitted At': formatDate(application.createdAt),
        'Updated At': application.updatedAt ? formatDate(application.updatedAt) : '',
      }));
      const safeStatus = statusFilter === 'all' ? 'all' : statusFilter;
      const filename = `applications-${safeStatus}-${new Date().toISOString().slice(0, 10)}`;
      await exportRows({ rows, filename, format });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export applications');
    } finally {
      setExporting(false);
    }
  };

  const selectedApplication = useMemo(() => {
    if (!data?.applications.length) return null;
    return data.applications.find((application) => application.id === selectedId) ?? data.applications[0];
  }, [data, selectedId]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    if (!data?.applications.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !data.applications.some((application) => application.id === selectedId)) {
      setSelectedId(data.applications[0].id);
    }
  }, [data, selectedId]);

  const fetchApplications = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (search) params.set('search', search);
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);

    try {
      const response = await fetch(`/api/admin/applications?${params.toString()}`, {
        headers: {
          'x-admin-token': token,
        },
        signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load applications');
      }
      setData(result.data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unable to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    void fetchApplications(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token, page, pageSize, search, statusFilter]);

  const handleStatusChange = async (applicationId: string, nextStatus: string) => {
    if (!token || !canEdit) return;
    setSavingId(applicationId);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to update status');
      }

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          applications: prev.applications.map((application) =>
            application.id === applicationId
              ? { ...application, status: nextStatus }
              : application
          ),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminGate>
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Application Management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Review, filter, and update applicant status across cohorts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void fetchApplications()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => exportApplications('csv')}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportApplications('xlsx')}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Export XLSX
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, email, program..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <option value="all">All statuses</option>
              {applicationStatuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Total applications: <span className="font-semibold">{data?.total ?? 0}</span>
            </div>
          </div>

          {data?.statusCounts ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              {Object.entries(data.statusCounts).map(([statusKey, count]) => (
                <div
                  key={statusKey}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10"
                >
                  {statusKey.replace(/_/g, ' ')}: <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          ) : null}
          {data ? (
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Total paid: <span className="font-semibold">{formatNaira(data.totalPaid)}</span>
            </div>
          ) : null}
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '80ms' } as CSSProperties}
          >
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading applications...
              </div>
            ) : data?.applications.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10 dark:text-slate-400">
                      <th className="py-3 pr-4">Applicant</th>
                      <th className="py-3 pr-4">Program</th>
                      <th className="py-3 pr-4">Cohort</th>
                      <th className="py-3 pr-4">Plan</th>
                      <th className="py-3 pr-4">Amount Due</th>
                      <th className="py-3 pr-4">Paid</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map((application) => (
                      <tr
                        key={application.id}
                        className={`border-b border-slate-100 transition cursor-pointer dark:border-white/10 ${
                          selectedId === application.id
                            ? 'bg-slate-50 dark:bg-white/10'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                        onClick={() => setSelectedId(application.id)}
                      >
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{application.fullName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{application.email}</div>
                        </td>
                        <td className="py-3 pr-4">{application.programTitle}</td>
                        <td className="py-3 pr-4">{application.cohort}</td>
                        <td className="py-3 pr-4">{application.paymentPlan}</td>
                        <td className="py-3 pr-4">{formatNaira(application.amountDue)}</td>
                        <td className="py-3 pr-4">{formatNaira(application.paidAmount ?? 0)}</td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="py-3">
                          <select
                            value={application.status}
                            onChange={(event) =>
                              handleStatusChange(application.id, event.target.value)
                            }
                            disabled={savingId === application.id || !canEdit}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                          >
                            {applicationStatuses.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">No applications found for this filter.</p>
            )}

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {data?.page ?? 1} of {data?.pages ?? 1}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!data || data.page <= 1}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-white/10 dark:text-slate-300"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(data?.pages ?? prev, prev + 1))}
                disabled={!data || data.page >= data.pages}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-white/10 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
          </div>

          <div
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '140ms' } as CSSProperties}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Selected Snapshot</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Latest application details.</p>

            {selectedApplication ? (
              <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Applicant</div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {selectedApplication.fullName}
                  </div>
                  <div>{selectedApplication.email}</div>
                  <div>{selectedApplication.phone}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Programme</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedApplication.programTitle}
                  </div>
                  <div>{selectedApplication.location}</div>
                  <div>{selectedApplication.cohort}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Payment</div>
                  <div>Plan: {selectedApplication.paymentPlan}</div>
                  <div>Amount due: {formatNaira(selectedApplication.amountDue)}</div>
                  <div>Balance due: {formatNaira(selectedApplication.balanceDue)}</div>
                  <div>
                    Paid: {formatNaira(selectedApplication.paidAmount ?? 0)}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Timeline</div>
                  <div>Submitted: {formatDate(selectedApplication.createdAt)}</div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">No application selected.</p>
            )}
          </div>
        </section>
      </div>
    </AdminGate>
  );
}
