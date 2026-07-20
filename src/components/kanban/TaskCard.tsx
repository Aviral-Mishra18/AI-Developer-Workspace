import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskPriority } from "@/types/kanban";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const getPriorityColor = (prio: TaskPriority) => {
    switch (prio) {
      case "critical":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400";
      case "low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400";
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card
            className={cn(
              "border border-border bg-card shadow-sm hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing",
              snapshot.isDragging ? "shadow-lg border-primary" : ""
            )}
          >
            <CardContent className="p-3 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <Badge className={cn("text-[10px] uppercase font-semibold border-0", getPriorityColor(task.priority))} variant="outline">
                  {task.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit Task</span>
                </Button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                  {task.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Tags */}
              {Array.isArray(task.tags) && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} className="text-[10px] py-0 px-1 border-border/80 text-muted-foreground bg-slate-50 dark:bg-slate-900" variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{task.dueDate}</span>
                </div>
                <Avatar className="h-5 w-5 border border-border">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
