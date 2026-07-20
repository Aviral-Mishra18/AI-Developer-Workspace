"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Percent, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data: proj, error } = await supabase
          .from("projects")
          .select("*, project_members(user_id, role, profiles(id, name, avatar))")
          .eq("id", projectId)
          .maybeSingle();

        if (error) throw error;
        if (proj) {
          const team = proj.project_members?.map((m: any) => ({
            id: m.profiles?.id || "u-unknown",
            name: m.profiles?.name || "Member",
            avatar: m.profiles?.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${m.profiles?.id}`,
          })) || [];

          setProject({
            id: proj.id,
            name: proj.name,
            description: proj.description,
            status: proj.status,
            progress: proj.progress || 0,
            createdAt: new Date(proj.created_at).toLocaleDateString(),
            lastUpdated: new Date(proj.updated_at).toLocaleDateString(),
            team,
          });
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (isLoading) return <div className="p-8 flex justify-center">Loading project...</div>;
  if (!project) return <div className="p-8 text-center font-bold">Project not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge
              className={cn(
                "capitalize border-0",
                project.status === "active"
                  ? "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400"
                  : project.status === "completed"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : project.status === "on-hold"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400"
              )}
              variant="outline"
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            {project.description}
          </p>
        </div>
      </div>

      {/* Info Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Progress</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">{project.team.length}</div>
            <div className="flex -space-x-1.5 overflow-hidden ml-2">
              {project.team.map((m: any) => (
                <Avatar key={m.id} className="h-5 w-5 ring-1 ring-background border border-border">
                  <AvatarImage src={m.avatar} />
                  <AvatarFallback>{m.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Created At</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">{project.createdAt}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Last Updated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">{project.lastUpdated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Embedded Kanban Board */}
      <div className="space-y-2 pt-4">
        <h2 className="text-lg font-bold text-foreground">Sprint Task Board</h2>
        <KanbanBoard projectId={project.id} />
      </div>
    </div>
  );
}
