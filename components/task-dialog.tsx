"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormPersistence } from "@/hooks/use-local-storage"
import type { Task, TaskCategory, TaskPriority } from "@/types/task"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  category?: TaskCategory
  onSave: (taskData: Omit<Task, "id" | "createdAt">) => void
}

interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  category: TaskCategory
  dueDate: string
}

export function TaskDialog({ open, onOpenChange, task, category, onSave }: TaskDialogProps) {
  const initialFormData: TaskFormData = {
    title: "",
    description: "",
    priority: "medium",
    category: category || "coding",
    dueDate: ""
  }

  // Use form persistence hook only for new tasks
  const { formData, updateField, clearForm } = useFormPersistence('task-dialog', initialFormData)
  
  // Local state for editing existing tasks
  const [editFormData, setEditFormData] = useState<TaskFormData>(initialFormData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Determine which form data to use
  const currentFormData = task ? editFormData : formData
  const updateCurrentField = task 
    ? (field: keyof TaskFormData, value: string | TaskPriority | TaskCategory) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
      }
    : updateField

  // Check if form has unsaved changes (only for new tasks)
  useEffect(() => {
    if (!task) {
      const hasChanges = formData.title || formData.description || formData.dueDate
      setHasUnsavedChanges(hasChanges)
    }
  }, [formData, task])

  // Handle form data when dialog opens/closes or when task changes
  useEffect(() => {
    if (open) {
      if (task) {
        // Editing existing task - populate with task data
        setEditFormData({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
        })
      } else if (!hasUnsavedChanges) {
        // Adding new task and no unsaved changes - reset to defaults
        clearForm()
        if (category) {
          updateField('category', category)
        }
      }
      // If hasUnsavedChanges is true, keep the persisted data
    }
  }, [open, task, category])

  const handleSave = () => {
    if (!currentFormData.title.trim()) return

    onSave({
      title: currentFormData.title.trim(),
      description: currentFormData.description.trim() || undefined,
      priority: currentFormData.priority,
      category: currentFormData.category,
      completed: task?.completed || false,
      dueDate: currentFormData.dueDate ? new Date(currentFormData.dueDate) : undefined,
    })

    // Clear form after successful save (only for new tasks)
    if (!task) {
      clearForm()
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (!task && hasUnsavedChanges) {
      // For new tasks with unsaved changes, ask user if they want to keep the draft
      const keepDraft = window.confirm("You have unsaved changes. Keep as draft?")
      if (!keepDraft) {
        clearForm()
      }
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Add New Task"}
            {!task && hasUnsavedChanges && (
              <span className="text-sm font-normal text-orange-600 ml-2">
                (Draft saved)
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {task ? "Make changes to your task here." : "Create a new task for your daily planner."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={currentFormData.title}
              onChange={(e) => updateCurrentField('title', e.target.value)}
              placeholder="Enter task title..."
              className={!currentFormData.title.trim() && currentFormData.title !== "" ? "border-red-300" : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentFormData.description}
              onChange={(e) => updateCurrentField('description', e.target.value)}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={currentFormData.category} 
                onValueChange={(value: TaskCategory) => updateCurrentField('category', value)}
                disabled={!!category && !task}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Tech Growth 💻</SelectItem>
                  <SelectItem value="life">Life Balance ⚖️</SelectItem>
                  <SelectItem value="self-care">Self-Care Rituals 🌸</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={currentFormData.priority} 
                onValueChange={(value: TaskPriority) => updateCurrentField('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={currentFormData.dueDate} 
              onChange={(e) => updateCurrentField('dueDate', e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {!task && hasUnsavedChanges && (
            <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
              💾 Your progress is automatically saved as you type
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {!task && hasUnsavedChanges && (
            <Button variant="ghost" onClick={clearForm} className="text-gray-500">
              Clear Draft
            </Button>
          )}
          <Button onClick={handleSave} disabled={!currentFormData.title.trim()}>
            {task ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}