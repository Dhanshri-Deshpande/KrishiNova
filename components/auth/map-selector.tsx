"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"

interface MapSelectorProps {
  language: "en" | "mr"
  onSelect: (location: any) => void
  onClose: () => void
}

const mockLocations = [
  { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Nashik, Maharashtra", lat: 19.9975, lng: 73.7898 },
  { name: "Aurangabad, Maharashtra", lat: 19.8762, lng: 75.3433 },
  { name: "Kolhapur, Maharashtra", lat: 16.705, lng: 74.2433 },
]

export default function MapSelector({ language, onSelect, onClose }: MapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  const filteredLocations = mockLocations.filter((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelect = (location: any) => {
    setSelectedLocation(location)
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Select Your Location</h2>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {filteredLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleSelect(location)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLocation?.name === location.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
