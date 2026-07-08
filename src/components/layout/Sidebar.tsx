"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Briefcase,
  FolderGit,
  Kanban,
  MessageSquare,
  FileSearch,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { profile, user } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workspaces", href: "/workspaces", icon: Briefcase },
    { label: "Projects", href: "/projects", icon: FolderGit },
    { label: "Tasks", href: "/tasks", icon: Kanban },
    { label: "AI Chat", href: "/ai-chat", icon: MessageSquare },
    { label: "AI Code Review", href: "/ai-review", icon: FileSearch },
    { label: "Documentation", href: "/docs", icon: BookOpen },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Admin", href: "/admin", icon: Shield },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              NexusAI
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>
        )}

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation Links */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-55 border border-border whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer / User Profile Summary */}
      <div className="p-4 border-t border-border mt-auto">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
          <img
            src={profile?.avatar || "https://api.dicebear.com/8.x/avataaars/svg?seed=Guest"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-border bg-muted flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium leading-none truncate">
                {profile?.name || user?.email?.split('@')[0] || "Guest"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {profile?.email || user?.email || ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
