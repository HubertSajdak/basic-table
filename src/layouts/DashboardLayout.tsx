import type { ReactNode } from 'react';
import { SidebarNavigation } from '@/shared/components/sidebarNavigation/SidebarNavigation';
import { AppBar } from '@/shared/components/appBar/AppBar';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      <SidebarNavigation />
      {/* flex-1: fills remaining width (screen - sidebar), adapts when the sidebar collapses */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppBar />
        <main className="min-w-0 flex-1 overflow-auto p-4 m-1 shadow-sm rounded-xl bg-surface-raised">{children}</main>
      </div>
    </div>
  );
};
