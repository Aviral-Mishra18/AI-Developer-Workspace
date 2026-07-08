"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { codeReviewIssues, CodeReviewIssue } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ShieldAlert, Cpu, Sparkles, CheckCircle2, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

function CodeReviewResultsContent() {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("id");
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!reviewId) {
        setIssues(codeReviewIssues);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("ai_code_review_issues")
          .select("*")
          .eq("review_id", reviewId);

        if (error) throw error;

        const mappedIssues = (data || []).map(i => ({
          id: i.id,
          title: i.title,
          severity: i.severity,
          category: i.category,
          description: i.description,
          file: i.file_path,
          line: i.line_number,
          suggestion: i.suggestion
        }));

        setIssues(mappedIssues);
      } catch (err: any) {
        console.error("Failed to load review results:", err.message);
        setIssues(codeReviewIssues);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [reviewId]);

  const securityIssues = issues.filter((i) => i.category === "security");
  const performanceIssues = issues.filter((i) => i.category === "performance");
  const bestPracticeIssues = issues.filter((i) => i.category === "best-practices");
  const codeSmells = issues.filter((i) => i.category === "code-smells");
  const aiSuggestions = issues.filter((i) => i.category === "ai-suggestions");

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
      case "warning":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400";
    }
  };

  const renderIssueCard = (issue: CodeReviewIssue) => (
    <Card key={issue.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">{issue.title}</h3>
              <Badge className={cn("text-[9px] uppercase border-0 font-bold", getSeverityColor(issue.severity))}>
                {issue.severity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {issue.file}:{issue.line}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {issue.description}
        </p>
        <div className="bg-slate-950 dark:bg-black p-3.5 rounded-lg border border-border">
          <div className="text-[10px] text-zinc-400 font-semibold mb-1">RECOMMENDED CORRECTION</div>
          <code className="text-xs text-zinc-200 font-mono block break-all leading-relaxed whitespace-pre-wrap">
            {issue.suggestion}
          </code>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/ai-review" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Static application safety testing reports (SAST) for staged repository.
          </p>
        </div>
      </div>

      {/* Metrics Summary Widgets */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Security Flaws</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-rose-500">{securityIssues.length}</div>
            <ShieldAlert className="h-5 w-5 text-rose-500" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Performance bottlenecks</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-amber-500">{performanceIssues.length}</div>
            <Cpu className="h-5 w-5 text-amber-500" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-sky-500">{bestPracticeIssues.length}</div>
            <CheckCircle2 className="h-5 w-5 text-sky-500" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Scanned files</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">48</div>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs list */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-muted w-full justify-start overflow-x-auto flex border border-border h-auto py-1">
          <TabsTrigger value="security">Security ({securityIssues.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance ({performanceIssues.length})</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices ({bestPracticeIssues.length})</TabsTrigger>
          <TabsTrigger value="code-smells">Code Smells ({codeSmells.length})</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions ({aiSuggestions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="mt-4 space-y-4">
          {securityIssues.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">No security vulnerabilities found.</div>
          ) : (
            securityIssues.map(renderIssueCard)
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-4 space-y-4">
          {performanceIssues.map(renderIssueCard)}
        </TabsContent>

        <TabsContent value="best-practices" className="mt-4 space-y-4">
          {bestPracticeIssues.map(renderIssueCard)}
        </TabsContent>

        <TabsContent value="code-smells" className="mt-4 space-y-4">
          {codeSmells.map(renderIssueCard)}
        </TabsContent>

        <TabsContent value="ai-suggestions" className="mt-4 space-y-4">
          {aiSuggestions.map(renderIssueCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CodeReviewResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CodeReviewResultsContent />
    </Suspense>
  );
}
