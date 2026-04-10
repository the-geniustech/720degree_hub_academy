'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MainLayout } from './MainLayout';
import { ProgrammesProvider } from '../components/ProgrammesProvider';

interface AppLayoutShellProps {
  children: ReactNode;
}

export function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <ProgrammesProvider>
      <MainLayout>{children}</MainLayout>
    </ProgrammesProvider>
  );
}
