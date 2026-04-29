'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Loader2, RefreshCw, Plus, Pencil, X, User, Download } from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { formatDate, formatNaira } from '../lib/format';
import { studentStatusMap, studentStatuses } from '../lib/student-status';
import { exportRows, type ExportFormat } from '../lib/export';

type StudentRow = {
  id: string;
  applicationId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  programTitle: string;
  school: string;
  location: string;
  cohort: string;
  paymentPlan: string;
  status: string;
  amountPaid: number;
  balanceDue: number;
  paidAt?: string | null;
  paystackReference?: string | null;
  receiptSentAt?: string | null;
  welcomeSentAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type StudentsData = {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  statusCounts: Record<string, number>;
  totalPaid: number;
  students: StudentRow[];
};

type ProgrammeOptions = {
  programs: { slug: string; title: string; school: string }[];
  locations: { code?: string; id?: string; label: string }[];
  cohorts: { code?: string; id?: string; label: string }[];
};

function StudentStatusBadge({ status }: { status: string }) {
  const config = studentStatusMap[status] || {
    label: status.replace(/_/g, ' '),
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function toDateInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

export default function StudentsPage() {
  const { token, status, profile } = useAdminAuth();
  const [data, setData] = useState<StudentsData | null>(null);
  const [options, setOptions] = useState<ProgrammeOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendResult, setResendResult] = useState<{
    message: string;
    paymentUrl?: string;
  } | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    program: '',
    programTitle: '',
    school: '',
    location: '',
    cohort: '',
    paymentPlan: 'deposit',
    status: 'onboarding',
    amountPaid: '0',
    balanceDue: '0',
    paidAt: '',
    notes: '',
  });

  const canEdit = profile?.role !== 'viewer';

  const selectedStudent = useMemo(() => {
    if (!data?.students.length || !selectedId) return null;
    return data.students.find((student) => student.id === selectedId) ?? null;
  }, [data?.students, selectedId]);

  const locationOptions = useMemo(() => {
    if (!options?.locations) return [];
    return options.locations.map((location) => ({
      id: location.code || location.id || '',
      label: location.label,
    }));
  }, [options?.locations]);

  const cohortOptions = useMemo(() => {
    if (!options?.cohorts) return [];
    return options.cohorts.map((cohort) => ({
      id: cohort.code || cohort.id || '',
      label: cohort.label,
    }));
  }, [options?.cohorts]);

  const programOptions = options?.programs ?? [];

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
    const loadOptions = async () => {
      try {
        const response = await fetch('/api/programmes', { cache: 'no-store' });
        const result = await response.json();
        if (response.ok && result?.ok && result?.data) {
          setOptions(result.data);
        }
      } catch (err) {
        console.error('Unable to load programme options', err);
      }
    };
    void loadOptions();
  }, []);

  const fetchStudents = async (signal?: AbortSignal) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(20));
    if (search) params.set('search', search);
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);

    try {
      const response = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: { 'x-admin-token': token },
        signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load students');
      }
      setData(result.data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unable to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    void fetchStudents(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token, page, search, statusFilter]);

  useEffect(() => {
    if (!data?.students.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !data.students.some((student) => student.id === selectedId)) {
      setSelectedId(data.students[0].id);
    }
  }, [data, selectedId]);

  const resetForm = () => {
    setForm({
      id: '',
      fullName: '',
      email: '',
      phone: '',
      program: '',
      programTitle: '',
      school: '',
      location: '',
      cohort: '',
      paymentPlan: 'deposit',
      status: 'onboarding',
      amountPaid: '0',
      balanceDue: '0',
      paidAt: '',
      notes: '',
    });
    setFormError(null);
  };

  const openModal = (student?: StudentRow) => {
    setFormError(null);
    if (student) {
      setForm({
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        program: student.program,
        programTitle: student.programTitle,
        school: student.school,
        location: student.location,
        cohort: student.cohort,
        paymentPlan: student.paymentPlan,
        status: student.status,
        amountPaid: String(student.amountPaid ?? 0),
        balanceDue: String(student.balanceDue ?? 0),
        paidAt: toDateInput(student.paidAt),
        notes: student.notes ?? '',
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const openDrawer = (studentId: string) => {
    setSelectedId(studentId);
    setResendError(null);
    setResendResult(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setResendError(null);
    setResendResult(null);
    setResendLoading(false);
  };

  const saveStudent = async () => {
    if (!canEdit || !token) return;
    setSaving(true);
    setFormError(null);

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      program: form.program.trim(),
      programTitle: form.programTitle.trim(),
      school: form.school.trim(),
      location: form.location.trim(),
      cohort: form.cohort.trim(),
      paymentPlan: form.paymentPlan,
      status: form.status,
      amountPaid: Number(form.amountPaid || 0),
      balanceDue: Number(form.balanceDue || 0),
      paidAt: form.paidAt || null,
      notes: form.notes.trim(),
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phone ||
      !payload.program ||
      !payload.programTitle ||
      !payload.school ||
      !payload.location ||
      !payload.cohort ||
      !payload.paymentPlan
    ) {
      setFormError('Please complete all required fields.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        form.id ? `/api/admin/students/${form.id}` : '/api/admin/students',
        {
          method: form.id ? 'PATCH' : 'POST',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save student');
      }
      closeModal();
      resetForm();
      await fetchStudents();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save student');
    } finally {
      setSaving(false);
    }
  };

  const exportStudents = async (format: ExportFormat) => {
    if (!token) return;
    setExporting(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('export', '1');
    if (search) params.set('search', search);
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);

    try {
      const response = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to export students');
      }
      const rows = (result.data?.students || []).map((student: StudentRow) => ({
        'Full Name': student.fullName,
        Email: student.email,
        Phone: student.phone,
        Programme: student.programTitle,
        School: student.school,
        Cohort: student.cohort,
        Location: student.location,
        'Payment Plan': student.paymentPlan,
        Status: student.status,
        'Amount Paid': student.amountPaid ?? 0,
        'Balance Due': student.balanceDue ?? 0,
        'Paid At': student.paidAt ? formatDate(student.paidAt) : '',
        'Paystack Reference': student.paystackReference || '',
        'Receipt Sent': student.receiptSentAt ? formatDate(student.receiptSentAt) : '',
        'Welcome Sent': student.welcomeSentAt ? formatDate(student.welcomeSentAt) : '',
        Notes: student.notes || '',
        'Created At': formatDate(student.createdAt),
        'Updated At': formatDate(student.updatedAt),
      }));
      const safeStatus = statusFilter === 'all' ? 'all' : statusFilter;
      const filename = `students-${safeStatus}-${new Date().toISOString().slice(0, 10)}`;
      await exportRows({ rows, filename, format });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export students');
    } finally {
      setExporting(false);
    }
  };

  const resendPaymentLink = async () => {
    if (!token || !selectedStudent) return;
    setResendLoading(true);
    setResendError(null);
    setResendResult(null);
    try {
      const response = await fetch(
        `/api/admin/students/${selectedStudent.id}/resend-payment`,
        {
          method: "POST",
          headers: {
            "x-admin-token": token,
          },
        },
      );
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to resend payment link");
      }
      setResendResult({
        message: result.data?.message || "Payment link generated.",
        paymentUrl: result.data?.payment?.authorization_url,
      });
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : "Unable to resend payment link",
      );
    } finally {
      setResendLoading(false);
    }
  };

  const statusCount = (key: string) => data?.statusCounts?.[key] ?? 0;

  return (
    <AdminGate>
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Student Management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Create, update, and track enrolled students across cohorts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void fetchStudents()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => exportStudents('csv')}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportStudents('xlsx')}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Export XLSX
              </button>
              <button
                type="button"
                onClick={() => openModal()}
                disabled={!canEdit}
                className="admin-glow inline-flex items-center gap-2 rounded-full bg-[var(--brand-ink)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#002040,#f08010)]"
              >
                <Plus className="h-4 w-4" />
                Add student
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
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <option value="all">All statuses</option>
              {studentStatuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Total students: <span className="font-semibold">{data?.total ?? 0}</span>
            </div>
          </div>
        </section>

        {data ? (
          <section className="grid gap-4 lg:grid-cols-4">
            {[
              { label: 'Onboarding', value: statusCount('onboarding') },
              { label: 'Active', value: statusCount('active') },
              { label: 'Alumni', value: statusCount('alumni') },
              { label: 'Total Paid', value: formatNaira(data.totalPaid) },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                style={{ '--delay': `${80 + index * 40}ms` } as CSSProperties}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </section>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '120ms' } as CSSProperties}
        >
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading students...
            </div>
          ) : data?.students.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10 dark:text-slate-400">
                    <th className="py-3 pr-4">Student</th>
                    <th className="py-3 pr-4">Programme</th>
                    <th className="py-3 pr-4">Cohort</th>
                    <th className="py-3 pr-4">Plan</th>
                    <th className="py-3 pr-4">Paid</th>
                    <th className="py-3 pr-4">Balance</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                  <tbody>
                    {data.students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 dark:border-white/10">
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{student.fullName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{student.email}</div>
                        </td>
                      <td className="py-3 pr-4">
                        <div>{student.programTitle}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{student.location}</div>
                      </td>
                      <td className="py-3 pr-4">{student.cohort}</td>
                      <td className="py-3 pr-4">{student.paymentPlan}</td>
                      <td className="py-3 pr-4">{formatNaira(student.amountPaid ?? 0)}</td>
                      <td className="py-3 pr-4">{formatNaira(student.balanceDue ?? 0)}</td>
                      <td className="py-3 pr-4">
                        <StudentStatusBadge status={student.status} />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDrawer(student.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal(student)}
                            disabled={!canEdit}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-300">
              No students found for this filter.
            </div>
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#001020]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[var(--brand-ink)] px-6 py-4 text-white dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {form.id ? 'Edit Student Profile' : 'Create Student Profile'}
                  </div>
                  <div className="text-xs text-white/70">
                    Capture cohort, payment, and onboarding status.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/20 p-2 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Full Name *
                  </label>
                  <input
                    value={form.fullName}
                    onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Email *
                  </label>
                  <input
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Email address"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Phone *
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="+234..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    {studentStatuses.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Programme *
                  </label>
                  {programOptions.length ? (
                    <select
                      value={form.program}
                      onChange={(event) => {
                        const next = event.target.value;
                        const program = programOptions.find((item) => item.slug === next);
                        setForm((prev) => ({
                          ...prev,
                          program: next,
                          programTitle: program?.title || prev.programTitle,
                          school: program?.school || prev.school,
                        }));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <option value="">Select programme</option>
                      {form.program && !programOptions.some((item) => item.slug === form.program) ? (
                        <option value={form.program}>{form.programTitle || form.program}</option>
                      ) : null}
                      {programOptions.map((program) => (
                        <option key={program.slug} value={program.slug}>
                          {program.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.program}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, program: event.target.value }))
                      }
                      placeholder="Programme slug"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Programme Title *
                  </label>
                  <input
                    value={form.programTitle}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, programTitle: event.target.value }))
                    }
                    placeholder="Programme title"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    School *
                  </label>
                  <input
                    value={form.school}
                    onChange={(event) => setForm((prev) => ({ ...prev, school: event.target.value }))}
                    placeholder="School"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Location *
                  </label>
                  {locationOptions.length ? (
                    <select
                      value={form.location}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, location: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <option value="">Select location</option>
                      {form.location &&
                      !locationOptions.some((location) => location.id === form.location) ? (
                        <option value={form.location}>{form.location}</option>
                      ) : null}
                      {locationOptions.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.location}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, location: event.target.value }))
                      }
                      placeholder="Location"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Cohort *
                  </label>
                  {cohortOptions.length ? (
                    <select
                      value={form.cohort}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, cohort: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <option value="">Select cohort</option>
                      {form.cohort && !cohortOptions.some((cohort) => cohort.id === form.cohort) ? (
                        <option value={form.cohort}>{form.cohort}</option>
                      ) : null}
                      {cohortOptions.map((cohort) => (
                        <option key={cohort.id} value={cohort.id}>
                          {cohort.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.cohort}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, cohort: event.target.value }))
                      }
                      placeholder="Cohort"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Payment Plan *
                  </label>
                  <select
                    value={form.paymentPlan}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, paymentPlan: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="full">Full</option>
                    <option value="scholarship">Scholarship</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    value={form.amountPaid}
                    onChange={(event) => setForm((prev) => ({ ...prev, amountPaid: event.target.value }))}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Balance Due
                  </label>
                  <input
                    type="number"
                    value={form.balanceDue}
                    onChange={(event) => setForm((prev) => ({ ...prev, balanceDue: event.target.value }))}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Paid At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.paidAt}
                    onChange={(event) => setForm((prev) => ({ ...prev, paidAt: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                    placeholder="Internal notes..."
                    className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  />
                </div>
              </div>

              {formError ? (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  {formError}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <div className="text-xs text-slate-500 dark:text-slate-300">
                Required fields: name, email, phone, programme, school, location, cohort, payment plan.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStudent}
                  disabled={saving || !canEdit}
                  className="admin-glow rounded-full bg-[var(--brand-ink)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#002040,#f08010)]"
                >
                  {saving ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isDrawerOpen && selectedStudent ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-[#001020]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[var(--brand-ink)] px-6 py-5 text-white dark:border-white/10">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">Student Profile</div>
                <div className="text-lg font-semibold">{selectedStudent.fullName}</div>
                <div className="text-xs text-white/70">{selectedStudent.email}</div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full border border-white/20 p-2 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Status</div>
                      <StudentStatusBadge status={selectedStudent.status} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wide text-slate-400">Programme</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {selectedStudent.programTitle}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedStudent.cohort} · {selectedStudent.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Phone</div>
                      <div className="font-medium">{selectedStudent.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Payment Plan</div>
                      <div className="font-medium">{selectedStudent.paymentPlan}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Amount Paid</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatNaira(selectedStudent.amountPaid ?? 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Balance Due</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatNaira(selectedStudent.balanceDue ?? 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Paid At</div>
                      <div className="font-medium">
                        {selectedStudent.paidAt ? formatDate(selectedStudent.paidAt) : 'Not recorded'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Paystack Ref</div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-300">
                        {selectedStudent.paystackReference || 'Not available'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Application ID</div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-300">
                        {selectedStudent.applicationId || 'Not linked'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Last Updated</div>
                      <div className="font-medium">{formatDate(selectedStudent.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Payment Timeline</div>
                  <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Student profile created</div>
                        <div>{formatDate(selectedStudent.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Payment received</div>
                        <div>
                          {selectedStudent.paidAt
                            ? `${formatDate(selectedStudent.paidAt)} · ${formatNaira(selectedStudent.amountPaid ?? 0)}`
                            : 'Awaiting payment confirmation'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Balance due</div>
                        <div>{formatNaira(selectedStudent.balanceDue ?? 0)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Payment Actions</div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    Resend a fresh Paystack payment link for this application.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={resendPaymentLink}
                      disabled={!canEdit || resendLoading || !selectedStudent.applicationId}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--brand-ink)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#002040,#f08010)]"
                    >
                      {resendLoading ? "Sending..." : "Resend Payment Link"}
                    </button>
                    {resendResult?.paymentUrl ? (
                      <a
                        href={resendResult.paymentUrl}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        Open Payment Link
                      </a>
                    ) : null}
                  </div>
                  {!selectedStudent.applicationId ? (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                      This student is not linked to an application yet.
                    </div>
                  ) : null}
                  {resendResult ? (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                      {resendResult.message}
                    </div>
                  ) : null}
                  {resendError ? (
                    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                      {resendError}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Email Logs</div>
                  <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Receipt Email</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedStudent.receiptSentAt
                            ? formatDate(selectedStudent.receiptSentAt)
                            : 'Pending'}
                        </div>
                      </div>
                      <div
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          selectedStudent.receiptSentAt
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300'
                        }`}
                      >
                        {selectedStudent.receiptSentAt ? 'Sent' : 'Not sent'}
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Welcome Email</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedStudent.welcomeSentAt
                            ? formatDate(selectedStudent.welcomeSentAt)
                            : 'Pending'}
                        </div>
                      </div>
                      <div
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          selectedStudent.welcomeSentAt
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300'
                        }`}
                      >
                        {selectedStudent.welcomeSentAt ? 'Sent' : 'Not sent'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Notes</div>
                  <div className="mt-2">
                    {selectedStudent.notes?.trim() || 'No internal notes yet.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 dark:border-white/10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-300">
                  Need to update details? Use the edit button.
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      openModal(selectedStudent);
                    }}
                    disabled={!canEdit}
                    className="admin-glow rounded-full bg-[var(--brand-ink)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#002040,#f08010)]"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminGate>
  );
}
