"use client"

import { useState } from "react"
import { useLanguage } from "./language-context"
import Header from "./layout/header"
import HomePage from "./pages/home-page"
import PredictionPage from "./pages/prediction-page"
import WeatherPage from "./pages/weather-page"
import ProfilePage from "./pages/profile-page"
import AboutPage from "./pages/about-page"
import ContactPage from "./pages/contact-page"
import SchemesPage from "./pages/schemes-page"
import MarketPage from "./pages/market-page"

interface MainAppProps {
  user: any
  onLogout: () => void
}

export default function MainApp({ user, onLogout }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState("home")
  const { language } = useLanguage()

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage language={language} user={user} />
      case "prediction":
        return <PredictionPage language={language} user={user} />
      case "weather":
        return <WeatherPage language={language} user={user} />
      case "schemes":
        return <SchemesPage language={language} />
      case "market":
        return <MarketPage language={language} user={user} />
      case "profile":
        return <ProfilePage language={language} user={user} onLogout={onLogout} />
      case "about":
        return <AboutPage language={language} />
      case "contact":
        return <ContactPage language={language} />
      default:
        return <HomePage language={language} user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} currentPage={currentPage} onNavigate={setCurrentPage} user={user} />
      <main className="pt-20">{renderPage()}</main>
    </div>
  )
}
