'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldAlert, ShieldCheck } from 'lucide-react';
import { adminNavItems } from '../lib/nav';
import { useAdminAuth } from './AdminAuthProvider';
import { ThemeToggle } from '../../components/ThemeToggle';

export function AdminHeader() {
  const pathname = usePathname();
  const { status, logout, isBusy, profile } = useAdminAuth();
  const activeItem =
    adminNavItems.find(
      (item) =>
        pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
    ) ?? adminNavItems[0];

  const statusLabel =
    status === 'authenticated'
      ? 'Authenticated'
      : status === 'checking'
        ? 'Verifying'
        : status === 'invalid'
          ? 'Invalid token'
          : 'Guest';

  const statusClasses =
    status === 'authenticated'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30'
      : status === 'invalid'
        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/30'
        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10';

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
              720Degree Admin
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{activeItem.label}</h1>
            <p className="text-sm text-muted-foreground">{activeItem.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile ? (
              <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {profile.name} - {profile.role.replace('_', ' ')}
              </div>
            ) : null}
            <ThemeToggle size="sm" />
            <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusClasses}`}>
              {status === 'authenticated' ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {statusLabel}
            </div>
            {status === 'authenticated' ? (
              <button
                type="button"
                onClick={logout}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                <ShieldCheck className="h-4 w-4" />
                Go to login
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
