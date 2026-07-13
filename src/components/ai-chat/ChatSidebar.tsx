"use client";

import { useState } from "react";
import { ChatConversation } from "@/lib/mock-data";
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
    <div className="w-full md:w-[280px] border-r border-border bg-card flex flex-col h-full shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border space-y-3 shrink-0">
        <Button onClick={onNewChat} className="w-full flex items-center justify-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-background border-border text-xs"
          />
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
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
                  "w-full flex flex-col items-start text-left p-3 rounded-lg text-xs space-y-1.5 transition-colors group relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={cn("font-semibold truncate pr-4 text-xs", isActive ? "text-primary-foreground" : "text-foreground")}>
                    {c.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0 group-hover:hidden transition-all">
                    {c.time}
                  </span>
                </div>
                <p className="line-clamp-1 leading-normal text-muted-foreground/80 break-all text-[11px]">
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
