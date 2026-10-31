"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tractor, MapPin, Clock, Phone, PlusCircle, Search, ShieldCheck, X, MessageCircle, Minus, Plus, CheckCircle, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface MarketPageProps {
  language: "en" | "hi" | "ur" | "mr"
  user: any
}

const translations = {
  en: {
    title: "Community Market",
    subtitle: "Rent tractors, drones, and farming tools from farmers in your area",
    search: "Search equipment...",
    rentEquipment: "Rent Equipment",
    listEquipment: "List Your Equipment",
    pricePerHour: "₹/hour",
    pricePerDay: "₹/day",
    distance: "away",
    bookNow: "Contact Owner",
    verified: "Verified Owner",
    // Form
    addNew: "Add New Equipment",
    equipName: "Equipment Name",
    category: "Category",
    rate: "Rental Rate (₹)",
    rateType: "Rate Type",
    submitList: "List for Rent",
  },
  hi: {
    title: "सामुदायिक बाजार (Community Market)",
    subtitle: "अपने क्षेत्र के किसानों से ट्रैक्टर, ड्रोन और कृषि उपकरण किराए पर लें",
    search: "उपकरण खोजें...",
    rentEquipment: "उपकरण किराए पर लें",
    listEquipment: "अपना उपकरण सूचीबद्ध करें",
    pricePerHour: "₹/घंटा",
    pricePerDay: "₹/दिन",
    distance: "दूर",
    bookNow: "मालिक से संपर्क करें",
    verified: "सत्यापित मालिक",
    addNew: "नया उपकरण जोड़ें",
    equipName: "उपकरण का नाम",
    category: "श्रेणी",
    rate: "किराया दर (₹)",
    rateType: "दर का प्रकार",
    submitList: "किराए के लिए सूचीबद्ध करें",
  },
  mr: {
    title: "सामुदायिक बाजार (Community Market)",
    subtitle: "आपल्या परिसरातील शेतकऱ्यांकडून ट्रॅक्टर, ड्रोन आणि शेतीची अवजारे भाड्याने घ्या",
    search: "अवजारे शोधा...",
    rentEquipment: "अवजारे भाड्याने घ्या",
    listEquipment: "तुमची अवजारे नोंदवा",
    pricePerHour: "₹/तास",
    pricePerDay: "₹/दिवस",
    distance: "दूर",
    bookNow: "मालकाशी संपर्क साधा",
    verified: "सत्यापित मालक",
    addNew: "नवीन अवजार जोडा",
    equipName: "अवजाराचे नाव",
    category: "श्रेणी",
    rate: "भाडे दर (₹)",
    rateType: "दर प्रकार",
    submitList: "भाड्यासाठी नोंदवा",
  },
  ur: {
    title: "کمیونٹی مارکیٹ",
    subtitle: "اپنے علاقے کے کسانوں سے ٹریکٹر اور زراعت کے اوزار کرائے پر لیں",
    search: "تلاش کریں...",
    rentEquipment: "کرائے پر لیں",
    listEquipment: "اپنا اوزار درج کریں",
    pricePerHour: "₹/گھنٹہ",
    pricePerDay: "₹/دن",
    distance: "دور",
    bookNow: "مالک سے رابطہ کریں",
    verified: "تصدیق شدہ مالک",
    addNew: "نیا اوزار شامل کریں",
    equipName: "اوزار کا نام",
    category: "قسم",
    rate: "کرایہ کی شرح (₹)",
    rateType: "شرح کی قسم",
    submitList: "کرائے کے لیے درج کریں",
  }
}

const mockEquipment = [
  {
    id: 1,
    name: "Mahindra 575 DI Tractor",
    category: "Tractor",
    owner: "Ramesh Patil",
    distance: "2.5 km",
    rate: 500,
    rateType: "hour",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600",
    verified: true,
    phone: "+91 98765 43210",
    bookedDates: []
  },
  {
    id: 2,
    name: "Agriculture Spray Drone (10L)",
    category: "Drone",
    owner: "Suresh Kumar",
    distance: "5.1 km",
    rate: 1200,
    rateType: "hour",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600",
    verified: true,
    phone: "+91 91234 56789",
    bookedDates: ["2026-08-25", "2026-08-26"]
  },
  {
    id: 3,
    name: "Rotavator (7 feet)",
    category: "Implement",
    owner: "Ganesh Jadhav",
    distance: "1.2 km",
    rate: 300,
    rateType: "hour",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=600",
    verified: false,
    phone: "+91 99887 76655",
    bookedDates: ["2026-08-24", "2026-08-25", "2026-08-26"]
  },
  {
    id: 4,
    name: "Diesel Water Pump (5 HP)",
    category: "Irrigation",
    owner: "Vijay Singh",
    distance: "3.8 km",
    rate: 400,
    rateType: "day",
    image: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
    verified: true,
    phone: "+91 98765 11223",
    bookedDates: []
  },
  {
    id: 5,
    name: "My Heavy Duty Tractor",
    category: "Tractor",
    owner: "You",
    distance: "0 km",
    rate: 800,
    rateType: "day",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600",
    verified: true,
    phone: "+91 99999 00000",
    bookedDates: ["2026-08-26"],
    bookings: [
      {
        customerName: "Raju Farmer",
        customerPhone: "+91 88888 77777",
        date: "2026-08-26",
        duration: 2,
        paymentMethod: "Cash",
        totalAmount: 1600
      }
    ]
  }
]

function EquipmentCalendar({ bookedDates, selectedDate, onSelect }: { bookedDates: string[], selectedDate: string, onSelect: (date: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)
  
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  
  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} type="button" className="p-1 hover:bg-muted rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </span>
        <button onClick={nextMonth} type="button" className="p-1 hover:bg-muted rounded-full">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isBooked = bookedDates.includes(dateStr)
          const isSelected = selectedDate === dateStr
          const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0))
          const disabled = isBooked || isPast
          
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                isSelected ? 'bg-primary text-white font-bold' : 
                isBooked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' :
                isPast ? 'text-muted-foreground opacity-50 cursor-not-allowed' :
                'hover:bg-primary/20 text-foreground cursor-pointer'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MarketPage({ language, user }: MarketPageProps) {
  const t = translations[language] || translations.en
  const [equipment, setEquipment] = useState(mockEquipment)
  const [activeTab, setActiveTab] = useState<"rent" | "my_listings">("rent")
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null)
  const [modalType, setModalType] = useState<"contact" | "booking" | null>(null)
  const [rentDuration, setRentDuration] = useState<number>(1)
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "success">("details")
  const [bookingDate, setBookingDate] = useState("")
  const [globalSearchDate, setGlobalSearchDate] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Tractor",
    rateType: "hour",
    rate: "",
    condition: "Good",
    deposit: "",
    description: "",
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const urls = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...urls].slice(0, 5)) // Max 5 images
    }
  }
  
  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.rate) return

    const fallbackImage = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600"
    
    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      owner: user?.fullName || user?.name || "You",
      distance: (user?.latitude && user?.longitude) ? `Lat: ${user.latitude}, Lng: ${user.longitude}` : "0.0 km",
      rate: Number(formData.rate),
      rateType: formData.rateType,
      image: imagePreviews.length > 0 ? imagePreviews[0] : fallbackImage,
      images: imagePreviews.length > 0 ? imagePreviews : [fallbackImage],
      verified: true,
      phone: user?.mobile || "+91 99999 00000",
      bookedDates: [],
      bookings: [],
      condition: formData.condition,
      deposit: formData.deposit,
      description: formData.description
    }

    setEquipment([newItem, ...equipment])
    setShowAddForm(false)
    setFormData({ name: "", category: "Tractor", rateType: "hour", rate: "", condition: "Good", deposit: "", description: "" })
    setImagePreviews([])
  }

  const [filterCategory, setFilterCategory] = useState("All")
  const [filterMaxPrice, setFilterMaxPrice] = useState("")
  const [filterMaxDistance, setFilterMaxDistance] = useState("All")
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false)

  const filteredEquipment = equipment.filter(eq => {
    // 1. Search Query
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          eq.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    // 2. Category
    const matchesCategory = filterCategory === "All" || eq.category.toLowerCase() === filterCategory.toLowerCase()
    
    // 3. Price
    const matchesPrice = !filterMaxPrice || eq.rate <= Number(filterMaxPrice)
    
    // 4. Distance
    let matchesDistance = true
    if (filterMaxDistance !== "All") {
      const distNum = parseFloat(eq.distance)
      if (!isNaN(distNum)) {
        matchesDistance = distNum <= Number(filterMaxDistance)
      }
    }
    
    // 5. Verified
    const matchesVerified = !filterVerifiedOnly || eq.verified

    return matchesSearch && matchesCategory && matchesPrice && matchesDistance && matchesVerified
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-8 pb-20">
      
      {/* Hero Banner */}
      <div className="relative bg-primary/90 text-white overflow-hidden shadow-xl mb-10 h-80 md:h-96 flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586771107445-d3af8e35ef00?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fade-in-up">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-4">
              <Tractor className="w-4 h-4" /> Sharing Economy
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-4">{t.title}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">{t.subtitle}</p>
            
            {/* Airbnb Style Search Bar */}
            <div className="bg-white rounded-full p-2 flex items-center shadow-2xl text-foreground max-w-2xl">
              <div className="flex-1 px-6 py-2 border-r border-border hover:bg-muted/50 rounded-l-full cursor-text transition-colors">
                <label className="text-xs font-bold block mb-1">Equipment</label>
                <input 
                  type="text" 
                  placeholder="Tractor, Drone..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full outline-none text-sm bg-transparent" 
                />
              </div>
              <div className="flex-1 px-6 py-2 hover:bg-muted/50 cursor-text transition-colors relative">
                <label className="text-xs font-bold block mb-1">Date</label>
                <input 
                  type="date" 
                  value={globalSearchDate} 
                  onChange={(e) => setGlobalSearchDate(e.target.value)} 
                  className="w-full outline-none text-sm bg-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button 
                onClick={() => setActiveTab("rent")}
                className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full transition-all shadow-md ml-2"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white shadow-md p-1.5 rounded-full border border-border">
            <button
              onClick={() => setActiveTab("rent")}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === "rent" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.rentEquipment}
            </button>
            <button
              onClick={() => setActiveTab("my_listings")}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === "my_listings" ? "bg-accent text-white shadow-lg" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              My Listings
            </button>
          </div>
        </div>

        {/* RENT EQUIPMENT TAB */}
        {activeTab === "rent" && (
          <div className="animate-fade-in-up">
            
            {/* Advanced Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-border mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <div className="flex items-center gap-2 text-muted-foreground mr-2">
                  <Filter className="w-5 h-5" />
                  <span className="font-semibold text-sm">Filters:</span>
                </div>
                
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-muted/30 border border-border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                  <option value="All">All Categories</option>
                  <option value="Tractor">Tractors</option>
                  <option value="Harvester">Harvesters</option>
                  <option value="Drone">Drones</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Implement">Implements</option>
                </select>

                <select value={filterMaxDistance} onChange={(e) => setFilterMaxDistance(e.target.value)} className="bg-muted/30 border border-border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                  <option value="All">Any Distance</option>
                  <option value="5">Under 5 km</option>
                  <option value="10">Under 10 km</option>
                  <option value="20">Under 20 km</option>
                  <option value="50">Under 50 km</option>
                </select>

                <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50">
                  <span className="text-sm text-muted-foreground font-medium">Max ₹</span>
                  <input type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} placeholder="Any" className="bg-transparent w-16 text-sm outline-none font-bold text-primary" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors bg-muted/20 px-4 py-2 rounded-full border border-border">
                <input type="checkbox" checked={filterVerifiedOnly} onChange={(e) => setFilterVerifiedOnly(e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Verified Only
              </label>
            </div>

            {filteredEquipment.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-border mt-6">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">No Equipment Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query to find more items.</p>
                <Button 
                  onClick={() => {
                    setFilterCategory("All")
                    setFilterMaxDistance("All")
                    setFilterMaxPrice("")
                    setFilterVerifiedOnly(false)
                    setSearchQuery("")
                  }}
                  className="mt-6 rounded-full"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEquipment.map((item, idx) => {
                  const isBooked = globalSearchDate ? item.bookedDates.includes(globalSearchDate) : false;
                  
                  return (
                  <Card 
                    key={item.id} 
                    onClick={() => {
                      setSelectedEquipment(item)
                      setModalType("booking")
                      setRentDuration(1)
                      setCheckoutStep("details")
                      setBookingDate(globalSearchDate || "")
                    }}
                    className="cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border-0 bg-white shadow-md rounded-2xl flex flex-col" 
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="h-48 relative overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                          {item.category}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${!isBooked ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                          {!isBooked ? "Available" : "Booked"}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{item.distance} {t.distance}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4 bg-muted/50 p-2 rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-bold text-primary text-xs">{item.owner.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{item.owner}</p>
                            {item.verified && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <ShieldCheck className="w-3 h-3" /> {t.verified}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-foreground">₹{item.rate}</span>
                          <span className="text-sm text-muted-foreground">/{item.rateType === 'hour' ? t.pricePerHour.split('/')[1] : t.pricePerDay.split('/')[1]}</span>
                        </div>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEquipment(item)
                            setModalType("contact")
                          }}
                          className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all px-4"
                        >
                          {t.bookNow}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
            )}
          </div>
        )}

        {/* MY LISTINGS TAB */}
        {activeTab === "my_listings" && (
          <div className="animate-fade-in-up">
            {!showAddForm ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold font-heading text-foreground">My Dashboard</h2>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold px-6 shadow-md"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" /> Add New Equipment
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {equipment.filter(eq => eq.owner === (user?.fullName || user?.name || "You")).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-border">
                      <Tractor className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-foreground mb-2">No Equipment Listed</h3>
                      <p className="text-muted-foreground">List your unused equipment to start earning money.</p>
                    </div>
                  ) : (
                    equipment.filter(eq => eq.owner === (user?.fullName || user?.name || "You")).map(item => (
                      <Card key={item.id} className="overflow-hidden bg-white shadow-md border-0 rounded-2xl flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 md:h-auto relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold font-heading text-foreground">{item.name}</h3>
                              <p className="text-primary font-bold">₹{item.rate} / {item.rateType}</p>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                              {item.category}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 border border-border">
                            <h4 className="font-semibold text-sm mb-3">Booking History</h4>
                            {(!item.bookings || item.bookings.length === 0) ? (
                              <p className="text-sm text-muted-foreground">No bookings yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {item.bookings.map((booking: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-sm bg-white dark:bg-background p-3 rounded-lg border border-border shadow-sm">
                                    <div>
                                      <p className="font-bold text-foreground">{booking.customerName}</p>
                                      <p className="text-xs text-muted-foreground">{booking.date} • {booking.duration} {item.rateType}(s)</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-green-600">+₹{booking.totalAmount}</p>
                                      <p className="text-xs text-muted-foreground">{booking.paymentMethod}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto animate-slide-in-right">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAddForm(false)}
                  className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
                >
                  ← Back to Dashboard
                </Button>
                <Card className="p-8 shadow-xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <PlusCircle className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">{t.addNew}</h2>
                  </div>

                  <form onSubmit={handleListSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">{t.equipName}</label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Mahindra 575 DI Tractor" className="h-12 bg-white" required />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">{t.category}</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full h-12 px-3 border border-border rounded-md bg-white focus:ring-2 focus:ring-primary/50 outline-none">
                          <option value="Tractor">Tractor</option>
                          <option value="Harvester">Harvester</option>
                          <option value="Drone">Drone</option>
                          <option value="Irrigation">Irrigation</option>
                          <option value="Implements">Implements</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Condition</label>
                        <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full h-12 px-3 border border-border rounded-md bg-white focus:ring-2 focus:ring-primary/50 outline-none">
                          <option value="New">Like New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">{t.rateType}</label>
                        <select name="rateType" value={formData.rateType} onChange={handleInputChange} className="w-full h-12 px-3 border border-border rounded-md bg-white focus:ring-2 focus:ring-primary/50 outline-none">
                          <option value="hour">Per Hour</option>
                          <option value="day">Per Day</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">{t.rate}</label>
                        <Input name="rate" type="number" value={formData.rate} onChange={handleInputChange} placeholder="e.g. 500" className="h-12 bg-white" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Security Deposit (₹)</label>
                      <Input name="deposit" type="number" value={formData.deposit} onChange={handleInputChange} placeholder="Optional deposit amount" className="h-12 bg-white" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Description / Terms</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange as any} 
                        placeholder="Any important details the renter should know..." 
                        className="w-full h-24 p-3 border border-border rounded-xl bg-white focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Upload Photos (Max 5)</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-border group shadow-sm">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.length < 5 && (
                          <label className="border-2 border-dashed border-border rounded-xl h-24 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors">
                            <PlusCircle className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1 transition-all mt-6">
                      {t.submitList}
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden animate-scale-in max-h-[95vh] flex flex-col">
            <div className="relative h-56 flex-shrink-0 group">
              {selectedEquipment.images && selectedEquipment.images.length > 0 ? (
                <>
                  <img src={selectedEquipment.images[currentImageIndex]} alt={selectedEquipment.name} className="w-full h-full object-cover transition-all" />
                  
                  {selectedEquipment.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedEquipment.images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev === selectedEquipment.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5">
                        {selectedEquipment.images.map((_: any, i: number) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img src={selectedEquipment.image} alt={selectedEquipment.name} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              <button 
                onClick={() => {
                  setSelectedEquipment(null)
                  setCurrentImageIndex(0)
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{selectedEquipment.name}</h3>
                <p className="text-white/90 font-medium">₹{selectedEquipment.rate} / {selectedEquipment.rateType === 'hour' ? t.pricePerHour.split('/')[1] : t.pricePerDay.split('/')[1]}</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {modalType === "contact" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary text-xl">{selectedEquipment.owner.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{selectedEquipment.owner}</p>
                      {selectedEquipment.verified && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <ShieldCheck className="w-4 h-4" /> {t.verified}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground tracking-wide">{selectedEquipment.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a 
                      href={`tel:${selectedEquipment.phone}`}
                      className="flex-1 flex justify-center items-center gap-2 h-12 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                    >
                      <Phone className="w-5 h-5" /> Call
                    </a>
                    <a 
                      href={`https://wa.me/${selectedEquipment.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-colors shadow-md shadow-green-500/20"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {modalType === "booking" && checkoutStep === "details" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary text-xl">{selectedEquipment.owner.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{selectedEquipment.owner}</p>
                      {selectedEquipment.verified && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <ShieldCheck className="w-4 h-4" /> {t.verified}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* Date Picker */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                      <label className="text-sm font-semibold text-foreground mb-4 block">
                        Select Booking Date
                      </label>
                      <EquipmentCalendar 
                        bookedDates={selectedEquipment.bookedDates || []}
                        selectedDate={bookingDate}
                        onSelect={setBookingDate}
                      />
                    </div>

                    {/* Duration Counter */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-foreground">
                          Duration ({selectedEquipment.rateType === 'hour' ? 'Hours' : 'Days'})
                        </span>
                        <div className="flex items-center gap-4 bg-white border border-border rounded-full px-2 py-1 shadow-sm">
                          <button 
                            onClick={() => setRentDuration(Math.max(1, rentDuration - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center">{rentDuration}</span>
                          <button 
                            onClick={() => setRentDuration(rentDuration + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <span className="text-muted-foreground font-medium">Total Price</span>
                        <span className="text-2xl font-bold text-primary">₹{selectedEquipment.rate * rentDuration}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      if (!bookingDate) {
                        alert("Please select a booking date")
                        return
                      }
                      setCheckoutStep("payment")
                    }}
                    className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg transition-all"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}

              {modalType === "booking" && checkoutStep === "payment" && (
                <div className="animate-slide-in-right">
                  <h3 className="text-xl font-bold text-foreground mb-4">Payment Summary</h3>
                  
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Equipment</span>
                      <span className="font-medium text-foreground text-right">{selectedEquipment.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">{new Date(bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{rentDuration} {selectedEquipment.rateType}(s)</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-border/50">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{selectedEquipment.rate * rentDuration}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <label className="text-sm font-semibold text-foreground block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="border-2 border-primary bg-primary/5 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                        <span className="font-bold text-primary">UPI</span>
                      </button>
                      <button className="border border-border bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                        <span className="font-semibold text-foreground">Cash</span>
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      // Mark as booked for the selected date and add booking details
                      setEquipment(prev => prev.map(eq => 
                        eq.id === selectedEquipment.id 
                          ? { 
                              ...eq, 
                              bookedDates: [...(eq.bookedDates || []), bookingDate],
                              bookings: [...(eq.bookings || []), {
                                customerName: user?.fullName || user?.name || "New Customer",
                                customerPhone: user?.mobile || "+91 88888 88888",
                                date: bookingDate,
                                duration: rentDuration,
                                paymentMethod: "Cash / UPI",
                                totalAmount: eq.rate * rentDuration
                              }]
                            } 
                          : eq
                      ))
                      setCheckoutStep("success")
                    }}
                    className="w-full h-14 rounded-full text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/30 transition-all"
                  >
                    Pay ₹{selectedEquipment.rate * rentDuration} securely
                  </Button>
                </div>
              )}

              {modalType === "booking" && checkoutStep === "success" && (
                <div className="animate-scale-in text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mb-8">Your rental for {selectedEquipment.name} on {new Date(bookingDate).toLocaleDateString()} is confirmed.</p>
                  
                  <div className="flex gap-3">
                    <a 
                      href={`tel:${selectedEquipment.phone}`}
                      className="flex-1 flex justify-center items-center gap-2 h-12 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                    >
                      <Phone className="w-5 h-5" /> Call
                    </a>
                    <a 
                      href={`https://wa.me/${selectedEquipment.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedEquipment.owner)},%20I%20just%20booked%20your%20${encodeURIComponent(selectedEquipment.name)}%20for%20${rentDuration}%20${selectedEquipment.rateType}(s)%20on%20${bookingDate}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-colors shadow-md shadow-green-500/20"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
