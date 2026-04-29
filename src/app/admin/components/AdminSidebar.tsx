'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavItems } from '../lib/nav';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-64 bg-card border-r border-border px-5 py-6 overflow-y-auto z-40">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">720Degree</div>
        <div className="text-lg font-semibold text-foreground">Admin CRM</div>
      </div>

      <nav className="flex-1 space-y-2">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? 'bg-[var(--brand-ink)] text-white shadow-[0_12px_30px_rgba(0,16,32,0.2)]'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${
                  isActive ? 'bg-white/10 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        Keep your <span className="font-mono">ADMIN_TOKEN</span> private. Every admin request is
        authenticated.
      </div>
    </aside>
  );
}
