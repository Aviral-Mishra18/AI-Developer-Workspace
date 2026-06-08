"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { aiUsageData } from "@/lib/mock-data";

export function AIUsageChart() {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">AI Usage Stats</CardTitle>
        <CardDescription>Daily volume of AI-assisted tasks performed by the team</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pl-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
          <LineChart
            data={aiUsageData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
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
            <Legend verticalAlign="top" height={36} iconSize={10} iconType="circle" style={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="chatRequests"
              name="Chat Queries"
              stroke="oklch(0.205 0 0)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="codeReviews"
              name="Code Reviews"
              stroke="oklch(0.556 0 0)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="docGen"
              name="Docs Generated"
              stroke="oklch(0.439 0 0)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
