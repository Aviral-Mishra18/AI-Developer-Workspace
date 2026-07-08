"use client";

import { useState, useEffect } from "react";
import { workspaces as initialWorkspaces } from "@/lib/mock-data";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { CreateWorkspaceModal } from "@/components/workspace/CreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Building, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function WorkspaceListPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisibility, setFilterVisibility] = useState<string>("all");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const enrichedWorkspaces = await Promise.all((data || []).map(async (ws) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from("workspace_members")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", ws.id);

          // Get project count
          const { count: projectCount } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", ws.id);

          return {
            id: ws.id,
            name: ws.name,
            description: ws.description,
            visibility: ws.visibility,
            memberCount: memberCount || 1,
            projectCount: projectCount || 0,
            storage: "0.1 GB",
            lastActivity: "Just now",
            createdAt: ws.created_at,
          };
        }));

        setWorkspaces(enrichedWorkspaces);
      } catch (err: any) {
        console.error("Failed to fetch workspaces:", err.message);
        setWorkspaces(initialWorkspaces);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = (newWorkspace: any) => {
    setWorkspaces((prev) => [newWorkspace, ...prev]);
  };

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVisibility =
      filterVisibility === "all" || ws.visibility === filterVisibility;

    return matchesSearch && matchesVisibility;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Workspaces
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your collaborative environments, projects, and permissions.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select defaultValue="all" onValueChange={(val) => setFilterVisibility(val || "all")}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
            <SelectValue placeholder="Filter Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visibilities</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card text-center space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground">
            <Building className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No workspaces found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any workspaces matching your query. Try clearing your filters or create a new workspace.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Create Workspace
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              id={ws.id}
              name={ws.name}
              description={ws.description}
              memberCount={ws.memberCount}
              projectCount={ws.projectCount}
              storage={ws.storage}
              visibility={ws.visibility}
              lastActivity={ws.lastActivity}
            />
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateWorkspace}
      />
    </div>
  );
}
