export const applicationStatuses = [
  'submitted',
  'awaiting_payment',
  'scholarship_requested',
  'paid_full',
  'paid_deposit',
  'enrolled',
  'on_hold',
  'rejected',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusMap: Record<
  string,
  { label: string; className: string }
> = {
  submitted: {
    label: 'Submitted',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30',
  },
  awaiting_payment: {
    label: 'Awaiting Payment',
    className:
      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/30',
  },
  scholarship_requested: {
    label: 'Scholarship Requested',
    className:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:border-violet-500/30',
  },
  paid_full: {
    label: 'Paid (Full)',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30',
  },
  paid_deposit: {
    label: 'Paid (Deposit)',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30',
  },
  enrolled: {
    label: 'Enrolled',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30',
  },
  on_hold: {
    label: 'On Hold',
    className:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/15',
  },
  rejected: {
    label: 'Rejected',
    className:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/30',
  },
};
