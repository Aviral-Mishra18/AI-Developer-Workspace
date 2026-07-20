"use client";

import { useState, useEffect } from "react";
import { DocViewer } from "@/components/docs/DocViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Clock, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DocsPage() {
  const { profile } = useAuth();
  const [docsList, setDocsList] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocs = async () => {
    if (!profile?.id) return;
    try {
      const { data, error } = await supabase
        .from('ai_documentation')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocsList(data || []);
      if (data && data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch documentation");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [profile]);

  const selectedDoc = docsList.find((d) => d.id === selectedDocId) || null;

  const filteredDocs = docsList.filter((d) =>
    (d.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateDoc = async () => {
    toast.info("Connecting to AI document parsing engines...");
    try {
      // Find a workspace to attach to
      const { data: workspaces } = await supabase.from('workspaces').select('id').limit(1);
      const workspaceId = workspaces?.[0]?.id;
      
      if (!workspaceId) {
         toast.error("You need a workspace to generate docs.");
         return;
      }
      
      setTimeout(async () => {
        const { data, error } = await supabase
          .from('ai_documentation')
          .insert({
            workspace_id: workspaceId,
            title: "API Endpoint Routing Documentation",
            description: "Auto-generated schemas for user auth router patterns.",
            content: "# API Endpoint Routing Documentation\n\nThis is an auto-generated documentation for the API.\n\n## Prerequisites\n\nEnsure you have Node.js installed.\n\n## Quick Start\n\nRun `npm install` and `npm run dev`.\n\n## Next Steps\n\nStart building your API routes.",
            category: "Reference",
            version: "1.0",
            status: "published",
            created_by: profile?.id
          })
          .select()
          .single() as any;

        if (error) throw error;

        setDocsList((prev) => [data, ...prev]);
        setSelectedDocId(data.id);
        toast.success("Documentation generated successfully!");
      }, 1500);
    } catch (err: any) {
       toast.error("Failed to generate documentation");
    }
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
              {filteredDocs.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No documents found.
                </div>
              ) : (
                filteredDocs.map((doc) => {
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
                })
              )}
            </CardContent>
          </Card>

          {/* Version / Activity info card */}
          {selectedDoc && (
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
                      <p className="font-semibold">Last updated</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedDoc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-muted-foreground">Original doc generated</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedDoc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side: Markdown Viewer */}
        <div className="lg:col-span-3">
          {selectedDoc ? (
            <DocViewer content={selectedDoc.content} />
          ) : (
            <Card className="border-border bg-card h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select a document or generate a new one</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
