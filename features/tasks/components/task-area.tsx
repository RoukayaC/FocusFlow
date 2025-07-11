"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import type { TaskCategory } from "@/types/task";
import { useGetTasks } from "../api/use-get-tasks";

interface TaskAreaProps {
  title: string;
  icon: keyof typeof Icons;
  color: string;
  category: TaskCategory;
}

export function TaskArea({ title, icon, color, category }: TaskAreaProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const Icon = Icons[icon] as LucideIcon;

  const { data: tasks = [] } = useGetTasks();

  const categorizedTasks = useMemo(() => {
    return tasks.filter((task) => task.category === category);
  }, [tasks, category]);

  const stats = useMemo(() => {
    const total = categorizedTasks.length;
    const completed = categorizedTasks.filter((task) => task.completed).length;
    return { total, completed };
  }, [categorizedTasks]);

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
          {stats.total > 0 && (
            <div className="text-sm text-muted-foreground">
              {stats.completed}/{stats.total}
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
                {categorizedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
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
      />
    </>
  );
}
