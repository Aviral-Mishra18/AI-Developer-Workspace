"use client";

import { Button } from "@/components/ui/button";
import { Download, Link2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { docContent } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export function DocViewer() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Documentation link copied!");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([docContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "getting_started_guide.md";
    document.body.appendChild(element);
    element.click();
    toast.success("Documentation exported as Markdown!");
  };

  // Simple hardcoded table of contents for presentation
  const tocItems = [
    { title: "Prerequisites", id: "#prerequisites" },
    { title: "Quick Start", id: "#quick-start" },
    { title: "Project Structure", id: "#project-structure" },
    { title: "Next Steps", id: "#next-steps" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Table of Contents Sidebar */}
      <div className="w-full md:w-[200px] border border-border rounded-xl p-4 bg-card shrink-0 space-y-3">
        <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
          On This Page
        </h3>
        <nav className="flex flex-col gap-2 text-xs">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={item.id}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Documentation Viewer */}
      <div className="flex-1 border border-border rounded-xl bg-card shadow-sm overflow-hidden w-full">
        {/* Actions bar */}
        <div className="flex items-center justify-between border-b border-border bg-slate-50/50 dark:bg-slate-900/20 px-6 py-3 shrink-0">
          <span className="text-xs text-muted-foreground font-semibold font-mono">
            FORMAT: MARKDOWN
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 text-xs border-border bg-card hover:bg-accent flex items-center gap-1"
            >
              {copiedLink ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Link2 className="h-3.5 w-3.5" />
              )}
              Copy link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="h-8 text-xs border-border bg-card hover:bg-accent flex items-center gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              Export .md
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-none prose dark:prose-invert text-sm break-words leading-relaxed text-foreground/90 space-y-4">
          <ReactMarkdown
            components={{
              pre({ children }) {
                return (
                  <pre className="bg-slate-950 dark:bg-black p-4 rounded-lg border border-border/80 text-zinc-100 font-mono text-xs overflow-x-auto my-4 leading-relaxed">
                    {children}
                  </pre>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-6 border border-border rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">{children}</table>
                  </div>
                );
              },
              thead({ children }) {
                return <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border">{children}</thead>;
              },
              tbody({ children }) {
                return <tbody className="divide-y divide-border">{children}</tbody>;
              },
              th({ children }) {
                return <th className="p-3 font-semibold text-foreground/80">{children}</th>;
              },
              td({ children }) {
                return <td className="p-3 text-muted-foreground">{children}</td>;
              },
            }}
          >
            {docContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
