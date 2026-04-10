'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Loader2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { useAdminAuth } from '../components/AdminAuthProvider';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  tokenPreview?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminUsersPage() {
  const { token } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenNotice, setTokenNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    role: 'viewer',
    isActive: true,
  });

  const selectedUser = useMemo(
    () => users.find((user) => user.id === form.id) ?? null,
    [users, form.id]
  );

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load admin users');
      }
      setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    void loadUsers();
  }, [token]);

  const resetForm = () =>
    setForm({
      id: '',
      name: '',
      email: '',
      role: 'viewer',
      isActive: true,
    });

  const saveUser = async () => {
    setSaving(true);
    setError(null);
    setTokenNotice(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        isActive: form.isActive,
      };
      const response = await fetch(form.id ? `/api/admin/users/${form.id}` : '/api/admin/users', {
        method: form.id ? 'PATCH' : 'POST',
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save admin user');
      }

      if (result.data?.token) {
        setTokenNotice(result.data.token);
      }
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save admin user');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      const result = await response.json().catch(() => ({ ok: true }));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to delete admin user');
      }
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete admin user');
    } finally {
      setSaving(false);
    }
  };

  const resetToken = async (id: string) => {
    setSaving(true);
    setError(null);
    setTokenNotice(null);
    try {
      const response = await fetch(`/api/admin/users/${id}/reset-token`, {
        method: 'POST',
        headers: { 'x-admin-token': token },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to reset admin token');
      }
      if (result.data?.token) {
        setTokenNotice(result.data.token);
      }
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset admin token');
    } finally {
      setSaving(false);
    }
  };

  const copyToken = async () => {
    if (!tokenNotice) return;
    await navigator.clipboard.writeText(tokenNotice);
  };

  return (
    <AdminGate requiredRole="super_admin">
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Users</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Create role-based accounts and rotate access tokens.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadUsers()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading admin users...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {tokenNotice ? (
          <div
            className="admin-reveal admin-lift rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            style={{ '--delay': '80ms' } as CSSProperties}
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                New admin token generated:
                <span className="ml-2 font-mono">{tokenNotice}</span>
              </div>
              <button
                type="button"
                onClick={copyToken}
                className="admin-glow inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white dark:bg-emerald-400/20 dark:text-emerald-100"
              >
                <ShieldCheck className="h-4 w-4" />
                Copy token
              </button>
            </div>
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                style={{ '--delay': `${120 + index * 40}ms` } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                    <div className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                      {user.role} - {user.isActive ? 'active' : 'inactive'}
                    </div>
                    {user.tokenPreview ? (
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Token: <span className="font-mono">{user.tokenPreview}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          role: user.role,
                          isActive: user.isActive,
                        })
                      }
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => resetToken(user.id)}
                      disabled={saving}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Reset token
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUser(user.id)}
                      disabled={saving}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="inline h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '160ms' } as CSSProperties}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedUser ? 'Edit Admin User' : 'Add Admin User'}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              />
              <input
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              />
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                />
                Active account
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveUser}
                  disabled={saving}
                  className="admin-glow rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:text-white"
                >
                  {saving ? 'Saving...' : 'Save User'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminGate>
  );
}
