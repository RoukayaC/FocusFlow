import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Join FocusFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Start your journey to better work-life balance
          </p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-sm normal-case",
              card: "shadow-xl border-0 bg-white/80 backdrop-blur-sm",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsIconButton: "border-gray-200 hover:bg-gray-50",
              formFieldInput: "border-gray-200 focus:border-purple-500 focus:ring-purple-500",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}