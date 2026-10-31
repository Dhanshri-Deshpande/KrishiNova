"use client"

import { useEffect, useState } from "react"
import { LanguageProvider } from "@/components/language-context"
import AuthPages from "@/components/auth-pages"
import MainApp from "@/components/main-app"
import LanguageModal from "@/components/language-modal"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated")
    const savedUser = localStorage.getItem("user")

    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100" />
  }

  return (
    <LanguageProvider>
      <LanguageModal />
      {!isAuthenticated ? (
        <AuthPages onAuthSuccess={handleAuthSuccess} />
      ) : (
        <MainApp user={user} onLogout={handleLogout} />
      )}
    </LanguageProvider>
  )
}
