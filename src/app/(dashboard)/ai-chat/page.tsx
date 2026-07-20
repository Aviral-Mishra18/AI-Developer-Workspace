"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatSidebar } from "@/components/ai-chat/ChatSidebar";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { TypingIndicator } from "@/components/ai-chat/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";

export type MessageType = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

export default function AIChatPage() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        content: m.content,
        timestamp: new Date(m.created_at).toLocaleTimeString(),
      })));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load messages");
      setMessages([]);
    }
  }, []);

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
        time: new Date(c.updated_at).toLocaleTimeString(),
        messageCount: 0,
      }));
      
      setConversations(mapped);
      if (mapped.length > 0 && !activeChatId) {
        handleSelectChat(mapped[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load conversations");
    }
  }, [profile, activeChatId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);



  const handleNewChat = async () => {
    if (!profile?.id) return;
    try {
      // Create new chat in Supabase
      // Assuming a workspace exists, but we'll try to get first workspace or leave it null if schema allows
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
      setMessages([
        {
          id: "m-welcome",
          role: "assistant",
          content: "Hello! I am your AI coding assistant. Ask me anything about Next.js, React, Node.js, databases, or cloud infrastructure.",
          timestamp: "Just now",
        },
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to start new chat");
    }
  };

  const handleSend = async (text: string, file: File | null) => {
    if (!activeChatId) return;

    const userMsgContent = text + (file ? `\n\n*(Attached file: ${file.name})*` : "");
    
    // Optimistic UI update
    const userMsg: MessageType = {
      id: `m-temp-${Date.now()}`,
      role: "user",
      content: userMsgContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Save user message
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

      // Simulate AI response stream since we don't have an AI backend running here
      setTimeout(async () => {
        setIsTyping(false);
        const assistantMsgContent = `I received your prompt: **"${text.slice(0, 50)}..."**

Here is a quick breakdown to help you proceed:
1. **Best Practice**: Ensure your environment variables are configured correctly.
2. **Implementation**: Use hooks like \`useMemo\` if you are processing complex lists.
3. **Safety**: Validate all user-supplied endpoints using schemas like **Zod**.

Let me know if you would like me to generate a fully styled component code template for this implementation!`;

        // Save assistant message
        const { data: savedMsg } = await supabase
          .from('ai_chat_messages')
          .insert({
            conversation_id: activeChatId,
            role: 'assistant',
            content: assistantMsgContent
          })
          .select()
          .single();

        setMessages((prev) => [...prev, {
          id: savedMsg?.id || `m-temp-${Date.now()}`,
          role: "assistant",
          content: assistantMsgContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send message");
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Page Title */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          AI Assistant Chat
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with Vionex assistant, generate codebase documentation, or debug components.
        </p>
      </div>

      {/* Main chat UI */}
      <div className="flex-1 flex flex-col md:flex-row border border-border rounded-xl bg-card overflow-hidden shadow-sm min-h-0">
        <ChatSidebar
          conversations={conversations}
          activeId={activeChatId || ""}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
        />

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col h-full bg-background/30">
          {/* Scroll messages window */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto py-2">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20">No messages yet. Select a conversation or start a new one.</div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role as any}
                    content={msg.content}
                    timestamp={msg.timestamp}
                  />
                ))
              )}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Fixed Input Dock */}
          <div className="p-4 border-t border-border bg-card/65 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} disabled={isTyping || !activeChatId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

