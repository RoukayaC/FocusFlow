// app/dashboard/page.tsx
"use client";

import { TaskArea } from "@/features/tasks/components/task-area";
import { TaskSummary } from "@/features/tasks/components/task-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  Target,
  Crown,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton, useUser } from "@clerk/nextjs";
import { UserPreferencesDialog } from "@/features/preferences/components/user-preferences";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { useGetProducts } from "@/features/polar/api/use-get-products";
import type { CreateTaskInput, UpdateTaskInput } from "@/types/task";
import { client } from "@/lib/hono";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetStats } from "@/features/tasks/api/use-get-stats";

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
  );
}

function UserGreeting() {
  const { user } = useUser();
  const { preferences } = usePreferences();

  // Get current time to determine greeting
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "🌙";

  if (currentHour < 12) {
    greeting = "Good morning";
    emoji = "☀️";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
    emoji = "🌤️";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const motivationalMessages = [
    "You're doing amazing! 💪",
    "Every small step counts 🌟",
    "Balance is a journey, not a destination 🌸",
    "You've got this! 👩‍💻",
    "Progress over perfection ✨",
    "Your dedication inspires others 🌟",
    "Small wins lead to big victories 🎉",
    "You're building something beautiful 🌺",
  ];

  const displayName = user?.firstName || user?.fullName || "Beautiful";
  const showMotivational = preferences?.motivationalMessages ?? true;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {greeting}, {displayName} {emoji}
        </h1>
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{today}</p>
      {showMotivational && (
        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium italic">
          {
            motivationalMessages[
              Math.floor(Math.random() * motivationalMessages.length)
            ]
          }
        </p>
      )}
    </div>
  );
}

function UpgradeCard() {
  const { data: products, isLoading } = useGetProducts();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const createCheckout = async () => {
    if (!products || products.length === 0) return;

    setIsCreatingCheckout(true);
    try {
      const response = await client.api.polar.checkout.$post({
        json: {
          products: [products[1]?.id || products[0]?.id],
        },
      });

      if (response.ok) {
        const checkoutUrl = await response.json();
        window.location.href = checkoutUrl;
      } else {
        console.error("Failed to create checkout");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-amber-800">
                Unlock Premium Features
              </h3>
            </div>

            <p className="text-amber-700 text-sm mb-4 leading-relaxed">
              Get unlimited tasks, advanced analytics, priority support, and
              exclusive features designed for ambitious women in tech.
            </p>

            <div className="flex items-center gap-4 text-xs text-amber-600 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>Unlimited Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>Priority Support</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={createCheckout}
          disabled={isCreatingCheckout || !products || products.length === 0}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
        >
          {isCreatingCheckout ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function DashboardHeader() {
  const { data: products, isLoading } = useGetProducts();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const handleUpgrade = async () => {
    if (!products || products.length === 0) return;

    setIsCreatingCheckout(true);
    try {
      const response = await client.api.polar.checkout.$post({
        json: {
          products: [products[1]?.id || products[0]?.id],
        },
      });

      if (response.ok) {
        const checkoutUrl = await response.json();
        window.location.href = checkoutUrl;
      } else {
        console.error("Failed to create checkout");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome to Your Control Center
              </h2>
              <p className="text-white/80">
                Where tech growth meets life balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={
                isCreatingCheckout ||
                isLoading ||
                !products ||
                products.length === 0
              }
              size="sm"
              className="bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 border-0 text-white"
            >
              {isCreatingCheckout ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </>
              )}
            </Button>

            <UserPreferencesDialog />

            <Link href="/">
              <Button
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
              >
                Back to Welcome
              </Button>
            </Link>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-white/30",
                  userButtonPopoverCard: "bg-white shadow-xl",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const { data: tasks, mutateAsync: createTask, error } = useCreateTask();
  const { preferences } = usePreferences();

  const quickTasks = [
    {
      title: "Daily standup meeting",
      category: "coding" as const,
      icon: "💻",
      priority: "medium" as const,
    },
    {
      title: "Review pull requests",
      category: "coding" as const,
      icon: "🔍",
      priority: "high" as const,
    },
    {
      title: "Grocery shopping",
      category: "life" as const,
      icon: "🛒",
      priority: "medium" as const,
    },
    {
      title: "30-minute walk",
      category: "self-care" as const,
      icon: "🚶‍♀️",
      priority: "high" as const,
    },
    {
      title: "Meditation session",
      category: "self-care" as const,
      icon: "🧘‍♀️",
      priority: "low" as const,
    },
  ];

  const handleQuickAdd = async (task: (typeof quickTasks)[0]) => {
    try {
      const taskData: CreateTaskInput = {
        title: task.title,
        category: task.category,
        priority: task.priority,
        description: "",
        dueDate: null,
      };
      await createTask(taskData);
    } catch (error) {
      console.error("Failed to create quick task:", error);
    }
  };

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
        {error && (
          <p className="text-xs text-red-500 mt-2">Failed to add task</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProductivityInsights() {
  const { data: stats } = useGetStats();

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
              {stats.completed}/{stats.total}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="text-xs text-gray-500">
            Great progress today! Keep it up! 🌟
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingDeadlines() {
  const { data: tasks } = useGetTasks();

  // Get tasks with upcoming deadlines
  const upcomingTasks = useMemo(
    () =>
      tasks
        ?.filter((task) => task.dueDate && !task.completed)
        .sort(
          (a, b) =>
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
        )
        .slice(0, 3) ?? [],
    [tasks]
  );

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
    );
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
            const isOverdue = new Date() > new Date(task.dueDate!);
            const daysUntil = Math.ceil(
              (new Date(task.dueDate!).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={task.id}
                className="flex justify-between items-center text-sm"
              >
                <span
                  className={`truncate ${
                    isOverdue ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`text-xs ${
                    isOverdue ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {isOverdue
                    ? "Overdue"
                    : daysUntil === 0
                    ? "Today"
                    : `${daysUntil}d`}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const {
    data: tasks,
    isLoading: tasksLoading,
    error,
    refetch: refetchTasks,
  } = useGetTasks();
  const {
    preferences,
    isLoading: preferencesLoading,
    error: preferencesError,
  } = usePreferences();

  // Sync user when component mounts
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      client.api.users.sync
        .$post({
          json: {
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName || user.firstName || "User",
          },
        })
        .catch(console.error);
    }
  }, [user]);

  if (tasksLoading || preferencesLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto p-4">
          <Alert className="max-w-md mx-auto mt-20 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error.message || "Failed to load tasks. Please try again."}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchTasks();
              }}
              className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* User Greeting and Summary */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <UserGreeting />
          <TaskSummary />
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
          />

          <TaskArea
            title="Life Balance ⚖️"
            icon="CalendarClock"
            color="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 dark:from-pink-900/20 dark:to-rose-900/20 dark:text-pink-400"
            category="life"
          />

          <TaskArea
            title="Self-Care Rituals 🌸"
            icon="Heart"
            color="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 dark:from-rose-900/20 dark:to-pink-900/20 dark:text-rose-400"
            category="self-care"
          />
        </div>
      </div>
    </div>
  );
}
