"use client"

import { TaskArea } from "@/components/task-area"
import { TaskSummary } from "@/components/task-summary"
import { UserGreeting } from "@/components/user-greeting"
import { WelcomeHeader } from "@/components/welcome-header"
import { useTasks } from "@/hooks/use-tasks"

export default function DashboardPage() {
  const { isLoading, addTask, toggleTask, updateTask, deleteTask, getTasksByCategory, getTaskStats } = useTasks()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto p-4 space-y-6">
          <div className="animate-pulse">
            <div className="h-20 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = getTaskStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto p-4 space-y-6">
        <WelcomeHeader />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <UserGreeting />
          <TaskSummary {...stats} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TaskArea
            title="Tech Growth 💻"
            icon="Code"
            color="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-purple-400"
            category="coding"
            tasks={getTasksByCategory("coding")}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />

          <TaskArea
            title="Life Balance ⚖️"
            icon="CalendarClock"
            color="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 dark:from-pink-900/20 dark:to-rose-900/20 dark:text-pink-400"
            category="life"
            tasks={getTasksByCategory("life")}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />

          <TaskArea
            title="Self-Care Rituals 🌸"
            icon="Heart"
            color="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 dark:from-rose-900/20 dark:to-pink-900/20 dark:text-rose-400"
            category="self-care"
            tasks={getTasksByCategory("self-care")}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  )
}
