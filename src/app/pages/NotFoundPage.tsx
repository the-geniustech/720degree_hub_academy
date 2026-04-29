'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { useProgrammesData } from '../components/ProgrammesProvider';

export function NotFoundPage() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-sand)] px-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-[var(--brand-ink)] font-display">404</div>
          <Search className="w-20 h-20 text-[color:var(--brand-ink)]/40 mx-auto mt-4" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[var(--brand-ink)]">Page Not Found</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been moved. Explore the available programmes below.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--brand-orange)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--brand-orange-strong)] transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[var(--brand-ink)] border border-black/20 px-8 py-4 rounded-lg font-semibold hover:bg-black/5 transition-all"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-slate-600 mb-4">Explore programmes:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {programs.map((program) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[var(--brand-ink)] hover:bg-black/5 transition-colors border border-black/10"
              >
                {program.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
