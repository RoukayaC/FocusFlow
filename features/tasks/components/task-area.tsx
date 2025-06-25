"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import type { Task, TaskCategory } from "@/types/task";

interface TaskAreaProps {
  title: string;
  icon: keyof typeof Icons;
  color: string;
  category: TaskCategory;
  tasks: Task[];
  onAddTask: (taskData: Omit<Task, "id" | "createdAt">) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskArea({
  title,
  icon,
  color,
  category,
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}: TaskAreaProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const Icon = Icons[icon] as LucideIcon;

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {completedCount}/{totalCount}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                className="w-full"
              >
                <Icons.Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                className="w-full mt-4"
              >
                <Icons.Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        category={category}
        onSave={onAddTask}
      />
    </>
  );
}
