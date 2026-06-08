"use client";

import * as React from "react";
import { workspaces, users, activityFeed } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, Users, FolderGit, Database, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityFeed as ActivityFeedWidget } from "@/components/dashboard/ActivityFeed";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkspaceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const workspaceId = resolvedParams.id;

  const workspace = workspaces.find((w) => w.id === workspaceId) || workspaces[0];

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
                  {users.slice(0, 5).map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {user.role === "Admin" ? "Full Control" : "Read, Write, Execute"}
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
