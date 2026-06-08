"use client";

import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Building,
  Menu,
  Check,
  Sparkles,
} from "lucide-react";
import { workspaces, notifications, currentUser } from "@/lib/mock-data";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const pathname = usePathname();
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.filter((n) => !n.read)
  );

  const handleMarkAllRead = () => {
    setUnreadNotifications([]);
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workspaces", href: "/workspaces" },
    { label: "Projects", href: "/projects" },
    { label: "Tasks", href: "/tasks" },
    { label: "AI Chat", href: "/ai-chat" },
    { label: "AI Code Review", href: "/ai-review" },
    { label: "Documentation", href: "/docs" },
    { label: "Notifications", href: "/notifications" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "/settings" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Navigation Trigger */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <div className="flex h-16 items-center px-6 border-b border-border">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>NexusAI</span>
              </Link>
            </div>
            <div className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* Workspace Switcher */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-9 border-border bg-card hover:bg-accent"
                />
              }
            >
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[120px] truncate font-medium">
                {selectedWorkspace.name}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Select Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => setSelectedWorkspace(ws)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{ws.name}</span>
                  {selectedWorkspace.id === ws.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="flex-1 md:flex max-w-md hidden relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dashboard, tasks, projects..."
            className="w-full pl-9 h-9 bg-card border-border rounded-md"
          />
        </div>

        {/* Right Nav Icons */}
        <div className="ml-auto flex items-center gap-2">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative w-9 h-9 rounded-md transition-colors hover:bg-accent"
                />
              }
            >
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              {unreadNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:text-primary/80 h-auto p-0 bg-transparent border-none cursor-pointer font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {unreadNotifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  unreadNotifications.slice(0, 4).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-4 border-b border-border/50 cursor-pointer flex flex-col items-start gap-1"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-xs text-foreground">
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <Link href="/notifications" className="block text-center p-3 text-xs text-primary font-medium hover:underline">
                View all notifications
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ml-1 border border-border"
                />
              }
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link href="/settings" className="flex items-center gap-2 w-full" />}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link href="/settings?tab=billing" className="flex items-center gap-2 w-full" />}
              >
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Billing & Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                render={<Link href="/login" className="flex items-center gap-2 w-full" />}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
