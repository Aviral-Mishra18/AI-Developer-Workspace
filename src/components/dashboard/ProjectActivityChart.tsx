"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { projectActivityData } from "@/lib/mock-data";

export function ProjectActivityChart() {
  return (
    <Card className="border border-border bg-card shadow-sm col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Project Activity</CardTitle>
        <CardDescription>
          Commits, pull requests, and issues submitted over the past year
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pl-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
          <AreaChart
            data={projectActivityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.205 0 0)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.205 0 0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.556 0 0)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.556 0 0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="oklch(0.205 0 0)"
              fillOpacity={1}
              fill="url(#colorCommits)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="prs"
              name="Pull Requests"
              stroke="oklch(0.556 0 0)"
              fillOpacity={1}
              fill="url(#colorPrs)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
