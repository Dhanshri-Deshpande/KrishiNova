"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react"

interface ContactPageProps {
  language: "en" | "hi" | "ur" | "mr"
}

const translations = {
  en: {
    contact: "Contact Us",
    getInTouch: "Get in Touch",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    messageSent: "Message Sent Successfully!",
    phone: "Phone",
    address: "Address",
  },
  hi: {
    contact: "हमसे संपर्क करें",
    getInTouch: "संपर्क में रहें",
    name: "नाम",
    email: "ईमेल",
    message: "संदेश",
    send: "संदेश भेजें",
    messageSent: "संदेश सफलतापूर्वक भेजा गया!",
    phone: "फोन",
    address: "पता",
  },
  ur: {
    contact: "ہمسے رابطہ کریں",
    getInTouch: "رابطے میں رہیں",
    name: "نام",
    email: "ای میل",
    message: "پیغام",
    send: "پیغام بھیجیں",
    messageSent: "پیغام کامیابی سے بھیجا گیا!",
    phone: "فون",
    address: "پتہ",
  },
  mr: {
    contact: "आमच्याशी संपर्क करा",
    getInTouch: "संपर्क साधा",
    name: "नाव",
    email: "ईमेल",
    message: "संदेश",
    send: "संदेश पाठवा",
    messageSent: "संदेश यशस्वीरित्या पाठवला गेला!",
    phone: "फोन",
    address: "पत्ता",
  },
}

export default function ContactPage({ language }: ContactPageProps) {
  const t = translations[language] || translations.en
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [showSuccess, setShowSuccess] = useState(false)
  const sendButtonRef = useRef<HTMLButtonElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => {
      sendButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 py-20 relative overflow-hidden scroll-smooth">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="font-heading text-5xl font-extrabold text-foreground mb-4">{t.contact}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animate-delay-100 rounded-3xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Mail className="w-8 h-8 text-primary" />
              {t.getInTouch}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-2 group-focus-within:text-primary transition-colors">{t.name}</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 h-12 rounded-xl"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-2 group-focus-within:text-primary transition-colors">{t.email}</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 h-12 rounded-xl"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-2 group-focus-within:text-primary transition-colors">{t.message}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-3 bg-white/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300"
                  required
                />
              </div>
              <Button
                ref={sendButtonRef}
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t.send}
              </Button>
            </form>

            {showSuccess && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-scale-in shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600 animate-pulse" />
                <p className="text-green-800 font-medium">{t.messageSent}</p>
              </div>
            )}
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animate-delay-200 rounded-3xl h-fit">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-10">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1.5">
                  <p className="font-semibold text-foreground text-lg">{t.phone}</p>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                  <Mail className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1.5">
                  <p className="font-semibold text-foreground text-lg">Email</p>
                  <p className="text-muted-foreground">info@krishinova.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1.5">
                  <p className="font-semibold text-foreground text-lg">{t.address}</p>
                  <p className="text-muted-foreground">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
            
            {/* Embedded map visual placeholder */}
            <div className="mt-10 h-48 bg-muted rounded-2xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-semibold text-primary shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  View on Map
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
