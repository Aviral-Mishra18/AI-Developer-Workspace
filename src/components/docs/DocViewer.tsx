"use client";

import { Button } from "@/components/ui/button";
import { Download, Link2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const generateSlug = (children: any): string => {
  const extractText = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node && node.props && node.props.children) return extractText(node.props.children);
    return "";
  };
  const text = extractText(children);
  return text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
};

const TocNode = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!item.children || item.children.length === 0) {
    return (
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={cn(
          "text-muted-foreground hover:text-primary transition-colors font-medium block py-1",
          item.level === 3 ? "pl-4 text-[11px]" : ""
        )}
      >
        {item.title}
      </a>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between group">
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-muted-foreground hover:text-primary transition-colors font-medium block py-1 flex-1"
        >
          {item.title}
        </a>
        <CollapsibleTrigger className="text-muted-foreground hover:text-primary p-0.5 rounded-md hover:bg-accent shrink-0">
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", !isOpen && "-rotate-90")} />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-0.5 mt-0.5">
        {item.children.map((child: any, idx: number) => (
          <TocNode key={`${child.id}-${idx}`} item={child} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function DocViewer({ content = "" }: { content?: string }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Documentation link copied!");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "getting_started_guide.md";
    document.body.appendChild(element);
    element.click();
    toast.success("Documentation exported as Markdown!");
  };

  // Dynamically generate table of contents from markdown content
  const tocItems = useMemo(() => {
    if (!content) return [];
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: any[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      // Remove markdown formatting characters from title
      const rawTitle = match[2].trim();
      const cleanTitle = rawTitle.replace(/[*_`]/g, '');
      const level = match[1].length;
      const id = generateSlug(rawTitle);
      
      const item = { level, title: cleanTitle, id, children: [] };
      
      if (level === 2) {
        items.push(item);
      } else if (level === 3) {
        if (items.length > 0 && items[items.length - 1].level === 2) {
          items[items.length - 1].children.push(item);
        } else {
          items.push(item);
        }
      }
    }
    return items;
  }, [content]);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Table of Contents Sidebar */}
      {tocItems.length > 0 && (
        <div className="w-full md:w-[200px] border border-border rounded-xl p-4 bg-card shrink-0 sticky top-20">
          <Collapsible open={isTocOpen} onOpenChange={setIsTocOpen} className="w-full">
            <div 
              className="flex items-center justify-between group cursor-pointer"
              onClick={() => setIsTocOpen(!isTocOpen)}
            >
              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider select-none">
                On This Page
              </h3>
              <CollapsibleTrigger onClick={(e: any) => e.stopPropagation()} className="text-muted-foreground hover:text-primary p-0.5 rounded-md hover:bg-accent shrink-0">
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", !isTocOpen && "-rotate-90")} />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-3 space-y-3">
              <nav className="flex flex-col gap-1 text-xs">
                {tocItems.map((item, idx) => (
                  <TocNode key={`${item.id}-${idx}`} item={item} />
                ))}
              </nav>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

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
              h2({ children }) {
                return <h2 id={generateSlug(children)} className="text-2xl font-semibold mt-8 mb-4">{children}</h2>;
              },
              h3({ children }) {
                return <h3 id={generateSlug(children)} className="text-xl font-medium mt-6 mb-3">{children}</h3>;
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
