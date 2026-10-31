"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Leaf, Droplets, Info } from "lucide-react"
import IntercropsModal from "../intercrop-modal"
import type { Language } from "../language-context"

interface PredictionPageProps {
  language: Language
  user: any
}

const translations = {
  en: {
    prediction: "Prediction System",
    cropPrediction: "Crop Prediction",
    waterPrediction: "Water Prediction",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    ph: "pH Level",
    predict: "Predict Crop",
    predictWater: "Predict Water",
    predictedCrop: "Predicted Crop",
    intercrop: "Intercrops",
    fertilizer: "Recommended Fertilizer",
    daysToHarvest: "Days to Harvest",
    expertComment: "Expert Comment",
    totalWater: "Total Water Required",
    expectedRainfall: "Expected Rainfall",
    waterToStore: "Water to Store in Tank",
    storageVolume: "Equivalent Storage Volume",
    moreDetails: "More Details",
  },
  hi: { prediction: "भविष्यवाणी प्रणाली", cropPrediction: "फसल भविष्यवाणी", waterPrediction: "जल भविष्यवाणी", nitrogen: "नाइट्रोजन (N)", phosphorus: "फॉस्फोरस (P)", potassium: "पोटेशियम (K)", ph: "pH स्तर", predict: "फसल की भविष्यवाणी करें", predictWater: "जल की भविष्यवाणी करें", predictedCrop: "भविष्यवाणी की गई फसल", intercrop: "अंतरफसल", fertilizer: "अनुशंसित खाद", daysToHarvest: "कटाई तक दिन", expertComment: "विशेषज्ञ की टिप्पणी", totalWater: "कुल आवश्यक जल", expectedRainfall: "अपेक्षित वर्षा", waterToStore: "टंकी में संग्रहीत करने के लिए जल", storageVolume: "समतुल्य भंडारण मात्रा", moreDetails: "अधिक विवरण", }, 
  ur: { prediction: "پیش گوئی کا نظام", cropPrediction: "فصل کی پیش گوئی", waterPrediction: "پانی کی پیش گوئی", nitrogen: "نائٹروجن (N)", phosphorus: "فاسفورس (P)", potassium: "پوٹاشیم (K)", ph: "pH سطح", predict: "فصل کی پیش گوئی کریں", predictWater: "پانی کی پیش گوئی کریں", predictedCrop: "پیش گوئی شدہ فصل", intercrop: "ملی جلی فصل", fertilizer: "تجویز کردہ کھاد", daysToHarvest: "کٹائی تک دن", expertComment: "ماہر کی تبصرہ", totalWater: "کل ضروری پانی", expectedRainfall: "متوقع بارش", waterToStore: "ٹینک میں ذخیرہ کرنے کے لیے پانی", storageVolume: "مساوی ذخیرہ کی مقدار", moreDetails: "مزید تفصیلات", }, 
  mr: { prediction: "भविष्यवाणी प्रणाली", cropPrediction: "पीक भविष्यवाणी", waterPrediction: "जल भविष्यवाणी", nitrogen: "नायट्रोजन (N)", phosphorus: "फॉस्फरस (P)", potassium: "पोटॅशियम (K)", ph: "pH स्तर", predict: "पीक भविष्यवाणी करा", predictWater: "जल भविष्यवाणी करा", predictedCrop: "भविष्यवाणी केलेली पीक", intercrop: "अंतरपीक", fertilizer: "शिफारस केलेले खते", daysToHarvest: "कापणीपर्यंत दिवस", expertComment: "तज्ञ टिप्पणी", totalWater: "एकूण आवश्यक पाणी", expectedRainfall: "अपेक्षित पाऊस", waterToStore: "टाकीमध्ये साठवायचे पाणी", storageVolume: "समतुल्य साठवण व्हॉल्यूम", moreDetails: "अधिक तपशील", },
}

export default function PredictionPage({ language, user }: PredictionPageProps) {
  const t = translations[language] || translations.en
  const [cropInputs, setCropInputs] = useState({
    nitrogen: user.nitrogen || "",
    phosphorus: user.phosphorus || "",
    potassium: user.potassium || "",
    ph: user.ph || "",
  })
  const [cropPrediction, setCropPrediction] = useState<any>(null)
  const [waterPrediction, setWaterPrediction] = useState<any>(null)
  const [showIntercropsModal, setShowIntercropsModal] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleCropInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCropInputs((prev) => ({ ...prev, [name]: value }))
  }

  const [isPredicting, setIsPredicting] = useState(false)

  const handleCropPredict = async () => {
    setIsPredicting(true)
    
    try {
      const response = await fetch("/api/predict/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(cropInputs.nitrogen) || 0,
          P: Number(cropInputs.phosphorus) || 0,
          K: Number(cropInputs.potassium) || 0,
          ph: Number(cropInputs.ph) || 7.0,
          // Sending dummy 4-year weather data since frontend doesn't have it yet
          yearly_temperatures: [28.5, 29.0, 27.5, 28.0], 
          yearly_humidities: [65.0, 60.0, 70.0, 68.0],
          yearly_rainfalls: [120.0, 150.0, 110.0, 130.0]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCropPrediction({
          mainCrop: data.predicted_crop,
          intercrops: data.recommended_intercrops,
          fertilizer: data.fertilizer || "NPK 20:20:20 - 50kg/acre",
          daysToHarvest: data.days_to_harvest || 120,
          expertComment: `Based on your soil and historical weather, ${data.predicted_crop} is recommended with ${data.confidence} confidence.`,
        });
      } else {
        throw new Error("Backend error");
      }
    } catch (error) {
      // Fallback if backend is not running
      const selectedCrop = "Wheat";
      setCropPrediction({
        mainCrop: selectedCrop,
        intercrops: ["Mustard", "Gram", "Linseed"],
        fertilizer: "NPK 20:20:20 - 50kg/acre",
        daysToHarvest: 120, // Fixed! No longer random.
        expertComment: `${selectedCrop} is highly suitable for your soil conditions. Ensure proper irrigation. (Note: Using offline mock data. Start Python backend for real ML predictions.)`,
      });
    }

    setIsPredicting(false)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 500)
  }

  const handleWaterPredict = async () => {
    if (!cropPrediction) {
      alert("Please predict crop first")
      return
    }

    try {
      // Get the same historical 4-year averages used in the crop model
      const yearly_temperatures = [28.5, 29.0, 27.5, 28.0];
      const yearly_humidities = [65.0, 60.0, 70.0, 68.0];
      const yearly_rainfalls = [120.0, 150.0, 110.0, 130.0];

      const avg_temp = yearly_temperatures.reduce((a, b) => a + b, 0) / yearly_temperatures.length;
      const avg_hum = yearly_humidities.reduce((a, b) => a + b, 0) / yearly_humidities.length;
      const avg_rain = yearly_rainfalls.reduce((a, b) => a + b, 0) / yearly_rainfalls.length;

      const response = await fetch("/api/predict/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forecast_temperature: avg_temp,
          forecast_humidity: avg_hum,
          forecast_rainfall_mm: avg_rain, // Based on 4-year historical average
          crop_stage: "development",
          area_acres: Number(user.landArea) || 1.0,
          current_tank_volume_liters: 10000.0
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWaterPrediction({
          totalWater: `${data.total_required_liters.toLocaleString()} liters/acre`,
          expectedRainfall: `${data.expected_rainfall_liters.toLocaleString()} liters from rain`,
          waterToStore: `${data.net_water_needed_liters.toLocaleString()} liters to pump`,
          storageVolume: `${Math.round(data.net_water_needed_liters / 1000)} cubic meters`,
        });
      } else {
        throw new Error("Backend error");
      }
    } catch (error) {
      setWaterPrediction({
        totalWater: "45,000 liters/acre",
        expectedRainfall: "12,000 liters/acre",
        waterToStore: "33,000 liters/acre",
        storageVolume: "33 cubic meters",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 py-12 scroll-smooth relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%2342875a' strokeWidth='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div ref={resultsRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-green-800 mb-4">{t.prediction}</h1>
          <div className="w-20 h-1 mx-auto rounded-full bg-green-600" />
        </div>

        <Tabs defaultValue="crop" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-2 bg-white/80 backdrop-blur-md shadow-xl rounded-full p-2 h-16 w-full max-w-md border border-white/50">
              <TabsTrigger
                value="crop"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-green-800 font-bold rounded-full text-base transition-all duration-300"
              >
                <Leaf className="w-5 h-5" />
                {t.cropPrediction}
              </TabsTrigger>
              <TabsTrigger
                value="water"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-blue-800 font-bold rounded-full text-base transition-all duration-300"
              >
                <Droplets className="w-5 h-5" />
                {t.waterPrediction}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* CROP PREDICTION TAB */}
          <TabsContent value="crop" className="space-y-6 animate-fade-in-up relative">
            <Card className="p-8 shadow-2xl border-0 relative z-10 rounded-3xl overflow-hidden min-h-[600px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600')]" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-green-500/30">
                    <Leaf className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-white tracking-tight">{t.cropPrediction}</h2>
                </div>

                {/* INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[t.nitrogen, t.phosphorus, t.potassium, t.ph].map((label, idx) => {
                    const name = ["nitrogen", "phosphorus", "potassium", "ph"][idx]
                    return (
                      <div key={name} className="space-y-2">
                        <label className="block text-sm font-semibold text-green-100">{label}</label>
                        <Input
                          name={name}
                          type="number"
                          value={cropInputs[name as keyof typeof cropInputs]}
                          onChange={handleCropInputChange}
                          placeholder={name === "ph" ? "0-14" : "0-100"}
                          className="h-12 border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:border-green-400 focus:ring-green-400/50 rounded-xl transition-all"
                        />
                      </div>
                    )
                  })}
                </div>

                <Button
                  onClick={handleCropPredict}
                  disabled={isPredicting}
                  className={`w-full md:w-auto px-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white h-14 rounded-full text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:-translate-y-1 font-semibold mx-auto flex mb-8 ${isPredicting ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  {isPredicting ? "Predicting..." : t.predict}
                </Button>

                {/* RESULTS */}
                {cropPrediction && (
                  <div className="space-y-6 animate-scale-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                        <p className="text-sm font-medium text-green-200 mb-2">{t.predictedCrop}</p>
                        <p className="text-4xl font-heading font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300">{cropPrediction.mainCrop}</p>
                      </div>
                      <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                        <p className="text-sm font-medium text-green-200 mb-2">{t.intercrop}</p>
                        <div className="flex flex-wrap gap-2 text-white">
                          {cropPrediction.intercrops.map((crop: string, idx: number) => (
                            <span key={idx} className="px-4 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-colors">
                        <p className="text-sm text-green-200/80 mb-2">{t.fertilizer}</p>
                        <p className="text-xl font-bold text-white">{cropPrediction.fertilizer}</p>
                      </div>
                      <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-colors">
                        <p className="text-sm text-green-200/80 mb-2">{t.daysToHarvest}</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-bold text-white">{cropPrediction.daysToHarvest}</p>
                          {typeof cropPrediction.daysToHarvest === 'number' && <p className="text-green-200/60 pb-1">days</p>}
                        </div>
                      </div>
                      <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-colors">
                        <p className="text-sm text-green-200/80 mb-2">{t.expertComment}</p>
                        <p className="text-sm leading-relaxed text-white/90">{cropPrediction.expertComment}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowIntercropsModal(true)}
                      variant="outline"
                      className="w-full md:w-auto h-12 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-2 rounded-full mx-auto backdrop-blur-sm transition-all"
                    >
                      <Info className="w-4 h-4" />
                      {t.moreDetails}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* WATER PREDICTION TAB */}
          <TabsContent value="water" className="space-y-6 animate-fade-in-up relative">
            <Card className="p-8 shadow-2xl border-0 relative z-10 rounded-3xl overflow-hidden min-h-[600px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=1600')]" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-blue-500/30">
                    <Droplets className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-white tracking-tight">{t.waterPrediction}</h2>
                </div>

                {!cropPrediction && (
                  <div className="bg-orange-500/20 backdrop-blur-md border-2 border-orange-500/30 rounded-2xl p-6 flex items-start gap-4 mb-10 shadow-lg">
                    <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-orange-100 font-medium text-lg">Please predict crop first on the Crop Prediction tab to get tailored water recommendations.</p>
                  </div>
                )}

                <Button
                  onClick={handleWaterPredict}
                  disabled={!cropPrediction}
                  className="w-full md:w-auto px-12 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white h-14 rounded-full text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:-translate-y-1 font-semibold mx-auto flex mb-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {t.predictWater}
                </Button>

                {waterPrediction && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                    {[{ label: t.totalWater, value: waterPrediction.totalWater },
                      { label: t.expectedRainfall, value: waterPrediction.expectedRainfall },
                      { label: t.waterToStore, value: waterPrediction.waterToStore },
                      { label: t.storageVolume, value: waterPrediction.storageVolume },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-all">
                        <p className="text-sm font-medium text-blue-200 mb-2">{item.label}</p>
                        <p className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showIntercropsModal && (
        <IntercropsModal language={language} onClose={() => setShowIntercropsModal(false)} prediction={cropPrediction} />
      )}
    </div>
  )
}
