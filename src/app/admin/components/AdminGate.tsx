'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Lock, Loader2 } from 'lucide-react';
import { AdminRole, useAdminAuth } from './AdminAuthProvider';

interface AdminGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  requiredRole?: AdminRole;
}

export function AdminGate({
  children,
  title = 'Admin access required',
  description = 'Sign in with your admin token to access this workspace.',
  requiredRole = 'viewer',
}: AdminGateProps) {
  const { status, profile } = useAdminAuth();

  const roleOrder: Record<AdminRole, number> = {
    viewer: 1,
    admin: 2,
    super_admin: 3,
  };

  const hasRole = profile ? roleOrder[profile.role] >= roleOrder[requiredRole] : false;

  if (status === 'checking') {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500 dark:text-slate-300" />
        <div className="text-sm text-slate-500 dark:text-slate-300">Verifying access...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">{description}</p>
        </div>
        <Link
          href="/admin/login"
          className="admin-glow rounded-full bg-[var(--brand-ink)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white dark:bg-[linear-gradient(135deg,#002040,#f08010)]"
        >
          Go to login
        </Link>
      </div>
    );
  }

  if (!hasRole) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:bg-[#071a33] dark:border-white/10 dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Insufficient permissions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Your role does not grant access to this section. Contact a super admin if you need
            access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
