'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthProvider';
import { AdminShell } from './AdminShell';

function AdminLayoutGate({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || status === 'invalid') {
      router.replace('/admin/login');
    }
  }, [router, status]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Verifying admin access...</span>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === '/admin/login';

  return (
    <AdminAuthProvider>
      {isLoginRoute ? (
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      ) : (
        <AdminLayoutGate>{children}</AdminLayoutGate>
      )}
    </AdminAuthProvider>
  );
}
