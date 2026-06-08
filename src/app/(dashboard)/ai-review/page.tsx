"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileSearch, GitBranch, UploadCloud, AlertCircle, FileCode, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CodeReviewUploadPage() {
  const router = useRouter();
  const [gitUrl, setGitUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
      toast.success(`Staged ${files.length} files for review.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
      toast.success(`Staged ${files.length} files for review.`);
    }
  };

  const handleStartReview = () => {
    if (uploadedFiles.length === 0 && !gitUrl.trim()) {
      toast.error("Please stage code files or enter a GitHub repository URL");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Simulate analysis steps
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            toast.success("Analysis complete! Rendering review results.");
            router.push("/ai-review/results");
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          AI Code Review
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload local code directories or fetch remote repositories to scan for security, performance, and formatting flaws.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Upload Form Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Upload Code Repository</CardTitle>
              <CardDescription>Drag and drop local source folders or connect Git</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-slate-50/20 dark:bg-slate-950/10 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground group-hover:text-primary transition-colors">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Drag and drop source folders here</p>
                    <p className="text-xs text-muted-foreground">Supports JS, TS, React, Python, Go (Max 50MB)</p>
                  </div>
                  <Label htmlFor="file-upload" className="inline-flex items-center gap-1.5 cursor-pointer bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-primary/90 shadow-sm">
                    Browse Files
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Git Repository Form */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or Connect remote repository</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="git-url">GitHub Repository URL</Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="git-url"
                    placeholder="https://github.com/company/nexus-app"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    className="pl-10 border-border bg-card"
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              {isUploading && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      Parsing imports & AST mapping...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/40 p-6 flex justify-between">
              <span className="text-xs text-muted-foreground">
                All source code is scanned in isolated ephemeral containers.
              </span>
              <Button onClick={handleStartReview} disabled={isUploading} className="shadow-sm">
                Start AI Review
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Selected files side view */}
        <div className="md:col-span-1">
          <Card className="border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Staged Items</CardTitle>
              <CardDescription>Queue for static code analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[350px] space-y-3">
              {uploadedFiles.length === 0 && !gitUrl ? (
                <div className="text-center py-16 text-xs text-muted-foreground space-y-2">
                  <FileCode className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                  <p>No files currently staged</p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {gitUrl && (
                    <div className="flex items-center gap-2 p-2 bg-slate-100/50 dark:bg-slate-900/40 rounded-lg border border-border">
                      <GitBranch className="h-4 w-4 text-slate-600 shrink-0" />
                      <span className="font-semibold truncate flex-1">{gitUrl}</span>
                    </div>
                  )}

                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg">
                      <FileCode className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate flex-1 font-medium">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
