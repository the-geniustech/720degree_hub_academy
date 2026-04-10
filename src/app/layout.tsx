import type { Metadata } from 'next';
import '../styles/index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { AppLayoutShell } from './layouts/AppLayoutShell';

export const metadata: Metadata = {
  title: '720Degree Innovation Hub | Cohort Teaching Programme',
  description:
    'AI-integrated, expert-led tech education with real projects, business modules, and global access from Abeokuta and Lagos.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <AppLayoutShell>{children}</AppLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
