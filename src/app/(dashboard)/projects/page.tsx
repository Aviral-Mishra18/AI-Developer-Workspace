"use client";

import { useState, useEffect } from "react";
import { projects as mockProjects } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, LayoutGrid, List, FolderGit2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        // Transform the date format to match UI if needed
        const formattedData = (data || []).map(p => ({
          ...p,
          lastUpdated: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Just now",
          team: p.team || mockProjects[0].team, // Fallback team since table doesn't have it yet
        }));
        setProjects(formattedData);
      } catch (err: any) {
        console.error("Failed to fetch projects:", err.message || JSON.stringify(err) || err);
        if (process.env.NODE_ENV === "development") {
          toast.error(`Supabase fetch failed, showing mock data: ${err.message || "unknown error"}`);
        }
        // Fallback to mock data if the table doesn't exist or fetch fails
        setProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleCreateProject = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and update progress milestones across all active team codebases.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <Select defaultValue="all" onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[160px] bg-card border-border">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-card shrink-0">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 rounded-md"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid View</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 rounded-md"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
        </div>
      </div>

      {/* Grid or List Rendering */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card text-center space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground">
            <FolderGit2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No projects found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any projects matching your filters. Try adjusting your settings or create a project.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Create Project
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <ProjectCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              status={p.status}
              team={p.team}
              progress={p.progress}
              lastUpdated={p.lastUpdated}
            />
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {filteredProjects.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                <div className="space-y-1 max-w-md">
                  <h3 className="font-semibold hover:text-primary transition-colors text-sm">
                    <Link href={`/projects/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress bar */}
                  <div className="w-[120px] hidden md:block space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1" />
                  </div>

                  <Badge
                    className={cn(
                      "capitalize border-0",
                      p.status === "active"
                        ? "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400"
                        : p.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : p.status === "on-hold"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400"
                    )}
                    variant="outline"
                  >
                    {p.status}
                  </Badge>

                  <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                    Updated {p.lastUpdated}
                  </div>

                  <Button variant="ghost" size="sm" render={<Link href={`/projects/${p.id}`} />} nativeButton={false} className="h-8">
                    Board
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateProject}
      />
    </div>
  );
}
