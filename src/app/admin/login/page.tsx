'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function AdminLoginPage() {
  const { login, status, error, isBusy } = useAdminAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const ok = await login(tokenInput.trim());
    if (ok) {
      setMessage('Authenticated. Redirecting to the dashboard...');
      setTimeout(() => router.push('/admin'), 500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex justify-end mb-4">
        <ThemeToggle size="sm" showLabel />
      </div>
      <div className="admin-reveal admin-lift rounded-3xl border border-border bg-card p-8 shadow-[0_20px_60px_rgba(0,16,32,0.08)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Admin Access</p>
            <h2 className="text-2xl font-semibold text-foreground">Sign in to the CRM</h2>
          </div>
        </div>

        {status === 'authenticated' ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
            You are already signed in. Head back to the admin overview whenever you are ready.
            <div className="mt-4">
              <Link
                href="/admin"
                className="admin-glow inline-flex items-center rounded-full bg-[var(--brand-ink)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white"
              >
                Go to overview
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Admin Token
              <input
                type="password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="Enter ADMIN_TOKEN"
                className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground focus:border-slate-500 focus:outline-none"
                required
              />
            </label>

            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              The token is configured in your <span className="font-mono">.env</span> file under{' '}
              <span className="font-mono">ADMIN_TOKEN</span>.
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

            <button
              type="submit"
              disabled={!tokenInput || isBusy}
              className="admin-glow w-full rounded-full bg-[var(--brand-orange)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--brand-orange-strong)] disabled:opacity-60"
            >
              {isBusy ? 'Verifying...' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
