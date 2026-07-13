"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Upload, Loader2, Calendar } from "lucide-react";
import { meetingNotes } from "@/lib/mock-data";
import { toast } from "sonner";

export default function MeetingNotesPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [actionItems, setActionItems] = useState(meetingNotes[0].actionItems);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      toast.success(`Staged ${file.name} for transcribing`);
    }
  };

  const handleStartProcessing = () => {
    if (!uploadedFile) {
      toast.error("Please stage an audio file first");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(10);

    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setShowNotes(true);
            toast.success("Audio analysis and transcription complete!");
          }, 600);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  const handleToggleAction = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Meeting Notes AI
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload audio recordings of your standups or planning sessions to generate summaries, speaker analysis, and action items.
        </p>
      </div>

      {!showNotes ? (
        <div className="max-w-2xl mx-auto py-8">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-primary/10 rounded-full text-primary w-12 h-12 flex items-center justify-center mb-2">
                <Mic className="h-6 w-6" />
              </div>
              <CardTitle>Transcribe Audio Meeting</CardTitle>
              <CardDescription>Upload MP3, WAV, M4A, or WebM files (Max 100MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setUploadedFile(file.name);
                    toast.success(`Staged ${file.name}`);
                  }
                }}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-slate-50/20 dark:bg-slate-950/10 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload className="h-6 w-6" />
                  </div>
                  {uploadedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">File staged successfully</p>
                      <p className="text-xs text-muted-foreground font-mono">{uploadedFile}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Drag and drop audio file here</p>
                      <p className="text-xs text-muted-foreground">Or click to select file from folders</p>
                    </div>
                  )}
                  <label htmlFor="audio-upload" className="inline-flex items-center gap-1.5 cursor-pointer bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-primary/90 shadow-sm">
                    Select File
                  </label>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Progress State */}
              {isProcessing && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      Splitting channels & assigning speaker diarization...
                    </span>
                    <span>{processProgress}%</span>
                  </div>
                  <Progress value={processProgress} className="h-1.5" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/40 p-6">
              <Button onClick={handleStartProcessing} disabled={isProcessing || !uploadedFile} className="shadow-sm">
                Transcribe Recording
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        /* Results View */
        <div className="grid gap-6 md:grid-cols-3 items-start animate-in fade-in duration-300">
          {/* Left Columns: Summary & Action Items */}
          <div className="md:col-span-2 space-y-6">
            {/* Metadata and Summary */}
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{meetingNotes[0].title}</CardTitle>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {meetingNotes[0].date} ({meetingNotes[0].duration})
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">Executive Summary</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {meetingNotes[0].summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Items Checklist */}
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Action Items</CardTitle>
                <CardDescription>Checkboxes representing assigned tasks for follow up</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {actionItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={item.id}
                          checked={item.done}
                          onCheckedChange={() => handleToggleAction(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className={`text-xs font-medium leading-none cursor-pointer ${
                            item.done ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.text}
                        </label>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {item.assignee}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Speaker Breakdown */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Speaker Breakdown</CardTitle>
                <CardDescription>Time allocation and conversation splits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {meetingNotes[0].speakers.map((sp) => (
                    <div key={sp.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5 border border-border">
                            <AvatarFallback>{sp.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {sp.name}
                        </span>
                        <span>{sp.duration} ({sp.percentage}%)</span>
                      </div>
                      <Progress value={sp.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setShowNotes(false)} className="w-full text-xs h-8">
                    Upload another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
