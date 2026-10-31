"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FileText, CheckCircle, ChevronDown, ChevronUp, Landmark, ShieldCheck, Sprout, Tractor, LineChart } from "lucide-react"

interface SchemesPageProps {
  language: "en" | "hi" | "ur" | "mr"
}

const translations = {
  en: {
    title: "Government Agricultural Schemes",
    subtitle: "Explore financial support and subsidies available for farmers",
    eligibility: "Eligibility",
    documents: "Required Documents",
    viewDetails: "View Details",
  },
  hi: {
    title: "सरकारी कृषि योजनाएं",
    subtitle: "किसानों के लिए उपलब्ध वित्तीय सहायता और सब्सिडी का अन्वेषण करें",
    eligibility: "पात्रता",
    documents: "आवश्यक दस्तावेज़",
    viewDetails: "विवरण देखें",
  },
  ur: {
    title: "حکومتی زرعی اسکیمیں",
    subtitle: "کسانوں کے لیے دستیاب مالی امداد اور سبسڈی دریافت کریں",
    eligibility: "اہلیت",
    documents: "مطلوبہ دستاویزات",
    viewDetails: "تفصیلات دیکھیں",
  },
  mr: {
    title: "सरकारी कृषी योजना",
    subtitle: "शेतकऱ्यांसाठी उपलब्ध आर्थिक मदत आणि सबसिडी शोधा",
    eligibility: "पात्रता",
    documents: "आवश्यक कागदपत्रे",
    viewDetails: "तपशील पहा",
  }
}

const schemesData = {
  en: [
    {
      id: "pm-kisan",
      name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
      description: "Under this scheme, an income support of ₹6,000 per year is provided to all farmer families across the country in three equal installments.",
      eligibility: ["All landholding farmers' families", "Must have cultivable land in their names", "Institutional landholders are not eligible"],
      documents: ["Aadhaar Card", "Bank Passbook", "Land holding papers (7/12 extract)", "Passport size photo"]
    },
    {
      id: "kcc",
      name: "Kisan Credit Card (KCC)",
      icon: Tractor,
      image: "/crop.jpeg",
      description: "Provides farmers with timely access to credit for agricultural expenses at a low interest rate, ensuring they can purchase seeds, fertilizers, and machinery.",
      eligibility: ["Individual farmers / Joint borrowers who are owner cultivators", "Tenant farmers, Oral lessees & Sharecroppers", "Self Help Groups (SHGs) of farmers"],
      documents: ["Aadhaar Card / PAN Card", "Land documents", "Recent passport size photograph", "Address proof"]
    },
    {
      id: "pmfby",
      name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
      description: "A comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss or damage arising out of unforeseen natural events.",
      eligibility: ["All farmers growing notified crops in a notified area", "Non-loanee farmers are also eligible on a voluntary basis"],
      documents: ["Aadhaar Card", "Bank Passbook", "Land records", "Sowing certificate from Gram Panchayat"]
    },
    {
      id: "enam",
      name: "e-NAM (National Agriculture Market)",
      icon: LineChart,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800",
      description: "An online trading platform for agricultural commodities in India. It facilitates farmers, traders, and buyers with online trading in commodities to get better prices.",
      eligibility: ["Farmers", "FPOs (Farmer Producer Organizations)", "Traders and Commission Agents"],
      documents: ["Aadhaar Card", "Bank Details for online transfer", "Mobile Number for OTP validation"]
    },
    {
      id: "pkvy",
      name: "PKVY (Paramparagat Krishi Vikas Yojana)",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
      description: "An initiative to promote organic farming. The scheme provides financial assistance for organic certification and cluster formation to improve soil health.",
      eligibility: ["Farmers forming a cluster of 50 acres or more", "Willingness to adopt organic farming practices completely"],
      documents: ["Aadhaar Card", "Land holding papers", "Declaration of organic farming intent"]
    }
  ],
  hi: [
    {
      id: "pm-kisan",
      name: "पीएम-किसान (PM-KISAN)",
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
      description: "इस योजना के तहत, देश भर के सभी किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की आय सहायता प्रदान की जाती है।",
      eligibility: ["सभी भूमिधारक किसान परिवार", "उनके नाम पर खेती योग्य जमीन होनी चाहिए", "संस्थागत भूमिधारक पात्र नहीं हैं"],
      documents: ["आधार कार्ड", "बैंक पासबुक", "भूमि स्वामित्व के कागजात", "पासपोर्ट साइज फोटो"]
    },
    {
      id: "kcc",
      name: "किसान क्रेडिट कार्ड (KCC)",
      icon: Tractor,
      image: "/crop.jpeg",
      description: "किसानों को कम ब्याज दर पर कृषि खर्चों (बीज, उर्वरक, मशीनरी) के लिए समय पर ऋण उपलब्ध कराता है।",
      eligibility: ["व्यक्तिगत किसान / संयुक्त कर्जदार", "किरायेदार किसान और बटाईदार", "किसानों के स्वयं सहायता समूह (SHG)"],
      documents: ["आधार कार्ड / पैन कार्ड", "भूमि के दस्तावेज", "पासपोर्ट साइज फोटो", "पते का प्रमाण"]
    },
    {
      id: "pmfby",
      name: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
      description: "प्राकृतिक आपदाओं के कारण फसल के नुकसान से पीड़ित किसानों को वित्तीय सहायता प्रदान करने के लिए एक व्यापक फसल बीमा योजना।",
      eligibility: ["अधिसूचित क्षेत्र में फसलें उगाने वाले सभी किसान", "गैर-ऋणी किसान भी स्वैच्छिक आधार पर पात्र हैं"],
      documents: ["आधार कार्ड", "बैंक पासबुक", "भूमि रिकॉर्ड", "बुवाई का प्रमाण पत्र"]
    },
    {
      id: "enam",
      name: "ई-नाम (e-NAM) राष्ट्रीय कृषि बाजार",
      icon: LineChart,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800",
      description: "भारत में कृषि वस्तुओं के लिए एक ऑनलाइन ट्रेडिंग प्लेटफॉर्म। यह किसानों को बेहतर मूल्य प्राप्त करने की सुविधा देता है।",
      eligibility: ["किसान", "किसान उत्पादक संगठन (FPOs)", "व्यापारी"],
      documents: ["आधार कार्ड", "ऑनलाइन ट्रांसफर के लिए बैंक विवरण", "मोबाइल नंबर"]
    },
    {
      id: "pkvy",
      name: "परम्परागत कृषि विकास योजना (PKVY)",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
      description: "जैविक खेती को बढ़ावा देने की पहल। यह योजना जैविक प्रमाणन और मिट्टी के स्वास्थ्य में सुधार के लिए वित्तीय सहायता प्रदान करती है।",
      eligibility: ["50 एकड़ का क्लस्टर बनाने वाले किसान", "जैविक खेती अपनाने की इच्छा"],
      documents: ["आधार कार्ड", "भूमि स्वामित्व के कागजात", "जैविक खेती का घोषणा पत्र"]
    }
  ],
  mr: [
    {
      id: "pm-kisan",
      name: "पीएम-किसान (PM-KISAN)",
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
      description: "या योजनेंतर्गत देशभरातील सर्व शेतकरी कुटुंबांना तीन समान हप्त्यांमध्ये दरवर्षी ₹6,000 ची आर्थिक मदत दिली जाते.",
      eligibility: ["सर्व भूधारक शेतकरी कुटुंबे", "स्वतःच्या नावावर शेतीयोग्य जमीन असणे आवश्यक", "संस्थात्मक जमीन मालक पात्र नाहीत"],
      documents: ["आधार कार्ड", "बँक पासबुक", "जमिनीचा उतारा (७/१२)", "पासपोर्ट आकाराचा फोटो"]
    },
    {
      id: "kcc",
      name: "किसान क्रेडिट कार्ड (KCC)",
      icon: Tractor,
      image: "/crop.jpeg",
      description: "शेतकऱ्यांना शेतीच्या खर्चासाठी कमी व्याजदरात वेळेवर कर्ज उपलब्ध करून देते.",
      eligibility: ["वैयक्तिक शेतकरी किंवा संयुक्त कर्जदार", "कुळ आणि वाटेकरी शेतकरी", "शेतकऱ्यांचे बचत गट (SHGs)"],
      documents: ["आधार कार्ड / पॅन कार्ड", "जमिनीची कागदपत्रे", "पासपोर्ट फोटो", "पत्त्याचा पुरावा"]
    },
    {
      id: "pmfby",
      name: "प्रधानमंत्री पीक विमा योजना (PMFBY)",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
      description: "नैसर्गिक आपत्तीमुळे पिकांचे नुकसान झाल्यास शेतकऱ्यांना आर्थिक मदत देण्यासाठी पीक विमा योजना.",
      eligibility: ["अधिसूचित क्षेत्रात पिके घेणारे सर्व शेतकरी", "कर्जदार नसलेले शेतकरी देखील पात्र आहेत"],
      documents: ["आधार कार्ड", "बँक पासबुक", "जमिनीची नोंद", "तलाठी कडून पेरणी प्रमाणपत्र"]
    },
    {
      id: "enam",
      name: "ई-नाम (e-NAM) राष्ट्रीय कृषी बाजार",
      icon: LineChart,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800",
      description: "भारतातील कृषी उत्पादनांसाठी ऑनलाइन ट्रेडिंग प्लॅटफॉर्म. यामुळे शेतकऱ्यांना ऑनलाइन ट्रेडिंगद्वारे चांगला भाव मिळण्यास मदत होते.",
      eligibility: ["शेतकरी", "शेतकरी उत्पादक संस्था (FPOs)", "व्यापारी"],
      documents: ["आधार कार्ड", "बँक तपशील", "मोबाईल क्रमांक"]
    },
    {
      id: "pkvy",
      name: "परंपरागत कृषी विकास योजना (PKVY)",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
      description: "सेंद्रिय शेतीला चालना देण्यासाठी हा उपक्रम आहे. सेंद्रिय प्रमाणन आणि मातीचे आरोग्य सुधारण्यासाठी आर्थिक मदत दिली जाते.",
      eligibility: ["५० एकरांचा गट स्थापन करणारे शेतकरी", "सेंद्रिय शेती पद्धतीचा अवलंब करण्याची इच्छा"],
      documents: ["आधार कार्ड", "जमिनीची कागदपत्रे", "सेंद्रिय शेतीचे घोषणापत्र"]
    }
  ],
  ur: [
    {
      id: "pm-kisan",
      name: "پی ایم-کسان (PM-KISAN)",
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
      description: "اس اسکیم کے تحت کسانوں کو سالانہ 6000 روپے کی مالی امداد دی جاتی ہے۔",
      eligibility: ["تمام زمیندار کسان خاندان", "نام پر قابل کاشت زمین ہونی چاہیے"],
      documents: ["آدھار کارڈ", "بینک پاس بک", "زمین کے کاغذات"]
    },
    {
      id: "kcc",
      name: "کسان کریڈٹ کارڈ (KCC)",
      icon: Tractor,
      image: "/crop.jpeg",
      description: "کسانوں کو کم شرح سود پر زرعی اخراجات کے لیے قرض فراہم کرتا ہے۔",
      eligibility: ["انفرادی کسان", "کرایہ دار کسان"],
      documents: ["آدھار کارڈ / پین کارڈ", "زمین کے دستاویزات", "پاسپورٹ سائز تصویر"]
    },
    {
      id: "pmfby",
      name: "وزیر اعظم فصل بیمہ یوجنا (PMFBY)",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
      description: "فصل کے نقصان کی صورت میں کسانوں کو مالی مدد فراہم کرنے کے لیے فصل بیمہ اسکیم۔",
      eligibility: ["تمام کسان جو فصلیں اگاتے ہیں"],
      documents: ["آدھار کارڈ", "بینک پاس بک", "زمین کا ریکارڈ"]
    },
    {
      id: "enam",
      name: "ای-نام (e-NAM)",
      icon: LineChart,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800",
      description: "زرعی مصنوعات کے لیے ایک آن لائن ٹریڈنگ پلیٹ فارم۔",
      eligibility: ["کسان", "تاجر"],
      documents: ["آدھار کارڈ", "بینک کی تفصیلات", "موبائل نمبر"]
    },
    {
      id: "pkvy",
      name: "پرمپراگت کرشی وکاس یوجنا (PKVY)",
      icon: Sprout,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
      description: "نامیاتی کھیتی کو فروغ دینے کے لیے مالی امداد کی اسکیم۔",
      eligibility: ["نامیاتی کھیتی کرنے والے کسان"],
      documents: ["آدھار کارڈ", "زمین کے کاغذات"]
    }
  ]
}

export default function SchemesPage({ language }: SchemesPageProps) {
  const t = translations[language] || translations.en
  const schemes = schemesData[language] || schemesData.en
  
  const [expandedId, setExpandedId] = useState<string | null>(schemes[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-10 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform transition-transform hover:scale-110 duration-500">
            <Landmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Schemes Grid (Accordions replaced with beautiful expanding cards) */}
        <div className="grid grid-cols-1 gap-8">
          {schemes.map((scheme, index) => {
            const Icon = scheme.icon
            const isExpanded = expandedId === scheme.id

            return (
              <Card 
                key={scheme.id} 
                className={`group border-transparent transition-all duration-500 ease-out animate-fade-in-up overflow-hidden shadow-lg hover:shadow-2xl bg-white dark:bg-card ${
                  isExpanded ? 'ring-2 ring-primary/40 scale-[1.01]' : 'hover:-translate-y-1'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Always Visible Header / Image area */}
                <div 
                  className="flex flex-col md:flex-row cursor-pointer"
                  onClick={() => toggleExpand(scheme.id)}
                >
                  {/* Image Section */}
                  <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img 
                      src={scheme.image} 
                      alt={scheme.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/40 md:to-transparent" />
                    <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Basic Info */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {scheme.name}
                      </h3>
                      <div className="bg-primary/10 p-2 rounded-full hidden md:block">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-primary transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                    <p className={`text-muted-foreground transition-all duration-300 ${isExpanded ? 'line-clamp-none mb-6' : 'line-clamp-2'}`}>
                      {scheme.description}
                    </p>
                    
                    {!isExpanded && (
                      <div className="text-primary font-semibold text-sm flex items-center gap-1 mt-4 md:mt-auto">
                        {t.viewDetails} <ChevronDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expandable Detailed Content */}
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[1000px] opacity-100 border-t border-border' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 md:p-8 md:ml-[33.333333%] bg-slate-50/50 dark:bg-muted/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Eligibility */}
                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-sm border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">{t.eligibility}</h4>
                        </div>
                        <ul className="space-y-3">
                          {scheme.eligibility.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documents */}
                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-sm border border-border/50 hover:border-accent/30 transition-colors">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                          <FileText className="w-5 h-5 text-accent" />
                          <h4 className="font-semibold text-foreground">{t.documents}</h4>
                        </div>
                        <ul className="space-y-3">
                          {scheme.documents.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

      </div>
    </div>
  )
}
