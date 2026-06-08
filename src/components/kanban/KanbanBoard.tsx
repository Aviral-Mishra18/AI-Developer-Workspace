"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { tasks as initialTasks, Task, TaskStatus } from "@/lib/mock-data";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  projectId?: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeModalCol, setActiveModalCol] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Avoid hydration mismatch by waiting until mounted (next.js client requirement)
  useEffect(() => {
    setMounted(true);
    // Filter tasks if projectId is provided
    setTasks(projectId ? initialTasks.filter((t) => t.projectId === projectId) : initialTasks);
  }, [projectId]);

  if (!mounted) return null;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex((t) => t.id === draggableId);

    if (taskIndex !== -1) {
      // Update task status
      updatedTasks[taskIndex].status = destination.droppableId as TaskStatus;

      // Reorder items in state
      const [removed] = updatedTasks.splice(taskIndex, 1);
      
      // Find where to insert in destination column
      const colTasks = updatedTasks.filter((t) => t.status === destination.droppableId);
      const otherColTasks = updatedTasks.filter((t) => t.status !== destination.droppableId);
      
      colTasks.splice(destination.index, 0, removed);
      setTasks([...colTasks, ...otherColTasks]);
    }
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className="flex flex-col bg-slate-50/50 dark:bg-slate-900/40 border border-border rounded-xl p-3 min-w-[250px] max-h-[750px] overflow-hidden"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
                    <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-muted-foreground px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveModalCol(column.id)}
                    className="h-6 w-6 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Task</span>
                  </Button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto min-h-[150px] rounded-lg transition-colors p-1 ${
                        snapshot.isDraggingOver
                          ? "bg-slate-100/60 dark:bg-slate-900/60"
                          : ""
                      }`}
                    >
                      {columnTasks.map((task, idx) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={idx}
                          onEdit={setEditingTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal Actions */}
      <CreateTaskModal
        isOpen={activeModalCol !== null}
        onClose={() => setActiveModalCol(null)}
        defaultStatus={activeModalCol || "todo"}
        onSuccess={handleCreateTask}
      />

      <EditTaskModal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
