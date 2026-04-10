'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Loader2, RefreshCw, Download } from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { formatDate } from '../lib/format';
import { exportRows, type ExportFormat } from '../lib/export';

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  program: string | null;
  message: string;
  source: string | null;
  createdAt: string;
};

type ContactsData = {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  sourceCounts: Record<string, number>;
  contacts: ContactRow[];
};

export default function ContactsPage() {
  const { token, status } = useAdminAuth();
  const [data, setData] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedContact = useMemo(() => {
    if (!data?.contacts.length) return null;
    return data.contacts.find((contact) => contact.id === selectedId) ?? data.contacts[0];
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
  }, [sourceFilter]);

  useEffect(() => {
    if (!data?.contacts.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !data.contacts.some((contact) => contact.id === selectedId)) {
      setSelectedId(data.contacts[0].id);
    }
  }, [data, selectedId]);

  const fetchContacts = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (search) params.set('search', search);
    if (sourceFilter && sourceFilter !== 'all') params.set('source', sourceFilter);

    try {
      const response = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: {
          'x-admin-token': token,
        },
        signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load contacts');
      }
      setData(result.data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unable to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    void fetchContacts(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token, page, pageSize, search, sourceFilter]);

  const exportContacts = async (format: ExportFormat) => {
    if (!token) return;
    setExporting(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('export', '1');
    if (search) params.set('search', search);
    if (sourceFilter && sourceFilter !== 'all') params.set('source', sourceFilter);

    try {
      const response = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to export contacts');
      }
      const rows = (result.data?.contacts || []).map((contact: ContactRow) => ({
        Name: contact.name,
        Email: contact.email,
        Phone: contact.phone || '',
        Programme: contact.program || 'General',
        Source: contact.source || 'contact',
        Message: contact.message,
        Received: formatDate(contact.createdAt),
      }));
      const safeSource = sourceFilter === 'all' ? 'all' : sourceFilter;
      const filename = `contacts-${safeSource}-${new Date().toISOString().slice(0, 10)}`;
      await exportRows({ rows, filename, format });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export contacts');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminGate>
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Track enquiries, programme interests, and outreach history.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void fetchContacts()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => exportContacts('csv')}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportContacts('xlsx')}
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
              placeholder="Search by name, email, programme..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            />
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <option value="all">All sources</option>
              <option value="contact">Contact form</option>
              <option value="cta">CTA / Programme pack</option>
            </select>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Total contacts: <span className="font-semibold">{data?.total ?? 0}</span>
            </div>
          </div>

          {data?.sourceCounts ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              {Object.entries(data.sourceCounts).map(([sourceKey, count]) => (
                <div
                  key={sourceKey}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10"
                >
                  {sourceKey}: <span className="font-semibold">{count}</span>
                </div>
              ))}
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
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '80ms' } as CSSProperties}
          >
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading contacts...
              </div>
            ) : data?.contacts.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10 dark:text-slate-400">
                      <th className="py-3 pr-4">Contact</th>
                      <th className="py-3 pr-4">Programme</th>
                      <th className="py-3 pr-4">Source</th>
                      <th className="py-3 pr-4">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        onClick={() => setSelectedId(contact.id)}
                        className={`border-b border-slate-100 transition cursor-pointer dark:border-white/10 ${
                          selectedId === contact.id
                            ? 'bg-slate-50 dark:bg-white/10'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{contact.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{contact.email}</div>
                        </td>
                        <td className="py-3 pr-4">{contact.program || 'General'}</td>
                        <td className="py-3 pr-4">{contact.source || 'contact'}</td>
                        <td className="py-3 pr-4">{formatDate(contact.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                No contacts found for this filter.
              </p>
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
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '140ms' } as CSSProperties}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Conversation Snapshot</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Most recent enquiry details.</p>

            {selectedContact ? (
              <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Contact</div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {selectedContact.name}
                  </div>
                  <div>{selectedContact.email}</div>
                  <div>{selectedContact.phone || 'No phone number'}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Programme</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedContact.program || 'General enquiry'}
                  </div>
                  <div>Source: {selectedContact.source || 'contact'}</div>
                  <div>Received: {formatDate(selectedContact.createdAt)}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Message</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
                No contact selected.
              </p>
            )}
          </div>
        </section>
      </div>
    </AdminGate>
  );
}
