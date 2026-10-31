"use client"

import { useLanguage, type Language } from "./language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "hi" as Language, name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "ur" as Language, name: "Urdu", flag: "🇵🇰", nativeName: "اردو" },
  { code: "mr" as Language, name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
]

const questionTranslations = {
  en: "Select your preferred language",
  hi: "अपनी पसंदीदा भाषा चुनें",
  ur: "اپنی پسندیدہ زبان منتخب کریں",
  mr: "आपली पसंदीची भाषा निवडा",
}

export default function LanguageModal() {
  const { showLanguageModal, setLanguage, language } = useLanguage()

  if (!showLanguageModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-8 bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Krishinova</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg font-semibold text-foreground">Select your preferred language</p>
            <p className="text-sm text-muted-foreground">अपनी पसंदीदा भाषा चुनें</p>
            <p className="text-sm text-muted-foreground">اپنی پسندیدہ زبان منتخب کریں</p>
            <p className="text-sm text-muted-foreground">आपली पसंदीची भाषा निवडा</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="h-auto py-6 flex flex-col items-center gap-2 bg-gradient-to-br from-green-50 to-amber-50 hover:from-green-100 hover:to-amber-100 text-foreground border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105"
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="font-semibold text-sm">{lang.name}</span>
              <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
            </Button>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">You can change this anytime in Settings</p>
      </Card>
    </div>
  )
}
