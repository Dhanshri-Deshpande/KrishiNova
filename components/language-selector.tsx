"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  onSelectLanguage: (lang: "en" | "ur") => void
}

export default function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center animate-fade-in-up relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Globe className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Krishinova</h1>
          <p className="text-muted-foreground text-lg">Smart Farming, AI-Powered</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Select Language</h2>
          <p className="text-muted-foreground mb-8 text-sm">Choose your preferred language to get started</p>

          <div className="space-y-4">
            <Button
              onClick={() => onSelectLanguage("en")}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <span className="mr-2">🇬🇧</span> English
            </Button>
            <Button
              onClick={() => onSelectLanguage("ur")}
              className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <span className="mr-2">🇵🇰</span> اردو (Urdu)
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">You can change this anytime in Settings</p>
        </div>
      </div>
    </div>
  )
}
