"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Task, TaskStatus, TaskPriority } from "@/types/kanban";
import { supabase } from "@/lib/supabase";

type EditTaskValues = z.infer<typeof createTaskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
}: EditTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name");
        if (error) throw error;
        setDbUsers(data || []);
      } catch (err: any) {
        console.error("Failed to load profiles for assignee list:", err.message);
        setDbUsers([]);
      }
    };
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditTaskValues>({
    resolver: zodResolver(createTaskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee?.id || "",
        dueDate: task.dueDate || "",
        tags: task.tags ? task.tags.join(", ") : "",
      });
    }
  }, [task, reset]);

  if (!task) return null;

  const onSubmit = async (data: EditTaskValues) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assignee_id: data.assigneeId || null,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        })
        .eq("id", task.id);

      if (error) throw error;

      onUpdate({
        ...task,
        title: data.title,
        description: data.description,
        status: (data.status as TaskStatus) || task.status,
        priority: (data.priority as TaskPriority) || task.priority,
        dueDate: data.dueDate,
        tags: [],
      });
      toast.success("Task updated successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) throw error;

      onDelete(task.id);
      toast.success("Task deleted successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] border-border bg-card">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Modify details of the task item.</DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-md"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title</Label>
            <Input
              id="edit-title"
              className="border-border"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              className="border-border min-h-[70px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                defaultValue={task.priority}
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
              <Label htmlFor="edit-status">Column</Label>
              <Select
                defaultValue={task.status}
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
              <Label htmlFor="edit-assigneeId">Assignee</Label>
              <Select
                defaultValue={task.assignee?.id || undefined}
                onValueChange={(val: string | null) => { if (val) setValue("assigneeId", val) }}
              >
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
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
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
            <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
            <Input
              id="edit-tags"
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
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
