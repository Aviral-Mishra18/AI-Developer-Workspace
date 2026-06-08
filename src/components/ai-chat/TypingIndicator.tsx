import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex w-full items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-border/40 animate-pulse">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shrink-0">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-2 py-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-foreground/80">NexusAI Assistant</span>
          <span className="text-[10px] text-muted-foreground">Thinking...</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce duration-300" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce duration-300" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce duration-300" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
