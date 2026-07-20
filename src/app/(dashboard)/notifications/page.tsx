"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, CheckCircle2, AlertTriangle, AlertCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) {
          setNotifications(data.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleString(),
            read: n.read
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifs();
  }, [user]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
    if (user) {
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
    await supabase.from("notifications").delete().eq("id", id);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "mentions") return n.type === "mention";
    if (activeTab === "system") return n.type === "warning" || n.type === "error";
    return true; // "all"
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "mention":
        return <MessageSquare className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Notifications Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review updates, mention alerts, and system health telemetry notifications.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 bg-card border-border hover:bg-accent"
        >
          <Check className="h-4 w-4" />
          Mark all read
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted w-full sm:w-auto flex sm:inline-flex border border-border">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 sm:flex-initial">
            Unread
            {notifications.filter((n) => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-1.5 px-1 py-0 h-4 min-w-4 flex items-center justify-center text-[9px] font-bold">
                {notifications.filter((n) => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mentions" className="flex-1 sm:flex-initial">Mentions</TabsTrigger>
          <TabsTrigger value="system" className="flex-1 sm:flex-initial">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-card border rounded-xl border-dashed border-border space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground inline-block">
                <Bell className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">No notifications in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    n.read
                      ? "bg-card/45 border-border/60 opacity-75"
                      : "bg-card border-primary/25 shadow-sm shadow-primary/5 hover:border-primary/45"
                  }`}
                >
                  {/* Icon */}
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground leading-normal">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkRead(n.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(n.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
