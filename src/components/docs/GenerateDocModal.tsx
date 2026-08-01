"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string) => Promise<void>;
}

export function GenerateDocModal({ isOpen, onClose, onGenerate }: GenerateDocModalProps) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerate(topic.trim());
      setTopic("");
      onClose();
    } catch (error) {
      console.error("Failed to generate docs:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate AI Documentation
          </DialogTitle>
          <DialogDescription>
            Enter a topic, component, or system you want to generate documentation for. The AI will analyze and draft a comprehensive document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Documentation Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Authentication Flow, Next.js API Routes..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              className="bg-background border-border"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && topic.trim()) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!topic.trim() || isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
