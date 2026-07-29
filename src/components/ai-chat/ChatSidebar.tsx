"use client";

import { useState } from "react";
export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col shrink-0 border-r border-border bg-card/40 backdrop-blur-xl">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border space-y-3 shrink-0 bg-background/50">
        <Button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 shadow-sm rounded-xl hover:shadow-md transition-all">
          <Plus className="h-4 w-4" />
          <span className="font-medium">New Chat</span>
        </Button>
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-background/50 border-border text-xs rounded-xl focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground/80 flex flex-col items-center gap-2">
            <span className="text-2xl opacity-50">💭</span>
            No chats found
          </div>
        ) : (
          filteredConversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full flex flex-col items-start text-left p-3.5 rounded-xl text-xs space-y-2 transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground hover:scale-[1.01] border border-transparent hover:border-border/50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                )}
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className={cn("font-semibold truncate pr-4 text-sm", isActive ? "text-primary-foreground" : "text-foreground")}>
                    {c.title}
                  </span>
                  <span className={cn("text-[10px] shrink-0 transition-all", isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:opacity-70")}>
                    {c.time}
                  </span>
                </div>
                <p className={cn("line-clamp-2 leading-relaxed break-all text-[11px] relative z-10", isActive ? "text-primary-foreground/90" : "text-muted-foreground/70")}>
                  {c.lastMessage}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
