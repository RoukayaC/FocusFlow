"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Edit, Trash2, Calendar, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TaskDialog } from "@/components/task-dialog"
import type { Task } from "@/types/task"

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggle, onUpdate, onDelete }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }

  const handleEdit = (taskData: Omit<Task, "id" | "createdAt">) => {
    onUpdate(task.id, taskData)
    setShowEditDialog(false)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (taskDate.getTime() === today.getTime()) {
      return "Today"
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow"
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    }
  }

  const isOverdue = task.dueDate && !task.completed && new Date() > new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate() + 1)

  return (
    <>
      <div
        className={`group flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors ${
          isOverdue ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10" : ""
        }`}
      >
        <button 
          className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform" 
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow">
              <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </p>
              {task.description && (
                <p
                  className={`text-sm mt-1 ${task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                >
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className={`text-xs px-2 py-1 rounded-full capitalize ${priorityColors[task.priority]}`}>
                  {task.priority}
                </div>

                {task.dueDate && (
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      isOverdue
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        : task.completed
                        ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  aria-label="Task options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <TaskDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
        task={task} 
        onSave={handleEdit} 
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(task.id)
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}