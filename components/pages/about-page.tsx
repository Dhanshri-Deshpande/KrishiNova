"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Droplets, Zap, TrendingUp } from "lucide-react"

interface AboutPageProps {
  language: "en" | "hi" | "ur" | "mr"
}

const translations = {
  en: {
    about: "About Krishinova",
    mission: "Our Mission",
    missionDesc: "To empower farmers with AI-driven insights for sustainable and profitable agriculture.",
    vision: "Our Vision",
    visionDesc: "A future where every farmer has access to precision farming tools and knowledge.",
    features: "Why Choose Krishinova?",
    aiPowered: "AI-Powered Predictions",
    aiDesc: "Advanced machine learning models for accurate crop and water predictions.",
    sustainable: "Sustainable Practices",
    sustainableDesc: "Promote eco-friendly farming methods and soil conservation.",
    realTime: "Real-Time Advisories",
    realTimeDesc: "Get timely alerts for sowing, fertilizing, and harvesting.",
    datadriven: "Data-Driven Decisions",
    datadrivenDesc: "Make informed decisions based on soil, climate, and market data.",
  },
  hi: {
    about: "कृषिनोवा के बारे में",
    mission: "हमारा मिशन",
    missionDesc: "किसानों को टिकाऊ और लाभदायक कृषि के लिए AI-संचालित अंतर्दृष्टि प्रदान करना।",
    vision: "हमारा दृष्टिकोन",
    visionDesc: "एक भविष्य जहां हर किसान के पास सटीक कृषि उपकरण और ज्ञान तक पहुंच है।",
    features: "कृषिनोवा क्यों चुनें?",
    aiPowered: "AI-संचालित भविष्यवाणी",
    aiDesc: "सटीक फसल और जल भविष्यवाणी के लिए उन्नत मशीन लर्निंग मॉडल।",
    sustainable: "टिकाऊ प्रथाएं",
    sustainableDesc: "पर्यावरण-अनुकूल कृषि विधियों और मिट्टी संरक्षण को बढ़ावा दें।",
    realTime: "रीयल-टाइम सलाह",
    realTimeDesc: "बुवाई, खाद डालने और कटाई के लिए समय पर सतर्कता प्राप्त करें।",
    datadriven: "डेटा-संचालित निर्णय",
    datadrivenDesc: "मिट्टी, जलवायु और बाजार डेटा के आधार पर सूचित निर्णय लें।",
  },
  ur: {
    about: "کرشی نووا کے بارے میں",
    mission: "ہمارا مشن",
    missionDesc: "کسانوں کو پائیدار اور منافع بخش زراعت کے لیے AI سے چلنے والی بصیرت فراہم کرنا۔",
    vision: "ہمارا نقطہ نظر",
    visionDesc: "ایک مستقبل جہاں ہر کسان کے پاس درست زراعت کے اوزار اور علم تک رسائی ہو۔",
    features: "کرشی نووا کو کیوں منتخب کریں؟",
    aiPowered: "AI سے چلنے والی پیش گوئی",
    aiDesc: "درست فصل اور پانی کی پیش گوئی کے لیے جدید مشین لرننگ ماڈل۔",
    sustainable: "پائیدار طریقے",
    sustainableDesc: "ماحول دوست زراعت کے طریقوں اور مٹی کے تحفظ کو فروغ دیں۔",
    realTime: "حقیقی وقت میں مشورہ",
    realTimeDesc: "بوائی، کھاد ڈالنے اور کٹائی کے لیے بروقت انتباہات حاصل کریں۔",
    datadriven: "ڈیٹا سے چلنے والے فیصلے",
    datadrivenDesc: "مٹی، آب و ہوا اور بازار کے ڈیٹا کی بنیاد پر باخبر فیصلے لیں۔",
  },
  mr: {
    about: "Krishinova बद्दल",
    mission: "आमचे उद्देश्य",
    missionDesc: "शेतकऱ्यांना टिकाऊ आणि लाभदायक कृषीसाठी AI-चालित अंतर्दृष्टी प्रदान करणे।",
    vision: "आमचा दृष्टिकोन",
    visionDesc: "एक भविष्य जेथे प्रत्येक शेतकऱ्याला अचूक कृषी साधने आणि ज्ञान उपलब्ध आहे।",
    features: "Krishinova का निवडा?",
    aiPowered: "AI-संचालित भविष्यवाणी",
    aiDesc: "अचूक पीक आणि जल भविष्यवाणीसाठी उन्नत मशीन लर्निंग मॉडेल।",
    sustainable: "टिकाऊ पद्धती",
    sustainableDesc: "पर्यावरण-अनुकूल शेती पद्धती आणि मातीचे संरक्षण प्रचार करा।",
    realTime: "रिअल-टाइम सल्ला",
    realTimeDesc: "बुवाई, खते आणि कापणीसाठी समय मिळवा।",
    datadriven: "डेटा-चालित निर्णय",
    datadrivenDesc: "मातीचे, हवामान आणि बाजार डेटा आधारित माहितीपूर्ण निर्णय घ्या।",
  },
}

export default function AboutPage({ language }: AboutPageProps) {
  const t = translations[language] || translations.en

  const features = [
    {
      icon: Zap,
      title: t.aiPowered,
      description: t.aiDesc,
    },
    {
      icon: Leaf,
      title: t.sustainable,
      description: t.sustainableDesc,
    },
    {
      icon: TrendingUp,
      title: t.realTime,
      description: t.realTimeDesc,
    },
    {
      icon: Droplets,
      title: t.datadriven,
      description: t.datadrivenDesc,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="font-heading text-5xl font-extrabold text-foreground mb-4">{t.about}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animate-delay-100 group rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <Zap className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">{t.mission}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{t.missionDesc}</p>
          </Card>
          
          <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animate-delay-200 group rounded-3xl">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
              <Leaf className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">{t.vision}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{t.visionDesc}</p>
          </Card>
        </div>

        <div className="text-center mb-12 animate-fade-in-up animate-delay-300">
          <h2 className="font-heading text-4xl font-bold text-foreground">{t.features}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className={`p-8 bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fade-in-up rounded-2xl group`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-transform duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
