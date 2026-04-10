'use client';

import type { ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader />
        <main className="flex-1 px-6 pb-12">{children}</main>
      </div>
    </div>
  );
}
