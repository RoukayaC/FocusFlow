"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, User, Bell, Palette, Save, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { usePreferences } from "@/features/preferences/hooks/use-preferences"
import { useTheme } from "next-themes"

export function UserPreferencesDialog() {
  const { user } = useUser()
  const { setTheme } = useTheme()
  const { 
    preferences, 
    isLoading, 
    updatePreferences, 
    error 
  } = usePreferences()
  
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userName, setUserName] = useState("")

  // Initialize user name when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && user) {
      setUserName(user.fullName || user.firstName || "")
    }
  }

  const updatePreference = async <T extends keyof typeof preferences>(
    key: T, 
    value: any
  ) => {
    try {
      await updatePreferences({ [key]: value })
      
      // Apply theme change immediately
      if (key === 'theme') {
        setTheme(value)
      }
    } catch (error) {
      console.error('Failed to update preference:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // Here you could update the user's display name via Clerk if needed
      // For now, we'll just close the dialog
      setOpen(false)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Preferences
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Preferences
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
              <CardDescription>Customize your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                />
                <p className="text-xs text-muted-foreground">
                  This is how you'll be greeted in the app
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences?.theme || 'light'}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    updatePreference("theme", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Task Preferences</CardTitle>
              <CardDescription>Set your default task settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCategory">Default Category</Label>
                <Select
                  value={preferences?.defaultCategory || 'coding'}
                  onValueChange={(value: "coding" | "life" | "self-care") =>
                    updatePreference("defaultCategory", value)
                  }
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
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">
                    Enable Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about overdue tasks and reminders
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences?.notifications ?? true}
                  onCheckedChange={(checked) => updatePreference("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="motivationalMessages" className="text-base">
                    Motivational Messages
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show encouraging messages throughout the day
                  </p>
                </div>
                <Switch
                  id="motivationalMessages"
                  checked={preferences?.motivationalMessages ?? true}
                  onCheckedChange={(checked) =>
                    updatePreference("motivationalMessages", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function EnhancedUserGreeting() {
  const { user } = useUser()
  const { preferences } = usePreferences()

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
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  const displayName = user?.firstName || user?.fullName || "Beautiful"

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {greeting}, {displayName} {emoji}
        </h1>
        <UserPreferencesDialog />
      </div>
      <p className="text-gray-600 dark:text-gray-300">{today}</p>
      {preferences?.motivationalMessages && (
        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium italic">
          {randomMessage}
        </p>
      )}
    </div>
  )
}