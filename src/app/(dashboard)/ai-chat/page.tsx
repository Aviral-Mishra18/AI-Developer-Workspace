"use client";

import { useState, useRef, useEffect } from "react";
import { chatConversations as initialConversations, chatMessages as initialMessages, ChatMessage as MessageType } from "@/lib/mock-data";
import { ChatSidebar } from "@/components/ai-chat/ChatSidebar";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { TypingIndicator } from "@/components/ai-chat/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AIChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState(initialConversations[0].id);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const selected = conversations.find((c) => c.id === id);
    if (selected) {
      // For prototype: reload same dummy thread or clear
      if (id === "c1") {
        setMessages(initialMessages);
      } else {
        setMessages([
          {
            id: "m-welcome",
            role: "assistant",
            content: `Hi there! I'm ready to discuss **${selected.title}**. Ask me any technical questions, request code reviews, or upload files for design help.`,
            timestamp: "Just now",
          },
        ]);
      }
    }
  };

  const handleNewChat = () => {
    const newId = `c-${Date.now()}`;
    const newConv = {
      id: newId,
      title: "New Conversation",
      lastMessage: "Conversation started...",
      time: "Just now",
      messageCount: 0,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveChatId(newId);
    setMessages([
      {
        id: "m-welcome",
        role: "assistant",
        content: "Hello! I am your AI coding assistant. Ask me anything about Next.js, React, Node.js, databases, or cloud infrastructure.",
        timestamp: "Just now",
      },
    ]);
  };

  const handleSend = (text: string, file: File | null) => {
    const userMsg: MessageType = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text + (file ? `\n\n*(Attached file: ${file.name})*` : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Update conversation listing lastMessage
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: text,
              time: "Just now",
            }
          : c
      )
    );

    // Simulate AI response stream
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: MessageType = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content: `I received your prompt: **"${text.slice(0, 50)}..."**

Here is a quick breakdown to help you proceed:
1. **Best Practice**: Ensure your environment variables are configured correctly.
2. **Implementation**: Use hooks like \`useMemo\` if you are processing complex lists.
3. **Safety**: Validate all user-supplied endpoints using schemas like **Zod**.

Let me know if you would like me to generate a fully styled component code template for this implementation!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 2500);
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
          activeId={activeChatId}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
        />

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col h-full bg-background/30">
          {/* Scroll messages window */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto py-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Fixed Input Dock */}
          <div className="p-4 border-t border-border bg-card/65 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
