import {
  LayoutGrid,
  FileText,
  Users,
  GraduationCap,
  UserCheck,
  UserCog,
  Activity,
} from 'lucide-react';

export const adminNavItems = [
  {
    label: 'Overview',
    href: '/admin',
    icon: LayoutGrid,
    description: 'Platform health and key totals',
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: FileText,
    description: 'Review and manage enrolment pipeline',
  },
  {
    label: 'Students',
    href: '/admin/students',
    icon: UserCheck,
    description: 'Manage enrolled student profiles',
  },
  {
    label: 'Contacts',
    href: '/admin/contacts',
    icon: Users,
    description: 'Track enquiries and outreach',
  },
  {
    label: 'Programmes',
    href: '/admin/programmes',
    icon: GraduationCap,
    description: 'Manage locations, cohorts, and curricula',
  },
  {
    label: 'Admin Users',
    href: '/admin/users',
    icon: UserCog,
    description: 'Manage roles and access',
  },
  {
    label: 'Activity',
    href: '/admin/activity',
    icon: Activity,
    description: 'Audit actions across the platform',
  },
];
