"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserPreferences } from "@/hooks/use-local-storage"
import { Settings, User, Bell, Palette, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserPreferencesDialog() {
  const { preferences, updatePreference, isLoading } = useUserPreferences()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Preferences saved!",
      description: "Your settings have been updated successfully.",
    })
    setOpen(false)
  }

  if (isLoading) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Customize your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={preferences.name}
                  onChange={(e) => updatePreference('name', e.target.value)}
                  placeholder="Enter your name..."
                />
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
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'system') => updatePreference('theme', value)}
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
              <CardDescription>
                Set your default task settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCategory">Default Category</Label>
                <Select 
                  value={preferences.defaultCategory} 
                  onValueChange={(value: 'coding' | 'life' | 'self-care') => updatePreference('defaultCategory', value)}
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
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
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
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => updatePreference('notifications', checked)}
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
                  checked={preferences.motivationalMessages}
                  onCheckedChange={(checked) => updatePreference('motivationalMessages', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Enhanced UserGreeting component that uses stored preferences
export function EnhancedUserGreeting() {
  const { preferences, isLoading } = useUserPreferences()
  
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
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  const displayName = preferences.name || "Beautiful"

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {greeting}, {displayName} {emoji}
        </h1>
        <UserPreferencesDialog />
      </div>
      <p className="text-gray-600 dark:text-gray-300">{today}</p>
      {preferences.motivationalMessages && (
        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium italic">
          {randomMessage}
        </p>
      )}
    </div>
  )
}