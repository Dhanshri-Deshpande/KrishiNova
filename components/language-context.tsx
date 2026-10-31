"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi" | "ur" | "mr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  showLanguageModal: boolean
  setShowLanguageModal: (show: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("krishinova-language") as Language | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    } else {
      setShowLanguageModal(true)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("krishinova-language", lang)
    setShowLanguageModal(false)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, showLanguageModal, setShowLanguageModal }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
