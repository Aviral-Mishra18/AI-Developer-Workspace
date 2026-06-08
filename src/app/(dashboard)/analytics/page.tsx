"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceAnalytics } from "@/components/analytics/WorkspaceAnalytics";
import { TeamProductivity } from "@/components/analytics/TeamProductivity";
import { AIUsageStats } from "@/components/analytics/AIUsageStats";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, Sparkles } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Analytics & Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Perform deep queries on team velocities, server loads, and AI completions.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="bg-muted w-full sm:w-auto flex sm:inline-flex border border-border">
          <TabsTrigger value="workspace" className="flex-1 sm:flex-initial gap-1.5 flex items-center">
            <BarChart3 className="h-4 w-4" />
            Workspace Analytics
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex-1 sm:flex-initial gap-1.5 flex items-center">
            <Users className="h-4 w-4" />
            Team Productivity
          </TabsTrigger>
          <TabsTrigger value="ai-usage" className="flex-1 sm:flex-initial gap-1.5 flex items-center">
            <Sparkles className="h-4 w-4" />
            AI Usage Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-4">
          <WorkspaceAnalytics />
        </TabsContent>

        <TabsContent value="productivity" className="mt-4">
          <TeamProductivity />
        </TabsContent>

        <TabsContent value="ai-usage" className="mt-4">
          <AIUsageStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}
