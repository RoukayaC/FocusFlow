"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, ListTodo, Heart, AlertTriangle } from "lucide-react";
import { useGetStats } from "../api/use-get-stats";
import { useMemo } from "react";

export function TaskSummary() {
  const { data: stats } = useGetStats();
  const completionRate = useMemo(
    () =>
      stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    [stats]
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
      <CardContent className="p-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 p-2 rounded-lg">
            <CheckCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="font-semibold text-emerald-600">{stats.completed} tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-2 rounded-lg">
            <ListTodo className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="font-semibold text-amber-600">{stats.pending} tasks</p>
          </div>
        </div>

        {stats.overdue > 0 && (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overdue
              </p>
              <p className="font-semibold text-red-600">{stats.overdue} tasks</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-2 rounded-lg">
            <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            <p className="font-semibold text-purple-600">{completionRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
