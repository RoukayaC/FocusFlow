"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Code,
  BookOpen,
  Sparkles,
  Target,
  Calendar,
  Coffee,
  Users,
  ArrowRight,
  Star,
  LogIn,
  User,
} from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return <WelcomeContent />
}

function WelcomeContent() {
  const { isAuthenticated, isLoading, quickLogin } = useAuth()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Frontend Developer & Mom of 2",
      content: "This workspace changed how I balance my career growth with family life. Finally, a tool that gets it!",
      avatar: "SC",
    },
    {
      name: "Maria Rodriguez",
      role: "Full-Stack Engineer & New Mom",
      content: "Perfect for tracking my learning goals while managing the beautiful chaos of motherhood.",
      avatar: "MR",
    },
    {
      name: "Aisha Patel",
      role: "DevOps Engineer & Mom of 3",
      content: "The self-care reminders are a game-changer. It's like having a supportive friend in my pocket.",
      avatar: "AP",
    },
  ]

  const features = [
    {
      icon: Code,
      title: "Tech Growth Tracking",
      description: "Monitor your coding projects, learning goals, and career milestones",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      icon: Heart,
      title: "Self-Care Rituals",
      description: "Gentle reminders for the care you deserve - because you can't pour from an empty cup",
      color: "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    },
    {
      icon: Calendar,
      title: "Life Management",
      description: "Balance family schedules, appointments, and personal goals in one beautiful space",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    },
    {
      icon: Target,
      title: "Goal Alignment",
      description: "Connect your daily actions with your bigger dreams - both personal and professional",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    },
    {
      icon: BookOpen,
      title: "Learning Journey",
      description: "Track courses, certifications, and skill development at your own pace",
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Built by women in tech, for women in tech - you're not alone in this journey",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
  ]

  // Show appropriate CTA buttons based on auth state
  const renderCTAButtons = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-36 h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      )
    }

    if (isAuthenticated) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
          >
            <Coffee className="mr-2 w-5 h-5" />
            Take the Tour
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={quickLogin}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <LogIn className="mr-2 w-5 h-5" />
          Start Your Journey
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
        >
          <Coffee className="mr-2 w-5 h-5" />
          Take the Tour
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Made by Women in Tech, for Women in Tech
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Your Digital
            <br />
            <span className="relative">
              Control Center
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-pink-200 to-purple-200 -skew-y-1 -z-10"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            A <strong className="text-purple-600 dark:text-purple-400">task management app</strong> tailored for women in
            tech who are managing
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              learning + life + motherhood
            </span>
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A digital sanctuary that blends tech growth with human needs. Because you deserve a workspace that
            understands your journey.
          </p>

          {renderCTAButtons()}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center p-6 border-pink-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-pink-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Women Empowered</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-purple-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Better Work-Life Balance</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-indigo-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-indigo-600 mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-400">Community Rating</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Thrive</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Designed with the unique challenges and strengths of women in tech in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <CardContent className="p-0">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Stories from Our
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Real women, real stories, real impact</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-0 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial
                        ? "bg-gradient-to-r from-pink-500 to-purple-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
          <CardContent className="p-0 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <br />
              Digital Life?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of women in tech who've found their perfect balance
            </p>
            {renderCTAButtons()}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}