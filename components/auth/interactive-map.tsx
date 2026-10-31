"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, X } from "lucide-react"
import type { Language } from "../language-context"

interface Location {
  name: string
  lat: number
  lng: number
}

interface InteractiveMapProps {
  onSelect: (location: Location) => void
  onClose: () => void
  language: Language
}

const translations = {
  en: {
    selectLocation: "Select Your Location",
    clickMap: "Click anywhere on the map to select a location",
    latitude: "Latitude",
    longitude: "Longitude",
    city: "City/Region",
    confirm: "Confirm Location",
    cancel: "Cancel",
    searching: "Searching for location...",
  },
  hi: {
    selectLocation: "अपना स्थान चुनें",
    clickMap: "स्थान चुनने के लिए मानचित्र पर कहीं भी क्लिक करें",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    city: "शहर/क्षेत्र",
    confirm: "स्थान की पुष्टि करें",
    cancel: "रद्द करें",
    searching: "स्थान खोज रहे हैं...",
  },
  ur: {
    selectLocation: "اپنا مقام منتخب کریں",
    clickMap: "مقام منتخب کرنے کے لیے نقشے پر کہیں بھی کلک کریں",
    latitude: "عرض البلد",
    longitude: "طول البلد",
    city: "شہر/علاقہ",
    confirm: "مقام کی تصدیق کریں",
    cancel: "منسوخ کریں",
    searching: "مقام تلاش کر رہے ہیں...",
  },
  mr: {
    selectLocation: "आपले स्थान निवडा",
    clickMap: "स्थान निवडण्यासाठी नकाशावर कोणत्याही जागी क्लिक करा",
    latitude: "अक्षांश",
    longitude: "रेखांश",
    city: "शहर/क्षेत्र",
    confirm: "स्थान पुष्टी करा",
    cancel: "रद्द करा",
    searching: "स्थान शोधत आहे...",
  },
}

const getCityFromCoordinates = (lat: number, lng: number): string => {
  // Mock city data based on coordinates
  const cities: { [key: string]: string } = {
    "18.5204,73.8567": "Pune, Maharashtra",
    "19.9975,73.7898": "Nashik, Maharashtra",
    "19.8762,75.3433": "Aurangabad, Maharashtra",
    "16.705,74.2433": "Kolhapur, Maharashtra",
    "19.0760,72.8777": "Mumbai, Maharashtra",
    "21.1458,79.0882": "Nagpur, Maharashtra",
  }

  // Find closest city or return generic location
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`
  if (cities[key]) return cities[key]

  // Return generic location based on region
  if (lat > 18 && lat < 21 && lng > 73 && lng < 76) {
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
  }
  return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
}

export default function InteractiveMap({ onSelect, onClose, language }: InteractiveMapProps) {
  const t = translations[language]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    drawMap()
  }, [selectedLocation])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#e8f5e9"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#c8e6c9"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw some mock regions
    ctx.fillStyle = "#a5d6a7"
    ctx.fillRect(50, 50, 150, 100)
    ctx.fillRect(250, 100, 120, 80)
    ctx.fillRect(100, 200, 180, 90)

    // Draw selected location marker
    if (selectedLocation) {
      const x = ((selectedLocation.lng - 73) / 3) * 100 + 50
      const y = ((21 - selectedLocation.lat) / 5) * 100 + 50

      // Draw marker circle
      ctx.fillStyle = "#ff6b6b"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw marker outline
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert pixel coordinates to lat/lng
    const lng = 73 + ((x - 50) / 100) * 3
    const lat = 21 - ((y - 50) / 100) * 5

    setIsSearching(true)
    setTimeout(() => {
      const city = getCityFromCoordinates(lat, lng)
      setSelectedLocation({
        name: city,
        lat: Number.parseFloat(lat.toFixed(4)),
        lng: Number.parseFloat(lng.toFixed(4)),
      })
      setIsSearching(false)
    }, 500)
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            {t.selectLocation}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">{t.clickMap}</p>
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              onClick={handleMapClick}
              className="w-full border-2 border-border rounded-lg cursor-crosshair bg-green-50 hover:bg-green-100 transition-colors"
            />
          </div>

          {isSearching && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground animate-pulse">{t.searching}</p>
            </div>
          )}

          {selectedLocation && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background rounded-lg">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">{t.city}</label>
                <p className="text-sm font-semibold text-foreground">{selectedLocation.name}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">{t.latitude}</label>
                <p className="text-sm font-semibold text-foreground">{selectedLocation.lat.toFixed(4)}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">
                  {t.longitude}
                </label>
                <p className="text-sm font-semibold text-foreground">{selectedLocation.lng.toFixed(4)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              {t.cancel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t.confirm}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
