"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function WelcomeHeader() {
  return (
    <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to Your Control Center</h2>
              <p className="text-white/80">Where tech growth meets life balance</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Welcome
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}