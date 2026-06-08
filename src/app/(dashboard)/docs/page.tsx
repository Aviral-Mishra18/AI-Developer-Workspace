"use client";

import { useState } from "react";
import { docs as initialDocs, docContent } from "@/lib/mock-data";
import { DocViewer } from "@/components/docs/DocViewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Clock, GitBranch, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DocsPage() {
  const [docsList, setDocsList] = useState(initialDocs);
  const [selectedDocId, setSelectedDocId] = useState(initialDocs[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedDoc = docsList.find((d) => d.id === selectedDocId) || docsList[0];

  const filteredDocs = docsList.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateDoc = () => {
    toast.info("Connecting to AI document parsing engines...");
    setTimeout(() => {
      const newDoc = {
        id: `d-${Date.now()}`,
        title: "API Endpoint Routing Documentation",
        description: "Auto-generated schemas for user auth router patterns.",
        category: "Reference",
        lastUpdated: "Just now",
        version: "1.0",
        status: "published" as const,
      };
      setDocsList((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      toast.success("Documentation generated successfully!");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            AI Documentation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and generate README, APIs, or architectural specifications directly from your codebase components.
          </p>
        </div>
        <Button onClick={handleGenerateDoc} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          Generate Docs
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Left Side: Directory search */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card">
            <CardHeader className="p-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-border text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0 max-h-[350px] overflow-y-auto space-y-1">
              {filteredDocs.map((doc) => {
                const isActive = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full flex items-start gap-2.5 p-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="space-y-1 min-w-0">
                      <div className="font-semibold text-xs truncate leading-normal text-foreground group-hover:text-primary">
                        {doc.title}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {doc.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Version / Activity info card */}
          <Card className="border-border bg-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs space-y-3">
              <div className="flex justify-between items-center text-muted-foreground border-b border-border/40 pb-2">
                <span>Active Version</span>
                <Badge className={cn("text-[10px] uppercase border-0 font-bold", getStatusColor(selectedDoc.status))}>
                  v{selectedDoc.version} - {selectedDoc.status}
                </Badge>
              </div>
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">Minor updates to README</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedDoc.lastUpdated} by Alex Morgan
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 mt-1.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-muted-foreground">Original doc generated</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      1 month ago by System AI
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Markdown Viewer */}
        <div className="lg:col-span-3">
          <DocViewer />
        </div>
      </div>
    </div>
  );
}
