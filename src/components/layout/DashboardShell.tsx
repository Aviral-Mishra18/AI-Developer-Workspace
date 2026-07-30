"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useSidebar } from "@/hooks/use-sidebar";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/30 dark:bg-slate-950/20">
          <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
