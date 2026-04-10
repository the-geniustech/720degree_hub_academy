export const studentStatuses = [
  'onboarding',
  'active',
  'paused',
  'completed',
  'withdrawn',
  'alumni',
] as const;

export type StudentStatus = (typeof studentStatuses)[number];

export const studentStatusMap: Record<string, { label: string; className: string }> = {
  onboarding: {
    label: 'Onboarding',
    className:
      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/30',
  },
  active: {
    label: 'Active',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30',
  },
  paused: {
    label: 'Paused',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-500/30',
  },
  withdrawn: {
    label: 'Withdrawn',
    className:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/30',
  },
  alumni: {
    label: 'Alumni',
    className:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/15',
  },
};

