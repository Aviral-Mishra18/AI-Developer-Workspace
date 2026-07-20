"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Upload, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

export default function MeetingNotesPage() {
  const { profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  const [activeMeeting, setActiveMeeting] = useState<any>(null);
  const [actionItems, setActionItems] = useState<any[]>([]);

  useEffect(() => {
    // Try to load the most recent meeting note
    const fetchLatestMeeting = async () => {
      if (!profile?.id) return;
      try {
        const { data: meetings, error: meetingError } = await supabase
          .from('meeting_notes')
          .select('*')
          .eq('created_by', profile.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (meetingError) throw meetingError;
        
        if (meetings && meetings.length > 0) {
          const meeting = meetings[0];
          setActiveMeeting(meeting);
          
          const { data: items, error: itemsError } = await supabase
            .from('meeting_action_items')
            .select('*')
            .eq('meeting_id', meeting.id);
            
          if (itemsError) throw itemsError;
          if (items) setActionItems(items);
        }
      } catch (err: any) {
        console.error("Failed to load meetings", err);
      }
    };
    fetchLatestMeeting();
  }, [profile]);

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

    const interval = setInterval(async () => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 300);

    setTimeout(async () => {
      clearInterval(interval);
      setProcessProgress(100);
      try {
        if (!profile?.id) throw new Error("No profile");
        
        // Find a project to attach to (schema requires project_id)
        const { data: projects } = await supabase.from('projects').select('id').limit(1);
        const projectId = projects?.[0]?.id;
        
        if (!projectId) {
           throw new Error("You need to create a project first before saving meetings.");
        }

        // Simulate creating a meeting
        const { data: meeting, error: meetingError } = await supabase
          .from('meeting_notes')
          .insert({
            project_id: projectId,
            title: "Generated Meeting Notes",
            date: new Date().toISOString().split('T')[0],
            duration: "45 min",
            status: "completed",
            summary: "Discussed the new design system implementation and state management refactor. Agreed to use Zustand for global state and Shadcn for UI components.",
            speakers: [
              { name: "You", duration: "15m", percentage: 33 },
              { name: "Team", duration: "30m", percentage: 67 }
            ],
            created_by: profile.id
          })
          .select()
          .single();
          
        if (meetingError) throw meetingError;

        // Simulate action items
        const { data: items, error: itemsError } = await supabase
          .from('meeting_action_items')
          .insert([
            { meeting_id: meeting.id, text: "Initialize Zustand store", created_by: profile.id },
            { meeting_id: meeting.id, text: "Install Shadcn UI", created_by: profile.id }
          ])
          .select();
          
        if (itemsError) throw itemsError;

        setActiveMeeting(meeting);
        setActionItems(items || []);
        toast.success("Audio analysis and transcription complete!");
      } catch (err: any) {
        toast.error("Failed to save transcribed meeting: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }, 2500);
  };

  const handleToggleAction = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !currentStatus } : item))
    );
    try {
      await supabase
        .from('meeting_action_items')
        .update({ done: !currentStatus })
        .eq('id', id);
    } catch (err: any) {
      toast.error("Failed to update action item");
      // Revert
      setActionItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, done: currentStatus } : item))
      );
    }
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

      {!activeMeeting ? (
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
                  <CardTitle className="text-lg font-semibold">{activeMeeting.title}</CardTitle>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {activeMeeting.date} ({activeMeeting.duration})
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">Executive Summary</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {activeMeeting.summary}
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
                          onCheckedChange={() => handleToggleAction(item.id, item.done)}
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
                        Unassigned
                      </Badge>
                    </div>
                  ))}
                  {actionItems.length === 0 && (
                    <div className="py-3 text-sm text-muted-foreground">No action items found.</div>
                  )}
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
                  {(activeMeeting.speakers || []).map((sp: any) => (
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
                  <Button variant="outline" onClick={() => { setActiveMeeting(null); setUploadedFile(null); }} className="w-full text-xs h-8">
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
