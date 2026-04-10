'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { formatDate } from '../lib/format';

type ActivityLog = {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

type ActivityResponse = {
  total: number;
  page: number;
  pages: number;
  pageSize: number;
  logs: ActivityLog[];
};

export default function ActivityPage() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', '25');
      if (actionFilter) params.set('action', actionFilter);
      if (entityFilter) params.set('entityType', entityFilter);

      const response = await fetch(`/api/admin/activity?${params.toString()}`, {
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load activity logs');
      }
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    void loadLogs();
  }, [token, page, actionFilter, entityFilter]);

  return (
    <AdminGate>
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Log</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Track every admin action across programmes, applications, and users.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadLogs()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <input
              value={actionFilter}
              onChange={(event) => {
                setActionFilter(event.target.value);
                setPage(1);
              }}
              placeholder="Filter by action (e.g. programme.create)"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            />
            <input
              value={entityFilter}
              onChange={(event) => {
                setEntityFilter(event.target.value);
                setPage(1);
              }}
              placeholder="Filter by entity (program, location, admin_user)"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            />
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Total: <span className="font-semibold">{data?.total ?? 0}</span>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading activity...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '80ms' } as CSSProperties}
        >
          {data?.logs?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10 dark:text-slate-400">
                    <th className="py-3 pr-4">Actor</th>
                    <th className="py-3 pr-4">Action</th>
                    <th className="py-3 pr-4">Entity</th>
                    <th className="py-3 pr-4">Metadata</th>
                    <th className="py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 dark:border-white/10">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{log.actorName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.actorRole}</div>
                      </td>
                      <td className="py-3 pr-4">{log.action}</td>
                      <td className="py-3 pr-4">
                        <div className="text-sm text-slate-700 dark:text-slate-300">{log.entityType}</div>
                        <div className="text-xs text-slate-400">{log.entityId || '-'}</div>
                      </td>
                      <td className="py-3 pr-4">
                        {log.metadata ? (
                          <div className="max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                            {JSON.stringify(log.metadata)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-300">No activity logged yet.</p>
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
        </section>
      </div>
    </AdminGate>
  );
}
