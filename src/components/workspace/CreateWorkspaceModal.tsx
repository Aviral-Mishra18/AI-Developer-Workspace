"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "@/lib/schemas";
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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newWorkspace: any) => void;
}

export function CreateWorkspaceModal({ isOpen, onClose, onSuccess }: CreateWorkspaceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "private",
    },
  });

  const onSubmit = async (data: CreateWorkspaceValues) => {
    if (!user) {
      toast.error("Please login to create a workspace");
      return;
    }
    setIsLoading(true);

    try {
      const { data: newWs, error } = await supabase
        .from("workspaces")
        .insert({
          name: data.name,
          description: data.description,
          visibility: data.visibility,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      onSuccess({
        id: newWs.id,
        name: newWs.name,
        description: newWs.description,
        visibility: newWs.visibility,
        memberCount: 1,
        projectCount: 0,
        storage: "0 GB",
        lastActivity: "Just now",
        createdAt: newWs.created_at,
      });

      toast.success("Workspace created successfully!");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Workspaces contain your projects, members, and AI configs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              placeholder="e.g. Acme Backend Development"
              className="border-border"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a brief description of the workspace's purpose"
              className="border-border min-h-[80px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              defaultValue="private"
              onValueChange={(val) => setValue("visibility", val as "public" | "private")}
            >
              <SelectTrigger className="border-border bg-card">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Invite only)</SelectItem>
                <SelectItem value="public">Public (Visible to org)</SelectItem>
              </SelectContent>
            </Select>
            {errors.visibility && (
              <p className="text-xs text-destructive">{errors.visibility.message}</p>
            )}
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
                "Create Workspace"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
