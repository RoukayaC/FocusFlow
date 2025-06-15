"use client"

import { Sparkles } from "lucide-react"

export function UserGreeting() {
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
    "You've got this, mama! 👩‍💻",
    "Progress over perfection ✨",
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {greeting}, Beautiful {emoji}
        </h1>
        <Sparkles className="w-6 h-6 text-pink-500" />
      </div>
      <p className="text-gray-600 dark:text-gray-300">{today}</p>
      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium italic">{randomMessage}</p>
    </div>
  )
}
