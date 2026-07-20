"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectActivityChart } from "@/components/dashboard/ProjectActivityChart";
import { TaskCompletionChart } from "@/components/dashboard/TaskCompletionChart";
import { AIUsageChart } from "@/components/dashboard/AIUsageChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { FolderGit, Kanban, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { profile, user: authUser } = useAuth();
  const displayName = profile?.name || authUser?.email?.split('@')[0] || "there";

  const [stats, setStats] = useState({
    totalProjects: { value: 0, change: 0, trend: "up" as const },
    activeTasks: { value: 0, change: 0, trend: "down" as const },
    teamMembers: { value: 0, change: 0, trend: "up" as const },
    aiRequests: { value: 0, change: 0, trend: "up" as const },
  });

  const [projectActivity, setProjectActivity] = useState<any[]>([]);
  const [taskCompletion, setTaskCompletion] = useState<any[]>([]);
  const [aiUsage, setAiUsage] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch projects count
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        // Fetch active tasks
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'done');

        // Fetch team members (profiles count)
        const { count: membersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch AI Requests (ai_chats count)
        const { count: aiRequestsCount } = await supabase
          .from('ai_chats')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalProjects: { value: projectsCount || 0, change: 2, trend: "up" },
          activeTasks: { value: tasksCount || 0, change: -1, trend: "down" },
          teamMembers: { value: membersCount || 0, change: 1, trend: "up" },
          aiRequests: { value: aiRequestsCount || 0, change: 5, trend: "up" },
        });

        // For charts, we ideally group by date. For simplicity in the UI migration,
        // we'll fetch real data where possible and structure it for the charts.
        
        // Task distribution
        const { data: tasks } = await supabase.from('tasks').select('status');
        if (tasks) {
          const distribution = { backlog: 0, todo: 0, 'in-progress': 0, review: 0, done: 0 };
          tasks.forEach(t => {
            if (t.status in distribution) distribution[t.status as keyof typeof distribution]++;
          });
          setTaskCompletion([
            { name: "Backlog", value: distribution.backlog, fill: "var(--chart-1)" },
            { name: "Todo", value: distribution.todo, fill: "var(--chart-2)" },
            { name: "In Progress", value: distribution['in-progress'], fill: "var(--chart-3)" },
            { name: "Review", value: distribution.review, fill: "var(--chart-4)" },
            { name: "Done", value: distribution.done, fill: "var(--chart-5)" },
          ]);
        }

        // Activity Feed
        const { data: activities } = await supabase
          .from('activity_logs')
          .select('*, user:profiles(name, avatar)')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (activities) {
          setActivityFeed(activities.map(a => ({
            id: a.id,
            type: a.action.toLowerCase().includes('commit') ? 'commit' : 'issue',
            action: a.action,
            target: a.resource,
            time: new Date(a.created_at).toLocaleDateString(),
            user: {
              name: (a.user as any)?.name || 'Unknown',
              avatar: (a.user as any)?.avatar || ''
            }
          })));
        }

        // Placeholder for complex historical aggregations
        setProjectActivity([{ date: "Today", commits: 0, prs: 0, issues: 0 }]);
        setAiUsage([{ date: "Today", chatRequests: aiRequestsCount || 0, codeReviews: 0, docGen: 0 }]);

      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    }
    
    fetchDashboardData();
  }, []);

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
          value={stats.totalProjects.value}
          change={stats.totalProjects.change}
          trend={stats.totalProjects.trend}
          label="from last month"
          icon={FolderGit}
        />
        <StatsCard
          title="Active Tasks"
          value={stats.activeTasks.value}
          change={stats.activeTasks.change}
          trend={stats.activeTasks.trend}
          label="from last week"
          icon={Kanban}
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers.value}
          change={stats.teamMembers.change}
          trend={stats.teamMembers.trend}
          label="joined recently"
          icon={Users}
        />
        <StatsCard
          title="AI Requests"
          value={stats.aiRequests.value.toLocaleString()}
          change={stats.aiRequests.change}
          trend={stats.aiRequests.trend}
          label="since yesterday"
          icon={Sparkles}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Main Charts */}
        <div className="md:col-span-2 space-y-6">
          <ProjectActivityChart data={projectActivity} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TaskCompletionChart data={taskCompletion} />
            <AIUsageChart data={aiUsage} />
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="md:col-span-1 h-full">
          <ActivityFeed data={activityFeed} />
        </div>
      </div>
    </div>
  );
}

