"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { ChatSidebar } from "@/components/ai-chat/ChatSidebar";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { TypingIndicator } from "@/components/ai-chat/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AIChatPage() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!profile?.id) return;
    try {
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('created_by', profile.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        lastMessage: "...",
        time: new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messageCount: 0,
      }));

      setConversations(mapped);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load conversations");
    }
  }, [profile]);

  const { messages, setMessages, sendMessage, status } = useChat({
    id: activeChatId || "default",
    onError: (error) => {
      toast.error(`AI Chat Error: ${error.message}`);
    },
    onFinish: async (event: { message: UIMessage }) => {
      const message = event.message;
      if (activeChatId) {
        try {
          await supabase
            .from('ai_chat_messages')
            .insert({
              conversation_id: activeChatId,
              role: 'assistant',
              content: message.parts?.filter(p => p.type === 'text').map(p => (p as any).text).join('') || ''
            });
          fetchConversations();
        } catch (err) {
          console.error("Failed to save assistant message", err);
        }
      }
    }
  });

  const handleSelectChat = useCallback(async (id: string) => {
    setActiveChatId(id);
    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages((data || []).map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        parts: [{ type: 'text', text: m.content }],
        createdAt: new Date(m.created_at),
      } as any)));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load messages");
      setMessages([]);
    }
  }, [setMessages]);

  // Initial load auto-select
  useEffect(() => {
    fetchConversations().then(() => {
      // Do nothing extra here
    });
  }, [fetchConversations]);

  useEffect(() => {
    if (conversations.length > 0 && !activeChatId) {
      handleSelectChat(conversations[0].id);
    }
  }, [conversations, activeChatId, handleSelectChat]);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, status]);

  const handleNewChat = async () => {
    if (!profile?.id) return;
    try {
      const { data: workspaces } = await supabase.from('workspaces').select('id').limit(1);
      const workspaceId = workspaces?.[0]?.id;

      if (!workspaceId) {
        toast.error("You need a workspace to start a chat.");
        return;
      }

      const { data, error } = await supabase
        .from('ai_chats')
        .insert({
          title: "New Conversation",
          workspace_id: workspaceId,
          created_by: profile.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      setActiveChatId(data.id);

      // Initialize with a welcome message locally
      setMessages([
        {
          id: `m-welcome-${Date.now()}`,
          role: "assistant",
          parts: [{ type: 'text', text: "Hello! I am your AI coding assistant. Ask me anything about Next.js, React, Node.js, databases, or cloud infrastructure." }],
          createdAt: new Date(),
        } as any,
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to start new chat");
    }
  };

  const handleSend = async (text: string, file: File | null) => {
    if (!activeChatId) return;

    const userMsgContent = text + (file ? `\n\n*(Attached file: ${file.name})*` : "");

    // Add message to chat UI & stream response
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: userMsgContent }],
    });

    try {
      // Save user message to database
      await supabase
        .from('ai_chat_messages')
        .insert({
          conversation_id: activeChatId,
          role: 'user',
          content: userMsgContent
        });

      // Update conversation title/time
      await supabase
        .from('ai_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeChatId);

      fetchConversations();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save user message");
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-30" />

      {/* Page Title */}
      <div className="shrink-0 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-primary via-primary/80 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
          AI Assistant Chat
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with Vionex assistant, generate codebase documentation, or debug components.
        </p>
      </div>

      {/* Main chat UI */}
      <div className="flex-1 flex flex-col md:flex-row border border-border/60 rounded-2xl bg-card/60 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-0 relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[280px] shrink-0 border-r border-border/60 bg-background/30">
          <ChatSidebar
            conversations={conversations}
            activeId={activeChatId || ""}
            onSelect={handleSelectChat}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Mobile Sidebar Trigger (Header overlay) */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card">
          <span className="font-semibold text-sm">Conversations</span>
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <ChatSidebar
                conversations={conversations}
                activeId={activeChatId || ""}
                onSelect={(id) => {
                  handleSelectChat(id);
                  // Auto-close could be implemented here if we tracked sheet open state,
                  // but shadcn sheet allows user to click away or press esc.
                }}
                onNewChat={handleNewChat}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col h-full bg-background/30">
          {/* Scroll messages window */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 overflow-hidden p-4">
            <div className="space-y-4 max-w-3xl mx-auto py-2">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20">No messages yet. Select a conversation or start a new one.</div>
              ) : (
                messages.map((msg: UIMessage) => {
                  const createdAt = (msg as any).createdAt;
                  return (
                    <ChatMessage
                      key={msg.id}
                      role={msg.role as any}
                      content={msg.parts?.filter(p => p.type === 'text').map((p: any) => p.text).join('') || (msg as any).content || ''}
                      timestamp={createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                  );
                })
              )}
              {['submitted', 'streaming'].includes(status) && messages[messages.length - 1]?.role !== 'assistant' && (
                <TypingIndicator />
              )}
            </div>
          </ScrollArea>

          {/* Fixed Input Dock */}
          <div className="p-4 border-t border-border bg-card/65 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} disabled={['submitted', 'streaming'].includes(status) || !activeChatId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
