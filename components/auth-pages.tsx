"use client"

import { useState } from "react"
import { useLanguage } from "./language-context"
import SignUpForm from "./auth/sign-up-form"
import LoginForm from "./auth/login-form"

interface AuthPagesProps {
  onAuthSuccess: (userData: any) => void
}

export default function AuthPages({ onAuthSuccess }: AuthPagesProps) {
  const [isSignUp, setIsSignUp] = useState(true)
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {isSignUp ? (
        <SignUpForm language={language} onAuthSuccess={onAuthSuccess} onToggleMode={() => setIsSignUp(false)} />
      ) : (
        <LoginForm language={language} onAuthSuccess={onAuthSuccess} onToggleMode={() => setIsSignUp(true)} />
      )}
    </div>
  )
}
