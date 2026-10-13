import { IconBrandTeams, IconDashboard } from '@tabler/icons-react';

export interface NavigationItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  {
    title: 'Home',
    icon: <IconDashboard />,
    path: '/home',
  },
  {
    title: 'People',
    icon: <IconBrandTeams />,
    path: '/people',
  },
];
