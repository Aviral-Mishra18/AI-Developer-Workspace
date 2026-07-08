"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "@/lib/schemas";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { users } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

type CreateTaskValues = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTask: any) => void;
  defaultStatus?: string;
  projectId?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSuccess,
  defaultStatus = "todo",
  projectId: projectIdProp,
}: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [selectedProjId, setSelectedProjId] = useState<string>("");

  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      try {
        const { data: usersData } = await supabase
          .from("profiles")
          .select("id, name");
        setDbUsers(usersData || []);

        if (!projectIdProp) {
          const { data: projsData } = await supabase
            .from("projects")
            .select("id, name");
          setDbProjects(projsData || []);
          if (projsData && projsData.length > 0) {
            setSelectedProjId(projsData[0].id);
          }
        }
      } catch (err: any) {
        console.error("Failed to load form metadata:", err.message);
        setDbUsers(users);
      }
    };

    if (isOpen) {
      fetchUsersAndProjects();
    }
  }, [isOpen, projectIdProp]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: defaultStatus as any,
      priority: "medium",
      assigneeId: "",
      dueDate: "",
      tags: "",
    },
  });

  const onSubmit = async (data: CreateTaskValues) => {
    if (!user) {
      toast.error("Please login to create a task");
      return;
    }
    setIsLoading(true);

    try {
      let targetProjId = projectIdProp || selectedProjId;

      if (!targetProjId) {
        const { data: newProj, error: projErr } = await supabase
          .from("projects")
          .insert({
            name: "General Tasks",
            description: "Default project for miscellaneous tasks",
            status: "active"
          })
          .select()
          .single();

        if (projErr) throw projErr;
        targetProjId = newProj.id;
      }

      const { data: newTask, error } = await supabase
        .from("tasks")
        .insert({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assignee_id: data.assigneeId || null,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          project_id: targetProjId,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      onSuccess(newTask);
      toast.success("Task created successfully!");
      reset();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] border-border bg-card">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your Kanban column board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {!projectIdProp && dbProjects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="projectIdSelect">Project</Label>
              <Select defaultValue={selectedProjId} onValueChange={(val) => { if (val) setSelectedProjId(val); }}>
                <SelectTrigger className="border-border bg-card">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {dbProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g. Implement refresh tokens"
              className="border-border"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide clear criteria for completion"
              className="border-border min-h-[70px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(val: any) => setValue("priority", val)}
              >
                <SelectTrigger className="border-border bg-card">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Column</Label>
              <Select
                defaultValue={defaultStatus}
                onValueChange={(val: any) => setValue("status", val)}
              >
                <SelectTrigger className="border-border bg-card">
                  <SelectValue placeholder="Column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigneeId">Assignee</Label>
              <Select onValueChange={(val: string | null) => { if (val) setValue("assigneeId", val) }}>
                <SelectTrigger className="border-border bg-card">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {dbUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigneeId && (
                <p className="text-xs text-destructive">{errors.assigneeId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                className="border-border bg-card"
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-xs text-destructive">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. frontend, ui, bug"
              className="border-border"
              {...register("tags")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
