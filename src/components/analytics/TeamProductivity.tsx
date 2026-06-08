"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { teamVelocityData } from "@/lib/mock-data";

export function TeamProductivity() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Sprint Velocity</CardTitle>
          <CardDescription>Comparison of planned vs completed story points across sprints</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] pl-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
            <BarChart data={teamVelocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="sprint" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "12px" }} />
              <Legend verticalAlign="top" height={36} iconSize={10} iconType="circle" style={{ fontSize: "11px" }} />
              <Bar dataKey="planned" name="Planned Points" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="completed" name="Completed Points" fill="var(--chart-5)" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
