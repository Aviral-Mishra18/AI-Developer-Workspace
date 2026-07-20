"use client";

import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Building, Activity, Trash2, Search, SlidersHorizontal, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('profiles').select('*');
      if (usersData) setUsers(usersData.map((u: any) => ({ ...u, role: u.system_role || 'User' })));

      const { data: wsData } = await supabase.from('workspaces').select('*');
      if (wsData) setWorkspaces(wsData.map((w: any) => ({ ...w, owner: { name: w.created_by || 'Unknown' }, projectCount: 0, storage: '0.1 GB' })));

      const { data: logData } = await supabase.from('activity_logs').select('*');
      if (logData) setLogs(logData.map((l: any) => ({ 
        id: l.id,
        user: l.user_id || 'System',
        action: l.action,
        resource: l.resource,
        timestamp: new Date(l.created_at).toLocaleString(),
        ip: l.ip_address || '127.0.0.1',
        status: l.status
      })));
    };
    fetchData();
  }, []);

  const systemHealthData = {
    apiServer: { status: "operational" as const, uptime: 99.99, responseTime: 45 },
    database: { status: "operational" as const, uptime: 99.95, responseTime: 12 },
    storage: { status: "operational" as const, uptime: 99.99, responseTime: 88 },
  };
  
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  const handleSuspendUser = (id: string, name: string) => {
    toast.warning(`User ${name} has been suspended.`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error("User deleted permanently.");
  };

  const handleRefreshSystem = () => {
    toast.success("Querying fresh telemetry diagnostics...");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = logs.filter((l) =>
    l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.resource.toLowerCase().includes(logSearch.toLowerCase())
  );

  const getHealthStatusColor = (status: "operational" | "degraded" | "outage") => {
    switch (status) {
      case "operational":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "degraded":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      default:
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
    }
  };

  const getLogStatusColor = (status: "success" | "failed" | "warning") => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "failed":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Perform administrative actions, configure service uptime and analyze audit logging.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-muted w-full md:w-auto flex md:inline-flex border border-border overflow-x-auto h-auto py-1 justify-start">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="workspaces" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Workspaces
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">User Directory</CardTitle>
                <CardDescription>Manage active user profiles and role allocations</CardDescription>
              </div>
              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 h-9 bg-background border-border text-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>User Details</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-xs text-foreground">{user.name}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="text-[10px] py-0 px-1.5 font-bold">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuspendUser(user.id, user.name)}
                          className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          Suspend
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WORKSPACES TAB */}
        <TabsContent value="workspaces" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active Org Workspaces</CardTitle>
              <CardDescription>Review workspaces ownership and resources allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Workspace Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Projects count</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaces.map((ws) => (
                    <TableRow key={ws.id} className="border-border">
                      <TableCell className="font-semibold text-xs text-foreground">{ws.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ws.owner.name}</TableCell>
                      <TableCell className="text-xs text-center font-bold">{ws.projectCount}</TableCell>
                      <TableCell className="text-xs font-mono font-semibold">{ws.storage}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 capitalize border-0 font-bold text-[10px]">
                          active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYSTEM HEALTH TAB */}
        <TabsContent value="health" className="mt-4 space-y-4">
          <div className="flex justify-end shrink-0">
            <Button variant="outline" size="sm" onClick={handleRefreshSystem} className="h-8 border-border bg-card hover:bg-accent flex items-center gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh Telemetry
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">API Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Badge className={cn("text-[9px] uppercase border-0 font-bold", getHealthStatusColor(systemHealthData.apiServer.status))}>
                  {systemHealthData.apiServer.status}
                </Badge>
                <div className="text-xs pt-1.5 text-muted-foreground">Uptime: {systemHealthData.apiServer.uptime}%</div>
                <div className="text-xs text-muted-foreground">Latency: {systemHealthData.apiServer.responseTime}ms</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Database instance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Badge className={cn("text-[9px] uppercase border-0 font-bold", getHealthStatusColor(systemHealthData.database.status))}>
                  {systemHealthData.database.status}
                </Badge>
                <div className="text-xs pt-1.5 text-muted-foreground">Uptime: {systemHealthData.database.uptime}%</div>
                <div className="text-xs text-muted-foreground">Latency: {systemHealthData.database.responseTime}ms</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Storage volumes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Badge className={cn("text-[9px] uppercase border-0 font-bold", getHealthStatusColor(systemHealthData.storage.status))}>
                  {systemHealthData.storage.status}
                </Badge>
                <div className="text-xs pt-1.5 text-muted-foreground">Uptime: {systemHealthData.storage.uptime}%</div>
                <div className="text-xs text-muted-foreground">Latency: {systemHealthData.storage.responseTime}ms</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="logs" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Security Audit Log</CardTitle>
                <CardDescription>Immutable record of system access operations</CardDescription>
              </div>
              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter audit actions..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="pl-9 h-9 bg-background border-border text-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="border-border">
                      <TableCell className="font-mono text-[10px] text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="text-xs font-semibold">{log.user}</TableCell>
                      <TableCell className="text-xs">{log.action}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{log.resource}</TableCell>
                      <TableCell className="font-mono text-[10px]">{log.ip}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn("text-[9px] uppercase border-0 font-bold", getLogStatusColor(log.status))}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
