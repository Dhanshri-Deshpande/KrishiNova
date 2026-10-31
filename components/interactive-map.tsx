"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, MapPin } from "lucide-react"

interface Location {
  name: string
  lat: number
  lng: number
}

interface InteractiveMapProps {
  language: "en" | "hi" | "ur" | "mr"
  onSelect: (location: Location) => void
  onClose: () => void
}

// Dynamically import LeafletMap with SSR disabled
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

const translations = {
  en: { selectLocation: "Select Your Location", confirm: "Confirm Location", cancel: "Cancel" },
  hi: { selectLocation: "अपना स्थान चुनें", confirm: "स्थान की पुष्टि करें", cancel: "रद्द करें" },
  ur: { selectLocation: "اپنا مقام منتخب کریں", confirm: "مقام کی تصدیق کریں", cancel: "منسوخ کریں" },
  mr: { selectLocation: "आपले स्थान निवडा", confirm: "स्थान पुष्टी करा", cancel: "रद्द करा" },
}

export default function InteractiveMap({ language, onSelect, onClose }: InteractiveMapProps) {
  const t = translations[language]
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            {t.selectLocation}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <LeafletMap
            language={language}
            onSelect={(loc) => setSelectedLocation(loc)}
            onClose={onClose}
          />

          {selectedLocation && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Place</p>
                  <p className="text-lg font-bold">{selectedLocation.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Latitude</p>
                  <p className="text-lg font-bold">{selectedLocation.lat.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Longitude</p>
                  <p className="text-lg font-bold">{selectedLocation.lng.toFixed(5)}</p>
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
