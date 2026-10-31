"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Language } from "./language-context"

interface IntercropsModalProps {
  language: Language
  onClose: () => void
  prediction?: {
    mainCrop: string
    intercrops: string[]
  }
}

const translations = {
  en: {
    intercrops: "Intercrop Allocation Options",
    optionA: "Option A",
    optionB: "Option B",
    optionC: "Option C",
    mainCrop: "Main Crop",
    intercrop: "Intercrop",
    mainCropPercent: "Main Crop %",
    intercropPercent: "Intercrop %",
    note: "Note",
    wheatMustard: "Wheat:Mustard commonly 9:1",
    gramOption: "Gram option 2:1 if farmer prefers pulse",
    close: "Close",
  },
  hi: {
    intercrops: "अंतरफसल आवंटन विकल्प",
    optionA: "विकल्प A",
    optionB: "विकल्प B",
    optionC: "विकल्प C",
    mainCrop: "मुख्य फसल",
    intercrop: "अंतरफसल",
    mainCropPercent: "मुख्य फसल %",
    intercropPercent: "अंतरफसल %",
    note: "नोट",
    wheatMustard: "गेहूं:सरसों आमतौर पर 9:1",
    gramOption: "यदि किसान दाल पसंद करता है तो ग्राम विकल्प 2:1",
    close: "बंद करें",
  },
  ur: {
    intercrops: "ملی جلی فصل کی تقسیم کے اختیارات",
    optionA: "اختیار A",
    optionB: "اختیار B",
    optionC: "اختیار C",
    mainCrop: "مرکزی فصل",
    intercrop: "ملی جلی فصل",
    mainCropPercent: "مرکزی فصل %",
    intercropPercent: "ملی جلی فصل %",
    note: "نوٹ",
    wheatMustard: "گندم: سرسوں عام طور پر 9:1",
    gramOption: "اگر کسان دال پسند کرتا ہے تو چنے کا اختیار 2:1",
    close: "بند کریں",
  },
  mr: {
    intercrops: "अंतरपीक वाटप विकल्प",
    optionA: "पर्याय A",
    optionB: "पर्याय B",
    optionC: "पर्याय C",
    mainCrop: "मुख्य पीक",
    intercrop: "अंतरपीक",
    mainCropPercent: "मुख्य पीक %",
    intercropPercent: "अंतरपीक %",
    note: "नोट",
    wheatMustard: "गहू:सरसो सामान्यत: 9:1",
    gramOption: "शेतकरी दाळ पसंत करत असल्यास चणा पर्याय 2:1",
    close: "बंद करा",
  },
}

const intercropsData = [
  {
    id: "A",
    mainCrop: "Wheat",
    intercrop: "Mustard",
    mainCropPercent: 90,
    intercropPercent: 10,
  },
  {
    id: "B",
    mainCrop: "Wheat",
    intercrop: "Gram",
    mainCropPercent: 67,
    intercropPercent: 33,
  },
  {
    id: "C",
    mainCrop: "Wheat",
    intercrop: "Linseed",
    mainCropPercent: 67,
    intercropPercent: 33,
  },
]

export default function IntercropsModal({ language, onClose, prediction }: IntercropsModalProps) {
  const t = translations[language] || translations.en

  const displayData = prediction && prediction.intercrops && prediction.intercrops.length > 0
    ? prediction.intercrops.map((intercrop, idx) => ({
        id: String.fromCharCode(65 + idx), // A, B, C...
        mainCrop: prediction.mainCrop,
        intercrop: intercrop,
        mainCropPercent: idx === 0 ? 80 : 67, // Dynamic mockup %
        intercropPercent: idx === 0 ? 20 : 33,
      }))
    : intercropsData

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">{t.intercrops}</h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {displayData.map((option) => (
            <Card
              key={option.id}
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {option.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t[`option${option.id}` as keyof typeof t]}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-semibold mb-2">{t.mainCrop}</p>
                  <p className="text-2xl font-bold text-primary mb-2">{option.mainCrop}</p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{t.mainCropPercent}:</span> {option.mainCropPercent}%
                  </p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-semibold mb-2">{t.intercrop}</p>
                  <p className="text-2xl font-bold text-secondary mb-2">{option.intercrop}</p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{t.intercropPercent}:</span> {option.intercropPercent}%
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-foreground mb-3">{t.note}</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{t.wheatMustard}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{t.gramOption}</span>
              </li>
            </ul>
          </Card>

          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12">
            {t.close}
          </Button>
        </div>
      </Card>
    </div>
  )
}
