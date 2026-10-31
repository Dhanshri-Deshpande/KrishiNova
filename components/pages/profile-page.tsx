"use client"

import { useState } from "react"
import { useLanguage, type Language } from "../language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Settings,
  LogOut,
  Leaf,
  Shield,
  Bell,
  Globe,
  MapPin,
  Camera,
  History,
  Calendar,
  Clock,
} from "lucide-react"
import InteractiveMap from "../interactive-map"

interface ProfilePageProps {
  language: Language
  user: any
  onLogout: () => void
}

const translations = {
  en: {
    profile: "My Profile",
    personalInfo: "Personal Information",
    landInfo: "Land Information",
    settings: "Settings",
    predictionHistory: "Prediction History",
    name: "Full Name",
    dob: "Date of Birth",
    mobile: "Mobile Number",
    location: "Location",
    landArea: "Land Area (acres)",
    nitrogen: "Nitrogen (mg/kg)",
    phosphorus: "Phosphorus (mg/kg)",
    potassium: "Potassium (mg/kg)",
    ph: "pH Level",
    totalPredictions: "Total Predictions",
    language: "Language Preference",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    urdu: "اردو (Urdu)",
    marathi: "मराठी (Marathi)",
    logout: "Logout",
    edit: "Edit Profile",
    save: "Save Changes",
    cancel: "Cancel",
    notifications: "Notifications",
    privacy: "Privacy & Security",
    appearance: "Appearance",
    enableNotifications: "Enable Email Notifications",
    twoFactor: "Two-Factor Authentication",
    dataPrivacy: "Data Privacy",
    accountSecurity: "Account Security",
    darkMode: "Dark Mode",
    theme: "Theme",
    profileUpdated: "Profile updated successfully",
    settingsUpdated: "Settings updated successfully",
    selectLanguage: "Select your preferred language for the application",
    signOut: "Sign Out",
    endSession: "End your current session",
    selectLocation: "Select Location",
    latitude: "Latitude",
    longitude: "Longitude",
    city: "City",
    changePhoto: "Change Photo",
    noPredictions: "No predictions yet. Start by making your first prediction!",
    crop: "Crop",
    date: "Date",
    time: "Time",
    details: "Details",
    viewDetails: "View Details",
  },
  hi: {
    profile: "मेरी प्रोफाइल",
    personalInfo: "व्यक्तिगत जानकारी",
    landInfo: "भूमि की जानकारी",
    settings: "सेटिंग्स",
    predictionHistory: "भविष्यवाणी इतिहास",
    name: "पूरा नाम",
    dob: "जन्म तिथि",
    mobile: "मोबाइल नंबर",
    location: "स्थान",
    landArea: "भूमि क्षेत्र (एकड़)",
    nitrogen: "नाइट्रोजन (mg/kg)",
    phosphorus: "फॉस्फोरस (mg/kg)",
    potassium: "पोटेशियम (mg/kg)",
    ph: "pH स्तर",
    totalPredictions: "कुल भविष्यवाणियां",
    language: "भाषा की पसंद",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    urdu: "اردو (Urdu)",
    marathi: "मराठी (Marathi)",
    logout: "लॉग आउट",
    edit: "प्रोफाइल संपादित करें",
    save: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    notifications: "सूचनाएं",
    privacy: "गोपनीयता और सुरक्षा",
    appearance: "दिखावट",
    enableNotifications: "ईमेल सूचनाएं सक्षम करें",
    twoFactor: "दो-कारक प्रमाणीकरण",
    dataPrivacy: "डेटा गोपनीयता",
    accountSecurity: "खाता सुरक्षा",
    darkMode: "डार्क मोड",
    theme: "थीम",
    profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट हो गया",
    settingsUpdated: "सेटिंग्स सफलतापूर्वक अपडेट हो गईं",
    selectLanguage: "एप्लिकेशन के लिए अपनी पसंदीदा भाषा चुनें",
    signOut: "साइन आउट",
    endSession: "अपने वर्तमान सत्र को समाप्त करें",
    selectLocation: "स्थान चुनें",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    city: "शहर",
    changePhoto: "फोटो बदलें",
    noPredictions: "अभी तक कोई भविष्यवाणी नहीं। अपनी पहली भविष्यवाणी करके शुरुआत करें!",
    crop: "फसल",
    date: "तारीख",
    time: "समय",
    details: "विवरण",
    viewDetails: "विवरण देखें",
  },
  ur: {
    profile: "میری پروفائل",
    personalInfo: "ذاتی معلومات",
    landInfo: "زمین کی معلومات",
    settings: "ترتیبات",
    predictionHistory: "پیش گوئی کی تاریخ",
    name: "مکمل نام",
    dob: "پیدائش کی تاریخ",
    mobile: "موبائل نمبر",
    location: "مقام",
    landArea: "زمین کا رقبہ (ایکڑ)",
    nitrogen: "نائٹروجن (mg/kg)",
    phosphorus: "فاسفورس (mg/kg)",
    potassium: "پوٹاشیم (mg/kg)",
    ph: "pH سطح",
    totalPredictions: "کل پیشن گوئیاں",
    language: "زبان کی ترجیح",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    urdu: "اردو (Urdu)",
    marathi: "मराठी (Marathi)",
    logout: "لاگ آؤٹ",
    edit: "پروفائل میں ترمیم کریں",
    save: "تبدیلیاں محفوظ کریں",
    cancel: "منسوخ کریں",
    notifications: "اطلاعات",
    privacy: "رازداری اور سیکیورٹی",
    appearance: "ظہور",
    enableNotifications: "ای میل اطلاعات فعال کریں",
    twoFactor: "دو عاملی تصدیق",
    dataPrivacy: "ڈیٹا کی رازداری",
    accountSecurity: "اکاؤنٹ کی سیکیورٹی",
    darkMode: "ڈارک موڈ",
    theme: "تھیم",
    profileUpdated: "پروفائل کامیابی سے اپ ڈیٹ ہو گیا",
    settingsUpdated: "ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں",
    selectLanguage: "درخواست کے لیے اپنی پسندیدہ زبان منتخب کریں",
    signOut: "سائن آؤٹ",
    endSession: "اپنے موجودہ سیشن کو ختم کریں",
    selectLocation: "مقام منتخب کریں",
    latitude: "عرض البلد",
    longitude: "طول البلد",
    city: "شہر",
    changePhoto: "فوٹو بدلیں",
    noPredictions: "ابھی تک کوئی پیش گوئی نہیں۔ اپنی پہلی پیش گوئی سے شروع کریں!",
    crop: "فصل",
    date: "تاریخ",
    time: "وقت",
    details: "تفصیلات",
    viewDetails: "تفصیلات دیکھیں",
  },
  mr: {
    profile: "माझी प्रोफाइल",
    personalInfo: "व्यक्तिगत माहिती",
    landInfo: "जमीन माहिती",
    settings: "सेटिंग्स",
    predictionHistory: "भविष्यवाणी इतिहास",
    name: "पूर्ण नाव",
    dob: "जन्म तारीख",
    mobile: "मोबाइल नंबर",
    location: "स्थान",
    landArea: "जमीन क्षेत्र (एकर)",
    nitrogen: "नायट्रोजन (mg/kg)",
    phosphorus: "फॉस्फरस (mg/kg)",
    potassium: "पोटॅशियम (mg/kg)",
    ph: "pH स्तर",
    totalPredictions: "एकूण भविष्यवाणी",
    language: "भाषा प्राधान्य",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    urdu: "اردو (Urdu)",
    marathi: "मराठी (Marathi)",
    logout: "लॉग आउट",
    edit: "प्रोफाइल संपादित करा",
    save: "बदल जतन करा",
    cancel: "रद्द करा",
    notifications: "सूचना",
    privacy: "गोपनीयता आणि सुरक्षा",
    appearance: "दिसावट",
    enableNotifications: "ईमेल सूचना सक्षम करा",
    twoFactor: "दोन-घटक प्रमाणीकरण",
    dataPrivacy: "डेटा गोपनीयता",
    accountSecurity: "खाते सुरक्षा",
    darkMode: "गडद मोड",
    theme: "थीम",
    profileUpdated: "प्रोफाइल यशस्वीरित्या अपडेट झाली",
    settingsUpdated: "सेटिंग्स यशस्वीरित्या अपडेट झाली",
    selectLanguage: "अनुप्रयोगासाठी आपली पसंतीची भाषा निवडा",
    signOut: "साइन आउट",
    endSession: "आपला वर्तमान सत्र समाप्त करा",
    selectLocation: "स्थान निवडा",
    latitude: "अक्षांश",
    longitude: "रेखांश",
    city: "शहर",
    changePhoto: "फोटो बदला",
    noPredictions: "अद्याप कोणतीही भविष्यवाणी नाही। आपली पहिली भविष्यवाणी करून सुरुवात करा!",
    crop: "पीक",
    date: "तारीख",
    time: "वेळ",
    details: "तपशील",
    viewDetails: "तपशील पहा",
  },
}

export default function ProfilePage({ language, user, onLogout }: ProfilePageProps) {
  const t = translations[language]
  const { setLanguage } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [userLocation, setUserLocation] = useState(user.location || { name: "Not set", lat: 0, lng: 0 })

  const predictionHistory = [
    {
      id: 1,
      crop: "Wheat",
      date: "2024-10-20",
      time: "14:30",
      nitrogen: 45,
      phosphorus: 30,
      potassium: 25,
      ph: 7.2,
    },
    {
      id: 2,
      crop: "Cotton",
      date: "2024-10-18",
      time: "10:15",
      nitrogen: 50,
      phosphorus: 35,
      potassium: 28,
      ph: 6.8,
    },
    {
      id: 3,
      crop: "Rice",
      date: "2024-10-15",
      time: "09:45",
      nitrogen: 55,
      phosphorus: 32,
      potassium: 30,
      ph: 7.0,
    },
  ]

  const handleLocationSelect = (location: any) => {
    setUserLocation(location)
    setShowMap(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              {user.profilePicPreview ? (
                <img src={user.profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
          <p className="text-muted-foreground mt-1">{userLocation.name}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground">{t.profile}</h2>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{t.personalInfo}</span>
            </TabsTrigger>
            <TabsTrigger value="land" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{t.landInfo}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{t.predictionHistory}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{t.settings}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.name}</label>
                    <Input value={user.fullName} disabled={!isEditing} className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.dob}</label>
                    <Input value={user.dob} disabled={!isEditing} className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.mobile}</label>
                    <Input value={user.mobile} disabled={!isEditing} className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Gmail / Email</label>
                    <Input value={user.email || "farmer@gmail.com"} disabled className="bg-background/50 border-border/50 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.totalPredictions}</label>
                    <Input
                      value={user.totalPredictions || predictionHistory.length}
                      disabled
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t.edit}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        {t.save}
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="font-semibold">
                        {t.cancel}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="land">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t.location}</label>
                  <div className="flex gap-3">
                    <Input value={userLocation.name} disabled className="bg-background/50 border-border/50 flex-1" />
                    <Button
                      onClick={() => setShowMap(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {t.selectLocation}
                    </Button>
                  </div>
                  {userLocation.lat !== 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-background/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">{t.latitude}</p>
                        <p className="text-sm font-semibold text-foreground">{userLocation.lat.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">{t.longitude}</p>
                        <p className="text-sm font-semibold text-foreground">{userLocation.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.landArea}</label>
                    <Input value={`${user.landArea} acres`} disabled className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.nitrogen}</label>
                    <Input value={user.nitrogen} disabled className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.phosphorus}</label>
                    <Input value={user.phosphorus} disabled className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.potassium}</label>
                    <Input value={user.potassium} disabled className="bg-background/50 border-border/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">{t.ph}</label>
                    <Input value={user.ph} disabled className="bg-background/50 border-border/50" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    {t.predictionHistory}
                  </h3>
                  <div className="bg-primary/10 px-4 py-2 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      {t.totalPredictions}: {predictionHistory.length}
                    </p>
                  </div>
                </div>

                {predictionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">{t.noPredictions}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {predictionHistory.map((prediction) => (
                      <Card
                        key={prediction.id}
                        className="p-4 bg-gradient-to-r from-green-50 to-amber-50 border-green-200 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Leaf className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{prediction.crop}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {prediction.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {prediction.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-2">{t.details}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">N: {prediction.nitrogen}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">P: {prediction.phosphorus}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">K: {prediction.potassium}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">pH: {prediction.ph}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{t.language}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t.selectLanguage}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => setLanguage("en")}
                    variant={language === "en" ? "default" : "outline"}
                    className={
                      language === "en"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-auto py-4 flex flex-col gap-1"
                        : "font-semibold h-auto py-4 flex flex-col gap-1"
                    }
                  >
              
                    <span className="text-xs">{t.english}</span>
                  </Button>
                  <Button
                    onClick={() => setLanguage("hi")}
                    variant={language === "hi" ? "default" : "outline"}
                    className={
                      language === "hi"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-auto py-4 flex flex-col gap-1"
                        : "font-semibold h-auto py-4 flex flex-col gap-1"
                    }
                  >
                  
                    <span className="text-xs">{t.hindi}</span>
                  </Button>
                  <Button
                    onClick={() => setLanguage("ur")}
                    variant={language === "ur" ? "default" : "outline"}
                    className={
                      language === "ur"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-auto py-4 flex flex-col gap-1"
                        : "font-semibold h-auto py-4 flex flex-col gap-1"
                    }
                  >
                   
                    <span className="text-xs">{t.urdu}</span>
                  </Button>
                  <Button
                    onClick={() => setLanguage("mr")}
                    variant={language === "mr" ? "default" : "outline"}
                    className={
                      language === "mr"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-auto py-4 flex flex-col gap-1"
                        : "font-semibold h-auto py-4 flex flex-col gap-1"
                    }
                  >
                    
                    <span className="text-xs">{t.marathi}</span>
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{t.notifications}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                    <label className="text-sm font-medium text-foreground">{t.enableNotifications}</label>
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{t.privacy}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                    <label className="text-sm font-medium text-foreground">{t.twoFactor}</label>
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{t.accountSecurity}</p>
                </div>
              </Card>

              <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{t.signOut}</h3>
                      <p className="text-sm text-muted-foreground">{t.endSession}</p>
                    </div>
                  </div>
                  <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                    {t.logout}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showMap && (
        <InteractiveMap language={language} onSelect={handleLocationSelect} onClose={() => setShowMap(false)} />
      )}
    </div>
  )
}
