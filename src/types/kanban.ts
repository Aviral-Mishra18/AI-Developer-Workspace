export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: any;
  assigneeId?: string;
  dueDate?: string | null;
  tags?: string[];
  projectId?: string;
}
