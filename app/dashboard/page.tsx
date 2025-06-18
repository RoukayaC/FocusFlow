"use client"

import { TaskArea } from "@/components/task-area"
import { TaskSummary } from "@/components/task-summary"
import { useTasks } from "@/hooks/use-tasks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, AlertTriangle, Sparkles, Settings, Plus, TrendingUp, Clock, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UserButton, useUser } from '@clerk/nextjs'
import { DataManagementDialog } from "@/components/data-management"
import { UserPreferencesDialog } from "@/components/user-preferences"
import Link from "next/link"
import { useState, useEffect } from "react"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-20 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-20 w-80" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-16 w-full rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UserGreeting() {
  const { user } = useUser()
  
  // Get current time to determine greeting
  const currentHour = new Date().getHours()
  let greeting = "Good evening"
  let emoji = "🌙"

  if (currentHour < 12) {
    greeting = "Good morning"
    emoji = "☀️"
  } else if (currentHour < 18) {
    greeting = "Good afternoon"
    emoji = "🌤️"
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const motivationalMessages = [
    "You're doing amazing! 💪",
    "Every small step counts 🌟",
    "Balance is a journey, not a destination 🌸",
    "You've got this! 👩‍💻",
    "Progress over perfection ✨",
    "Your dedication inspires others 🌟",
    "Small wins lead to big victories 🎉",
    "You're building something beautiful 🌺",
  ]

  const [currentMessage, setCurrentMessage] = useState("")

  useEffect(() => {
    setCurrentMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  const displayName = user?.firstName || user?.fullName || "Beautiful"

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {greeting}, {displayName} {emoji}
        </h1>
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{today}</p>
      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium italic">
        {currentMessage}
      </p>
    </div>
  )
}

function DashboardHeader() {
  return (
    <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to Your Control Center</h2>
              <p className="text-white/80">Where tech growth meets life balance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserPreferencesDialog />
            <DataManagementDialog />
            
            <Link href="/">
              <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Back to Welcome
              </Button>
            </Link>
            
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-white/30",
                  userButtonPopoverCard: "bg-white shadow-xl",
                  userButtonPopoverFooter: "hidden"
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  const { addTask } = useTasks()
  
  const quickTasks = [
    {
      title: "Daily standup meeting",
      category: "coding" as const,
      icon: "💻",
      priority: "medium" as const
    },
    {
      title: "Review pull requests",
      category: "coding" as const,
      icon: "🔍",
      priority: "high" as const
    },
    {
      title: "Grocery shopping",
      category: "life" as const,
      icon: "🛒",
      priority: "medium" as const
    },
    {
      title: "30-minute walk",
      category: "self-care" as const,
      icon: "🚶‍♀️",
      priority: "high" as const
    },
    {
      title: "Meditation session",
      category: "self-care" as const,
      icon: "🧘‍♀️",
      priority: "low" as const
    },
  ]

  const handleQuickAdd = (task: typeof quickTasks[0]) => {
    addTask({
      title: task.title,
      category: task.category,
      priority: task.priority,
      completed: false,
    })
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Quick Add</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {quickTasks.slice(0, 3).map((task, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleQuickAdd(task)}
              className="justify-start text-left h-auto p-2 hover:bg-purple-50"
            >
              <span className="mr-2">{task.icon}</span>
              <span className="text-sm">{task.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProductivityInsights() {
  const { tasks } = useTasks()
  
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const todayTasks = tasks.filter(task => 
    task.createdAt >= todayStart
  )
  
  const completedToday = todayTasks.filter(task => task.completed).length
  const totalToday = todayTasks.length
  
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  
  const weekTasks = tasks.filter(task => 
    task.createdAt >= weekStart
  )
  
  const completedThisWeek = weekTasks.filter(task => task.completed).length

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-emerald-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Today's Progress</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tasks Today</span>
            <span className="font-semibold text-emerald-600">
              {completedToday}/{totalToday}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500">
            {completedThisWeek} tasks completed this week
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingDeadlines() {
  const { tasks } = useTasks()
  
  const upcomingTasks = tasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3)

  if (upcomingTasks.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Upcoming</h3>
          </div>
          <p className="text-sm text-gray-500">No upcoming deadlines</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Upcoming</h3>
        </div>
        
        <div className="space-y-2">
          {upcomingTasks.map((task) => {
            const isOverdue = new Date() > new Date(task.dueDate!)
            const daysUntil = Math.ceil((new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={task.id} className="flex justify-between items-center text-sm">
                <span className={`truncate ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                  {task.title}
                </span>
                <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}>
                  {isOverdue ? 'Overdue' : daysUntil === 0 ? 'Today' : `${daysUntil}d`}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { 
    isLoading, 
    error, 
    addTask, 
    toggleTask, 
    updateTask, 
    deleteTask, 
    getTasksByCategory, 
    getTaskStats,
    clearError 
  } = useTasks()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto p-4">
          <Alert className="max-w-md mx-auto mt-20 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                clearError()
                window.location.reload()
              }}
              className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Alert>
        </div>
      </div>
    )
  }

  const stats = getTaskStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* User Greeting and Summary */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <UserGreeting />
          <TaskSummary {...stats} />
        </div>

        {/* Quick Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActions />
          <ProductivityInsights />
          <UpcomingDeadlines />
        </div>

        {/* Main Task Areas */}
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