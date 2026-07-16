"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!");
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4 rounded-xl transition-colors",
        role === "assistant"
          ? "bg-slate-50/50 dark:bg-slate-900/30 border border-border/40"
          : "bg-background"
      )}
    >
      <Avatar className={cn("h-8 w-8 border", role === "assistant" ? "border-primary/20 bg-primary/10" : "border-border")}>
        {role === "assistant" ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="https://api.dicebear.com/8.x/avataaars/svg?seed=Alex" />
            <AvatarFallback>AM</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-foreground/80">
            {role === "assistant" ? "Vionex Assistant" : "You"}
          </span>
          <span className="text-[10px] text-muted-foreground">{timestamp}</span>
        </div>

        {/* Message Content */}
        <div className="text-sm leading-relaxed text-foreground/90 space-y-4 break-words prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              // Render code blocks with copy buttons
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");

                if (!inline && match) {
                  return (
                    <div className="relative my-3 rounded-lg overflow-hidden border border-border bg-slate-950 dark:bg-black">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border/80 bg-slate-900/80 dark:bg-zinc-950/80 text-[10px] text-zinc-400 font-mono">
                        <span>{match[1].toUpperCase()}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(codeString)}
                          className="h-5 w-5 text-zinc-400 hover:text-white"
                        >
                          {copiedCode === codeString ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs text-zinc-100 font-mono leading-relaxed">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }

                return (
                  <code
                    className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-xs font-mono border border-border/60"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
