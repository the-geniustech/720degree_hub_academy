import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminLayoutShell } from './components/AdminLayoutShell';

export const metadata: Metadata = {
  title: '720Degree Admin',
  description: 'Admin CRM for applications, contacts, and programmes.',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
