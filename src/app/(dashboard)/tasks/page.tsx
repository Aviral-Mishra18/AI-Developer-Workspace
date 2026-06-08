"use client";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function KanbanBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Kanban Task Board
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop tasks between stages, adjust priorities, and assign developers.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
