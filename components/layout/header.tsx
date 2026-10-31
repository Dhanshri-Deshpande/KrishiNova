"use client"

import { useState } from "react"
import { Menu, X, Leaf } from "lucide-react"

interface HeaderProps {
  language: "en" | "hi" | "ur" | "mr"
  currentPage: string
  onNavigate: (page: string) => void
  user: any
}

const translations = {
  en: {
    home: "Home",
    prediction: "Prediction",
    weather: "Weather",
    schemes: "Schemes",
    market: "Market",
    about: "About",
    contact: "Contact Us",
    profile: "My Profile",
  },
  hi: {
    home: "होम",
    prediction: "भविष्यवाणी",
    weather: "मौसम",
    schemes: "योजनाएं",
    market: "बाजार",
    about: "परिचय",
    contact: "हमसे संपर्क करें",
    profile: "मेरी प्रोफाइल",
  },
  ur: {
    home: "ہوم",
    prediction: "پیشن گوئی",
    weather: "موسم",
    schemes: "اسکیمیں",
    market: "مارکیٹ",
    about: "تعارف",
    contact: "ہمسے رابطہ کریں",
    profile: "میری پروفائل",
  },
  mr: {
    home: "होम",
    prediction: "भविष्यवाणी",
    weather: "हवामान",
    schemes: "योजना",
    market: "बाजार",
    about: "बद्दल",
    contact: "आमच्याशी संपर्क करा",
    profile: "माझी प्रोफाइल",
  },
}

export default function Header({ language, currentPage, onNavigate, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = translations[language] || translations.en

  const navItems = [
    { id: "home", label: t.home },
    { id: "prediction", label: t.prediction },
    { id: "weather", label: t.weather },
    { id: "schemes", label: t.schemes },
    { id: "market", label: t.market },
    { id: "about", label: t.about },
    { id: "contact", label: t.contact },
    { id: "profile", label: t.profile },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate("home")}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              KrishiNova
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out ${
                  currentPage === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-6 space-y-2 animate-fade-in-up">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
