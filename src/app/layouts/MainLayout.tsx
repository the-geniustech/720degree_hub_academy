import type { ReactNode } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
