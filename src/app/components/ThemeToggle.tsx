'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeToggle({ className, showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (mounted ? theme : 'system') ?? 'system';
  const activeTheme = mounted ? resolvedTheme : 'light';
  const selectedOption = useMemo(
    () => themeOptions.find((option) => option.value === currentTheme) ?? themeOptions[2],
    [currentTheme]
  );
  const Icon = selectedOption.icon;
  const label = selectedOption.label;
  const sizeClasses = size === 'sm' ? 'h-9 px-2.5' : 'h-10 px-3';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  const buttonClasses = cn(
    'group relative inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 text-xs font-semibold text-slate-700 shadow-[0_12px_30px_rgba(0,16,32,0.12)] transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_18px_45px_rgba(0,16,32,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-orange)]/40 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20',
    sizeClasses,
    className
  );

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(buttonClasses, 'opacity-0 pointer-events-none')}
        aria-hidden
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Theme: ${label}. Click to change.`}
          className={buttonClasses}
        >
          <span
            className={cn(
              'relative flex size-6 items-center justify-center rounded-full transition-colors',
              activeTheme === 'dark'
                ? 'bg-[color:var(--brand-orange)]/20 text-[var(--brand-orange)]'
                : 'bg-[color:var(--brand-orange)]/30 text-[var(--brand-ink)]'
            )}
          >
            <Icon className={iconSize} />
          </span>
          <span className={showLabel ? 'text-xs' : 'sr-only'}>{label}</span>
          <ChevronDown className={cn('text-muted-foreground', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-2xl border border-border bg-card/95 p-2 shadow-[0_20px_50px_rgba(0,16,32,0.25)] backdrop-blur"
      >
        <div className="px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Theme
        </div>
        <DropdownMenuRadioGroup value={currentTheme} onValueChange={setTheme}>
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="mt-1 rounded-xl px-3 py-2 text-xs font-semibold data-[state=checked]:bg-[color:var(--brand-orange)]/15 data-[state=checked]:text-[var(--brand-orange)]"
              >
                <OptionIcon className="h-3.5 w-3.5" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
