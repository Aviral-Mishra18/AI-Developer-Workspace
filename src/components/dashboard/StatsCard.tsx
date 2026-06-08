import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function StatsCard({ title, value, change, trend, label, icon: Icon }: StatsCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
              trend === "up"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {trend === "up" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
