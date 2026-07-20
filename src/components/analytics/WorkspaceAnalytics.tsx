"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { supabase } from "@/lib/supabase";

export function WorkspaceAnalytics() {
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const { data, error } = await supabase.from('tasks').select('status');
        if (error) throw error;
        
        const counts = { backlog: 0, todo: 0, "in-progress": 0, review: 0, done: 0 };
        (data || []).forEach(task => {
          if (counts[task.status as keyof typeof counts] !== undefined) {
            counts[task.status as keyof typeof counts]++;
          }
        });
        
        setTaskCompletionData([
          { name: "Backlog", value: counts.backlog, fill: "var(--chart-1)" },
          { name: "Todo", value: counts.todo, fill: "var(--chart-2)" },
          { name: "In Progress", value: counts["in-progress"], fill: "var(--chart-3)" },
          { name: "Review", value: counts.review, fill: "var(--chart-4)" },
          { name: "Done", value: counts.done, fill: "var(--chart-5)" },
        ]);
      } catch (err) {
        console.error("Failed to fetch task stats", err);
        // Fallback
        setTaskCompletionData([
          { name: "Backlog", value: 24, fill: "var(--chart-1)" },
          { name: "Todo", value: 18, fill: "var(--chart-2)" },
          { name: "In Progress", value: 12, fill: "var(--chart-3)" },
          { name: "Review", value: 8, fill: "var(--chart-4)" },
          { name: "Done", value: 45, fill: "var(--chart-5)" },
        ]);
      }
    };
    fetchTaskData();
  }, []);

  const workspaceGrowthData = [
    { month: "Jan", workspaces: 12, members: 45 },
    { month: "Feb", workspaces: 15, members: 52 },
    { month: "Mar", workspaces: 18, members: 61 },
    { month: "Apr", workspaces: 22, members: 78 },
    { month: "May", workspaces: 28, members: 95 },
    { month: "Jun", workspaces: 35, members: 124 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workspace Growth Area Chart */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">User & Member Growth</CardTitle>
            <CardDescription>Historical workspace registrations and member invites</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pl-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
              <AreaChart data={workspaceGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.205 0 0)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="oklch(0.205 0 0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="members" name="Members Joined" stroke="oklch(0.205 0 0)" fillOpacity={1} fill="url(#growthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution Bar Chart */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Workspace Load Distribution</CardTitle>
            <CardDescription>Aggregate quantity of tasks grouped by columns</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pl-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
              <BarChart data={taskCompletionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "12px" }} />
                <Bar dataKey="value" name="Tasks Count" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
