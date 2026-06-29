"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectActivityChart } from "@/components/dashboard/ProjectActivityChart";
import { TaskCompletionChart } from "@/components/dashboard/TaskCompletionChart";
import { AIUsageChart } from "@/components/dashboard/AIUsageChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { FolderGit, Kanban, Users, Sparkles, AlertCircle } from "lucide-react";
import { dashboardStats } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardPage() {
  const { profile, user: authUser } = useAuth();
  const displayName = profile?.name || authUser?.email?.split('@')[0] || "there";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, <span className="font-medium text-foreground">{displayName}</span>! Here is an overview of your workspaces, project activities, and AI metrics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={dashboardStats.totalProjects.value}
          change={dashboardStats.totalProjects.change}
          trend={dashboardStats.totalProjects.trend}
          label="from last month"
          icon={FolderGit}
        />
        <StatsCard
          title="Active Tasks"
          value={dashboardStats.activeTasks.value}
          change={dashboardStats.activeTasks.change}
          trend={dashboardStats.activeTasks.trend}
          label="from last week"
          icon={Kanban}
        />
        <StatsCard
          title="Team Members"
          value={dashboardStats.teamMembers.value}
          change={dashboardStats.teamMembers.change}
          trend={dashboardStats.teamMembers.trend}
          label="joined recently"
          icon={Users}
        />
        <StatsCard
          title="AI Requests"
          value={dashboardStats.aiRequests.value.toLocaleString()}
          change={dashboardStats.aiRequests.change}
          trend={dashboardStats.aiRequests.trend}
          label="since yesterday"
          icon={Sparkles}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Main Charts */}
        <div className="md:col-span-2 space-y-6">
          <ProjectActivityChart />
          <div className="grid gap-6 sm:grid-cols-2">
            <TaskCompletionChart />
            <AIUsageChart />
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="md:col-span-1 h-full">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
