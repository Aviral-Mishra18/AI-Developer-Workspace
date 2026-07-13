"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { workspaces as mockWorkspaces, users as mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield, Users, FolderGit, Database, UserPlus, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityFeed as ActivityFeedWidget } from "@/components/dashboard/ActivityFeed";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkspaceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const workspaceId = resolvedParams.id;

  const [workspace, setWorkspace] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const { data: ws, error: wsError } = await supabase
          .from("workspaces")
          .select("*")
          .eq("id", workspaceId)
          .maybeSingle();

        if (wsError) throw wsError;

        if (!ws) {
          const fallbackWs = mockWorkspaces.find((w) => w.id === workspaceId) || mockWorkspaces[0];
          setWorkspace(fallbackWs);
          setMembers(mockUsers.slice(0, 5));
          setIsLoading(false);
          return;
        }

        // Get members
        const { data: membersData, error: memError } = await supabase
          .from("workspace_members")
          .select("role, profiles(id, name, email, avatar)")
          .eq("workspace_id", workspaceId);

        if (memError) throw memError;

        // Get project count
        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId);

        const formattedMembers = (membersData || []).map((m: any) => ({
          id: m.profiles?.id || "u-unknown",
          name: m.profiles?.name || "Collaborator",
          email: m.profiles?.email || "",
          avatar: m.profiles?.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${m.profiles?.id}`,
          role: m.role,
        }));

        setWorkspace({
          id: ws.id,
          name: ws.name,
          description: ws.description,
          visibility: ws.visibility,
          memberCount: formattedMembers.length,
          projectCount: projectCount || 0,
          storage: "0.1 GB",
        });
        setMembers(formattedMembers);
      } catch (err: any) {
        console.error("Failed to load workspace details:", err.message);
        const fallbackWs = mockWorkspaces.find((w) => w.id === workspaceId) || mockWorkspaces[0];
        setWorkspace(fallbackWs);
        setMembers(mockUsers.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Workspace not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
            <Badge variant={workspace.visibility === "private" ? "secondary" : "outline"} className="capitalize">
              {workspace.visibility}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            {workspace.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1.5">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Info Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.memberCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Projects</CardTitle>
            <FolderGit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.projectCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Storage Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.storage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Menu */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-muted w-full sm:w-auto flex sm:inline-flex border border-border">
          <TabsTrigger value="members" className="flex-1 sm:flex-initial">Members</TabsTrigger>
          <TabsTrigger value="roles" className="flex-1 sm:flex-initial">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 sm:flex-initial">Activity Feed</TabsTrigger>
        </TabsList>

        {/* Members List */}
        <TabsContent value="members" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Workspace Members</CardTitle>
              <CardDescription>People who have access to this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : "??"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "owner" || user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {user.role === "owner" || user.role === "admin" ? "Full Control" : "Read, Write, Execute"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Roles & Permissions Schema</CardTitle>
              <CardDescription>Configure organizational rights within this workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Admin
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Full control over workspaces, settings, billings, projects, and permissions. Can invite or expel members.
                  </p>
                </Card>
                <Card className="border-border bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Developer
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Can create projects, manage task boards, commit code, configure ML jobs, and run AI analytics.
                  </p>
                </Card>
                <Card className="border-border bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Shield className="h-4 w-4 text-slate-500" />
                    Viewer
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Read-only access to workspaces, tasks, code reviews, and analytics reports. Cannot perform modifications.
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Timeline */}
        <TabsContent value="activity" className="mt-4">
          <ActivityFeedWidget />
        </TabsContent>
      </Tabs>
    </div>
  );
}
