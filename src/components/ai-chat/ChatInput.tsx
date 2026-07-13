"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, FileText, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string, file: File | null) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !selectedFile) return;
    onSend(input, selectedFile);
    setInput("");
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File exceeds 10MB upload limit");
        return;
      }
      setSelectedFile(file);
      toast.success(`Attached ${file.name}`);
    }
  };

  return (
    <div className="space-y-2">
      {/* File Attachment Preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg max-w-xs animate-in fade-in duration-200">
          {selectedFile.type.startsWith("image/") ? (
            <Image className="h-4 w-4 text-sky-500 shrink-0" />
          ) : (
            <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span className="text-xs truncate font-medium flex-1">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            className="h-5 w-5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input Form container */}
      <div className="relative border border-border bg-card rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-primary/20">
        <Textarea
          placeholder="Ask AI anything, attach code files..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full min-h-[48px] max-h-[160px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none py-3 pl-3 pr-16 text-sm"
        />

        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || (!input.trim() && !selectedFile)}
            className="h-7 w-7 rounded-md shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{input.length} characters</span>
      </div>
    </div>
  );
}
