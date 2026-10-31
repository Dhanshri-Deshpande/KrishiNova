"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CloudRain, Sun, Wind, Droplets } from "lucide-react"

interface WeatherPageProps {
  language: "en" | "hi" | "ur" | "mr"
  user: any
}

const translations = {
  en: {
    weather: "16-Day Weather Forecast",
    temperature: "Temperature",
    rainfall: "Rainfall",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
  },
  hi: {
    weather: "16-दिन का मौसम पूर्वानुमान",
    temperature: "तापमान",
    rainfall: "वर्षा",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
  },
  ur: {
    weather: "16 دن کی موسم کی پیش گوئی",
    temperature: "درجہ حرارت",
    rainfall: "بارش",
    humidity: "نمی",
    windSpeed: "ہوا کی رفتار",
  },
  mr: {
    weather: "16-दिवसीय हवामान पूर्वानुमान",
    temperature: "तापमान",
    rainfall: "पाऊस",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
  },
}

const mockWeatherData = Array.from({ length: 16 }, (_, i) => ({
  day: i + 1,
  date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
  temp: Math.floor(Math.random() * 15) + 20,
  rainfall: Math.floor(Math.random() * 50),
  humidity: Math.floor(Math.random() * 40) + 40,
  windSpeed: Math.floor(Math.random() * 20) + 5,
  condition: Math.random() > 0.6 ? "rainy" : "sunny",
}))

export default function WeatherPage({ language, user }: WeatherPageProps) {
  const t = translations[language] || translations.en
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(16).fill(false))

  useEffect(() => {
    mockWeatherData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }, index * 50)
    })
  }, [])

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed py-12 scroll-smooth bg-[url('/bg.jpg')]"
    >
      {/* Dark transparent overlay for contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">{t.weather}</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-green-400 mx-auto rounded-full" />
        </div>

        {/* Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockWeatherData.map((day, index) => (
            <div
              key={index}
              style={{
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index] ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                transition: "all 0.6s ease-out",
              }}
            >
              <Card className="p-6 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 group">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4 font-semibold">{day.date}</p>

                  {/* Icon */}
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {day.condition === "rainy" ? (
                      <CloudRain className="w-14 h-14 text-blue-500 animate-bounce" />
                    ) : (
                      <Sun className="w-14 h-14 text-yellow-400 animate-pulse" />
                    )}
                  </div>

                  {/* Data */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">{t.temperature}</p>
                      <p className="text-2xl font-bold text-red-600">{day.temp}°C</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.rainfall}</p>
                        <p className="font-bold text-blue-600">{day.rainfall}mm</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-cyan-50 rounded-lg p-3">
                      <Droplets className="w-4 h-4 text-cyan-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.humidity}</p>
                        <p className="font-bold text-cyan-600">{day.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-3">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.windSpeed}</p>
                        <p className="font-bold text-gray-600">{day.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
