export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: "coding" | "life" | "self-care"
  createdAt: Date
  dueDate?: Date
}

export type TaskCategory = Task["category"]
export type TaskPriority = Task["priority"]
