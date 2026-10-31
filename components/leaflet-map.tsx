"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, MapPin } from "lucide-react"
import type { Language } from "./language-context"

interface LeafletMapProps {
  language: Language
  onSelect: (location: { lat: number; lng: number; name: string }) => void
  onClose: () => void
}

const translations = {
  en: {
    selectLocation: "Click on map to select location",
    latitude: "Latitude",
    longitude: "Longitude",
    place: "Place",
    confirm: "Confirm Location",
    cancel: "Cancel",
  },
  hi: {
    selectLocation: "स्थान चुनने के लिए नक्शे पर क्लिक करें",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    place: "स्थान",
    confirm: "स्थान की पुष्टि करें",
    cancel: "रद्द करें",
  },
  ur: {
    selectLocation: "مقام منتخب کرنے کے لیے نقشے پر کلک کریں",
    latitude: "عرض البلد",
    longitude: "طول البلد",
    place: "مقام",
    confirm: "مقام کی تصدیق کریں",
    cancel: "منسوخ کریں",
  },
  mr: {
    selectLocation: "स्थान निवडण्यासाठी नकाशावर क्लिक करा",
    latitude: "अक्षांश",
    longitude: "रेखांश",
    place: "स्थान",
    confirm: "स्थान पुष्टी करा",
    cancel: "रद्द करा",
  },
}

const maharashtraCities = [
  { name: "Pune", lat: 18.5204, lng: 73.8567, district: "Pune" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, district: "Mumbai" },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, district: "Nagpur" },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433, district: "Aurangabad" },
  { name: "Nashik", lat: 19.9975, lng: 73.791, district: "Nashik" },
  { name: "Kolhapur", lat: 16.705, lng: 73.7421, district: "Kolhapur" },
  { name: "Solapur", lat: 17.6599, lng: 75.9064, district: "Solapur" },
  { name: "Sangli", lat: 16.8633, lng: 74.5701, district: "Sangli" },
  { name: "Satara", lat: 17.6726, lng: 73.9256, district: "Satara" },
  { name: "Ahmednagar", lat: 19.0976, lng: 74.7421, district: "Ahmednagar" },
  { name: "Jalgaon", lat: 21.1458, lng: 75.5625, district: "Jalgaon" },
  { name: "Latur", lat: 18.4088, lng: 76.2305, district: "Latur" },
  { name: "Parbhani", lat: 19.2683, lng: 76.7597, district: "Parbhani" },
  { name: "Nanded", lat: 19.1383, lng: 77.3012, district: "Nanded" },
  { name: "Amravati", lat: 20.8531, lng: 77.7532, district: "Amravati" },
  { name: "Akola", lat: 20.7136, lng: 77.0064, district: "Akola" },
  { name: "Yavatmal", lat: 20.4183, lng: 78.1192, district: "Yavatmal" },
  { name: "Wardha", lat: 20.7465, lng: 78.6042, district: "Wardha" },
  { name: "Chandrapur", lat: 19.2783, lng: 79.2941, district: "Chandrapur" },
  { name: "Gondia", lat: 21.4515, lng: 80.1992, district: "Gondia" },
]

export default function LeafletMap({ language, onSelect, onClose }: LeafletMapProps) {
  const t = translations[language]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#e8f5e9")
    gradient.addColorStop(1, "#c8e6c9")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#a5d6a7"
    ctx.lineWidth = 0.5
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw Maharashtra boundary (simplified)
    ctx.strokeStyle = "#1b5e20"
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Draw cities
    maharashtraCities.forEach((city) => {
      const x = ((city.lng - 72) / 8) * (canvas.width - 40) + 20
      const y = ((22 - city.lat) / 6) * (canvas.height - 40) + 20

      if (x > 20 && x < canvas.width - 20 && y > 20 && y < canvas.height - 20) {
        // Draw city circle
        ctx.fillStyle = selectedLocation?.name === city.name ? "#ff6b6b" : "#2e7d32"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()

        // Draw city name
        ctx.fillStyle = "#1b5e20"
        ctx.font = "11px Arial"
        ctx.textAlign = "center"
        ctx.fillText(city.name, x, y - 12)
      }
    })

    // Draw selected location highlight
    if (selectedLocation) {
      const x = ((selectedLocation.lng - 72) / 8) * (canvas.width - 40) + 20
      const y = ((22 - selectedLocation.lat) / 6) * (canvas.height - 40) + 20

      ctx.fillStyle = "rgba(255, 107, 107, 0.15)"
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "#ff6b6b"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [selectedLocation])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert canvas coordinates to lat/lng
    const lng = 72 + ((x - 20) / (canvas.width - 40)) * 8
    const lat = 22 - ((y - 20) / (canvas.height - 40)) * 6

    // Find nearest city
    let nearestCity = maharashtraCities[0]
    let minDistance = Number.POSITIVE_INFINITY

    maharashtraCities.forEach((city) => {
      const distance = Math.sqrt(Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2))
      if (distance < minDistance) {
        minDistance = distance
        nearestCity = city
      }
    })

    if (minDistance < 1.5) {
      setSelectedLocation({
        lat: nearestCity.lat,
        lng: nearestCity.lng,
        name: nearestCity.name,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Select Location
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">{t.selectLocation}</p>

          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-96 border-2 border-border rounded-lg cursor-crosshair bg-white shadow-md"
          />

          {selectedLocation && (
            <Card className="p-4 bg-green-50 border-green-200 animate-scale-in">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">{t.place}</p>
                  <p className="text-lg font-bold text-foreground">{selectedLocation.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">{t.latitude}</p>
                  <p className="text-lg font-bold text-foreground">{selectedLocation.lat.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">{t.longitude}</p>
                  <p className="text-lg font-bold text-foreground">{selectedLocation.lng.toFixed(4)}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => selectedLocation && onSelect(selectedLocation)}
              disabled={!selectedLocation}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            >
              {t.confirm}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 h-12 bg-transparent">
              {t.cancel}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
