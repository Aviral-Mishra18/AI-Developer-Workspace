"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

export function AIUsageStats() {
  const COLORS = ["oklch(0.205 0 0)", "oklch(0.556 0 0)", "oklch(0.439 0 0)", "oklch(0.371 0 0)"];

  const aiModelUsageData = [
    { name: "GPT-4o", requests: 8450, cost: 245.80, percentage: 65 },
    { name: "Claude 3.5", requests: 2840, cost: 156.20, percentage: 22 },
    { name: "Gemini Pro", requests: 1200, cost: 78.40, percentage: 9 },
    { name: "Llama 3", requests: 520, cost: 12.00, percentage: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Model Usage Allocation Bar chart */}
        <Card className="border-border bg-card shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Model Requests volume</CardTitle>
            <CardDescription>Daily API completions routed by engine</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pl-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
              <BarChart data={aiModelUsageData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "12px" }} />
                <Bar dataKey="requests" name="Requests Volume" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {aiModelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Table Breakdown */}
        <Card className="border-border bg-card shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cost Telemetry</CardTitle>
            <CardDescription>Estimated spending by engine</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Engine</TableHead>
                  <TableHead className="text-right">Spending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiModelUsageData.map((item, idx) => (
                  <TableRow key={item.name} className="border-border">
                    <TableCell className="font-semibold text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold">${item.cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
