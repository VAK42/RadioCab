"use client"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useRouter } from "next/navigation"
import { useLanguage } from "../components/languageContext"
import { Car, Search, MapPin, Calendar, Building2, Users, MessageSquare, Star, Shield, Clock, Check, Filter } from "lucide-react"
import Link from "next/link"
import apiService from "../lib/api"
function HeroSection() {
  const { t } = useLanguage()
  return (
    <section className="homepage relative py-8 sm:py-12 lg:py-16 overflow-hidden page-enter">
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi.png')",
          backgroundSize: "150% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/50 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <div className="container relative lg:ml-16 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[40vh] sm:min-h-[50vh]">
          <div className="heroSection space-y-4 sm:space-y-6 animate-slide-in-left flex flex-col justify-center text-center lg:text-left p-4 sm:p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-xl">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-balance leading-tight drop-shadow-lg text-black dark:text-white homepage-text">
                {t.heroTitle}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-foreground text-pretty max-w-lg font-medium leading-relaxed drop-shadow-md homepage-text">
                {t.heroSubtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/listing">
                <Button
                  size="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift w-full sm:w-auto transition-all duration-300"
                >
                  {t.registerCompany}
                </Button>
              </Link>
              <Link href="/drivers">
                <Button
                  size="default"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-glow bg-transparent w-full sm:w-auto transition-all duration-300"
                >
                  {t.registerDriver}
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:pl-20 animate-slide-in-right">
            <Card className="p-6 bg-card/80 backdrop-blur border-primary/30 hover-lift animate-glow bg-white/90 dark:bg-card/80">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">{t.searchPlaceholder}</h3>
                <div className="space-y-3">
                  <div className="relative animate-fade-in-up">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder={t.pickupPoint} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>
                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder={t.destination} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>
                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input type="datetime-local" placeholder={t.pickupTime} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {t.searchButton}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
function FeaturesSection() {
  const { t } = useLanguage()
  const features = [
    {
      icon: Building2,
      title: t.feature1Title,
      description: t.feature1Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: t.feature2Title,
      description: t.feature2Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: MessageSquare,
      title: t.feature3Title,
      description: t.feature3Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Star,
      title: t.feature4Title,
      description: t.feature4Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Shield,
      title: t.feature1Title,
      description: t.feature1Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      title: t.feature4Title,
      description: t.feature4Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]
  return (
    <section
      id="features"
      className="relative py-12 sm:py-16 lg:py-20 bg-background/50 bg-gradient-to-br from-yellow-100/80 via-yellow-200/80 to-yellow-300/80 dark:bg-background/50 overflow-hidden slide-in-left"
    >
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi2.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "10% center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.featuresTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.featuresSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-primary/20 bg-white/90 dark:bg-card/80 backdrop-blur hover-lift animate-fade-in-up hover-glow group card-transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 animate-float group-hover:animate-glow`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
function PartnersSection() {
  const { t } = useLanguage()
  const partners = [
    { name: "Vinasun", logo: "/taxiLogoVinaSun.jpg" },
    { name: "Mai Linh", logo: "/taxiLogoMaiLinh.jpg" },
    { name: "Taxi Group", logo: "/taxiGroupLogo.jpg" },
    { name: "Saigon Taxi", logo: "/taxiLogoSaigon.jpg" },
    { name: "Hanoi Taxi", logo: "/taxiLogoHanoi.jpg" },
    { name: "ABC Taxi", logo: "/taxiLogoAbc.jpg" },
    { name: "Vina Taxi", logo: "/taxiLogoVina.jpg" },
    { name: "Green Taxi", logo: "/taxiLogoGreen.jpg" },
  ]
  return (
    <section
      id="partners"
      className="relative py-20 bg-gradient-to-br from-yellow-100/70 via-yellow-200/70 to-yellow-300/70 dark:bg-muted/30 overflow-hidden fade-in-scale"
    >
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi4.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "10% center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />
      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance text-gray-900 dark:text-white">{t.partnersTitle}</h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.partnersSubtitle}
          </p>
        </div>
        <Card className="p-12 bg-white/90 dark:bg-card/50 backdrop-blur border-border/50 max-w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} Logo`}
                  className="h-24 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </Card>
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600 dark:text-muted-foreground">Taxi Companies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">10,000+</div>
            <div className="text-gray-600 dark:text-muted-foreground">Registered Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">1M+</div>
            <div className="text-gray-600 dark:text-muted-foreground">Searches Per Month</div>
          </div>
        </div>
      </div>
    </section>
  )
}
function TaxiVideoSection() {
  const { t } = useLanguage()
  return (
    <section className="relative py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 dark:bg-background/50 overflow-hidden fade-in-scale">
      <div className="container max-w-6xl mx-auto px-4 relative">
        <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.videoTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.videoSubtitle}
          </p>
        </div>
        <div className="relative -mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24">
          <div className="relative">
            <video
              className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/taxiVideo.mp4" type="video/mp4" />
              Your Browser Does Not Support Video
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur">
                <Car className="h-3 w-3 mr-1" />
                Professional Service
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-up">
          <Link href="/listing">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Register Taxi Company
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
function ModelPriceSection() {
  const router = useRouter()
  const [allModels, setAllModels] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [provinces, setProvinces] = useState<any[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>("all")
  const [selectedSeatCategory, setSelectedSeatCategory] = useState<string>("all")
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all")
  const [autoProvinceSet, setAutoProvinceSet] = useState<boolean>(false)
  const [currentProvinceName, setCurrentProvinceName] = useState<string>("")
  useEffect(() => {
    loadModels()
    loadProvinces()
  }, [])
  useEffect(() => {
    filterModels()
  }, [selectedProvince, selectedSeatCategory, selectedFuelType])
  const normalizeName = (s: string) => {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^tinh\s+/, '')
      .replace(/^tỉnh\s+/, '')
      .replace(/^thanh pho\s+/, '')
      .replace(/^thành phố\s+/, '')
      .trim()
  }
  useEffect(() => {
    const trySetFromSessionOrGeo = async () => {
      if (autoProvinceSet || provinces.length === 0) return
      try {
        const savedId = sessionStorage.getItem('currentProvinceId')
        const savedName = sessionStorage.getItem('currentProvinceName')
        if (savedId && provinces.some((p: any) => String(p.provinceId) === savedId)) {
          setSelectedProvince(savedId)
          if (savedName) setCurrentProvinceName(savedName)
          setAutoProvinceSet(true)
          return
        }
      } catch { }
      if (!('geolocation' in navigator)) return
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
          const data = await res.json().catch(() => ({}))
          const addr = data?.address || {}
          const nameRaw = addr.state || addr.province || addr.region || addr.county || addr.city || ""
          if (!nameRaw) { setAutoProvinceSet(true); return }
          const nameNorm = normalizeName(String(nameRaw))
          const match = provinces.find((p: any) => normalizeName(String(p.name || '')) === nameNorm)
          if (match?.provinceId) {
            const idStr = String(match.provinceId)
            setSelectedProvince(idStr)
            setCurrentProvinceName(match.name)
            try {
              sessionStorage.setItem('currentProvinceId', idStr)
              sessionStorage.setItem('currentProvinceName', match.name)
            } catch { }
          }
        } catch { }
        finally {
          setAutoProvinceSet(true)
        }
      }, () => {
        setAutoProvinceSet(true)
      })
    }
    trySetFromSessionOrGeo()
  }, [provinces, autoProvinceSet])
  const loadModels = async () => {
    try {
      setLoading(true)
      const response = await apiService.getModelPriceProvinces({ page: 1, pageSize: 100 })
      const items = (response.items || []).map((m: any) => {
        const img = m.model?.imageUrl
        const fixed = img && !String(img).startsWith('http') ? apiService.getFileUrl(`uploads/models/${img}`) : img
        return { ...m, model: m.model ? { ...m.model, imageUrl: fixed } : m.model }
      })
      setAllModels(items)
      setModels(items)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const loadProvinces = async () => {
    try {
      const response = await apiService.getProvinces({ page: 1, pageSize: 100 })
      const provincesList = response.items || response
      setProvinces(Array.isArray(provincesList) ? provincesList : [])
    } catch (error) {
      setProvinces([])
    }
  }
  const filterModels = () => {
    let filtered = [...allModels]
    if (selectedProvince !== "all") {
      filtered = filtered.filter(m => m.provinceId?.toString() === selectedProvince)
    }
    if (selectedSeatCategory !== "all") {
      filtered = filtered.filter(m => m.model?.seatCategory === selectedSeatCategory)
    }
    if (selectedFuelType !== "all") {
      filtered = filtered.filter(m => m.model?.fuelType === selectedFuelType)
    }
    setModels(filtered)
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  const seatCategories = Array.from(new Set(allModels.map(m => m.model?.seatCategory).filter(Boolean)))
  const fuelTypes = Array.from(new Set(allModels.map(m => m.model?.fuelType).filter(Boolean)))
  if (loading) {
    return (
      <section className="relative py-12 bg-background/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-lg">Loading Vehicle Models...</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section
      id="pricing-models"
      className="relative py-12 sm:py-16 lg:py-20 bg-background/50 bg-gradient-to-br from-yellow-100/80 via-yellow-200/80 to-yellow-300/80 dark:bg-background/50 overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Price List By Vehicle Model
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            View Detailed Pricing For Each Vehicle Type
          </p>
        </div>
        <div className="mb-8 animate-fade-in-up">
          <Card className="p-4 bg-white/90 dark:bg-card/80 backdrop-blur border-primary/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Filter className="h-4 w-4" />
                Filter By:
              </div>
              {currentProvinceName && (
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  Current Location: <span className="font-semibold">{currentProvinceName}</span>
                </div>
              )}
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {Array.isArray(provinces) && provinces.map((province: any) => (
                    <SelectItem key={province.provinceId} value={province.provinceId?.toString()}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeatCategory} onValueChange={setSelectedSeatCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Seat Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seat Capacities</SelectItem>
                  {seatCategories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  {fuelTypes.map((fuel: string) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {models.map((model: any) => (
            <Card
              key={model.modelPriceId}
              className="border-primary/20 bg-white/90 dark:bg-card/80 backdrop-blur hover-lift hover-glow cursor-pointer card-transition"
              onClick={() => setSelectedModel(model)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 dark:text-foreground">
                      {model.model?.brand ? `${model.model.brand} - ${model.model?.modelName || 'Not Updated'}` : (model.model?.modelName || 'Not Updated')}
                    </CardTitle>
                    {model.model?.company && (
                      <Link
                        href={`/company/public/${model.model.company.companyId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block mt-2 hover:underline"
                      >
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          <Building2 className="h-3 w-3 mr-1 inline" />
                          {model.model.company.name}
                        </Badge>
                      </Link>
                    )}
                    <Badge className="mt-2 bg-primary/20 text-primary">
                      {model.province?.name || 'Nationwide'}
                    </Badge>
                  </div>
                  <div className="w-20 h-14 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                    {model.model?.imageUrl ? (
                      <img src={model.model.imageUrl} alt={model.model?.modelName || 'Model'} className="w-full h-full object-cover" />
                    ) : (
                      <Car className="h-8 w-8 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-muted-foreground">Opening Fare:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(model.openingFare || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-muted-foreground">First 20Km Rate/Km:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(model.rateFirst20Km || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-muted-foreground">Over 20Km Rate/Km:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(model.rateOver20Km || 0)}
                    </span>
                  </div>
                  {model.intercityRatePerKm && model.intercityRatePerKm > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-muted-foreground">Intercity Rate/Km:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(model.intercityRatePerKm)}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    sessionStorage.setItem('selectedModelPrice', JSON.stringify(model))
                    router.push('/book')
                  }}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Price Details: {selectedModel?.model?.brand ? `${selectedModel.model.brand} - ` : ''}{selectedModel?.model?.modelName}
              </DialogTitle>
            </DialogHeader>
            {selectedModel && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Province</p>
                    <p className="font-semibold text-lg">{selectedModel.province?.name || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Vehicle Model</p>
                    <p className="font-semibold text-lg">{selectedModel.model?.modelName || 'N/A'}</p>
                  </div>
                </div>
                {selectedModel.model?.company && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">Service Provider</p>
                    <Link
                      href={`/company/public/${selectedModel.model.company.companyId}`}
                      className="inline-block"
                    >
                      <Badge className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                        <Building2 className="h-3 w-3 mr-1 inline" />
                        {selectedModel.model.company.name}
                      </Badge>
                    </Link>
                  </div>
                )}
                {!selectedModel.model?.company && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      No Company Information Available
                    </p>
                  </div>
                )}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">Detailed Pricing:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Opening Fare:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(selectedModel.openingFare || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>First 20Km Rate/Km:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(selectedModel.rateFirst20Km || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Over 20Km Rate/Km:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(selectedModel.rateOver20Km || 0)}
                      </span>
                    </div>
                    {selectedModel.trafficAddPerKm && selectedModel.trafficAddPerKm > 0 && (
                      <div className="flex justify-between">
                        <span>Traffic Surcharge/Km:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(selectedModel.trafficAddPerKm)}
                        </span>
                      </div>
                    )}
                    {selectedModel.intercityRatePerKm && selectedModel.intercityRatePerKm > 0 && (
                      <div className="flex justify-between">
                        <span>Intercity Rate/Km:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(selectedModel.intercityRatePerKm)}
                        </span>
                      </div>
                    )}
                    {selectedModel.rainAddPerTrip && selectedModel.rainAddPerTrip > 0 && (
                      <div className="flex justify-between">
                        <span>Rain Surcharge/Trip:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(selectedModel.rainAddPerTrip)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedModel.model?.description && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="font-semibold mb-2">Description:</h3>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                      {selectedModel.model.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
function HomePageContent() {
  return (
    <div className="min-h-screen gradient-radial-yellow bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:gradient-radial-yellow">
      <main className="relative overflow-hidden" id="main-content">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-1/4 w-40 h-40 bg-primary/5 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <HeroSection />
        <ModelPriceSection />
        <FeaturesSection />
        <TaxiVideoSection />
        <PartnersSection />
      </main>
    </div>
  )
}
export default function HomePage() {
  return <HomePageContent />
}