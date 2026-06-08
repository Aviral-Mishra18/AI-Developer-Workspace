import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, GitBranch } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProjectStatus = "active" | "completed" | "on-hold" | "planning";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  team: { id: string; name: string; avatar: string }[];
  progress: number;
  lastUpdated: string;
}

export function ProjectCard({
  id,
  name,
  description,
  status,
  team,
  progress,
  lastUpdated,
}: ProjectCardProps) {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "on-hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      case "planning":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400";
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
            <Link href={`/projects/${id}`}>{name}</Link>
          </CardTitle>
          <Badge className={cn("capitalize shrink-0 border-0", getStatusColor(status))} variant="outline">
            {status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-[36px] pt-1 text-xs leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-1 space-y-4">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Team Avatars */}
        <div className="flex items-center -space-x-2 overflow-hidden py-1">
          {team.map((member) => (
            <Avatar key={member.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-background border border-border">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
          {team.length === 0 && <span className="text-xs text-muted-foreground">Unassigned</span>}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between text-[11px] text-muted-foreground mt-auto border-t border-border/40 py-3">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Updated {lastUpdated}
        </span>
        <Link href={`/projects/${id}`} className="font-semibold text-primary hover:underline">
          View board &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
