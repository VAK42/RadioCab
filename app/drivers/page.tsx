"use client"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { Search, Phone, CreditCard, User } from "lucide-react"
import Header from "../../components/header"
export default function DriversPage() {
  const [formData, setFormData] = useState({
    driverName: "",
    driverId: "",
    password: "",
    contactPerson: "",
    address: "",
    city: "",
    mobile: "",
    telephone: "",
    email: "",
    experience: "",
    description: "",
    paymentType: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const driverPrices = {
    monthly: 150000,
    quarterly: 400000,
  }
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }
  const handleReset = () => {
    setFormData({
      driverName: "",
      driverId: "",
      password: "",
      contactPerson: "",
      address: "",
      city: "",
      mobile: "",
      telephone: "",
      email: "",
      experience: "",
      description: "",
      paymentType: "",
    })
  }
  const getPrice = () => {
    if (!formData.paymentType) return 0
    return driverPrices[formData.paymentType as "monthly" | "quarterly"]
  }
  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 pageEnter">
      <Header />
      <section className="heroSection py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fadeInScale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Register & Search Drivers
          </h1>
          <p className="text-xl text-gray-700 dark:text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Register As A Taxi Driver Or Search For Experienced Drivers On The RadioCabs.In System
          </p>
        </div>
      </section>
      <section className="py-16 slideInRight">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-yellow-900/20 border border-yellow-500/30">
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Register Driver
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                Search Drivers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Register Taxi Driver</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-yellow-200">
                    Fill In Information To Register As A Taxi Driver
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Information
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="driverName" className="text-gray-700 dark:text-yellow-300">
                            Full Name *
                          </Label>
                          <Input
                            id="driverName"
                            value={formData.driverName}
                            onChange={(e) => handleInputChange("driverName", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="driverId" className="text-gray-700 dark:text-yellow-300">
                            Driver Code (Unique) *
                          </Label>
                          <Input
                            id="driverId"
                            value={formData.driverId}
                            onChange={(e) => handleInputChange("driverId", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-gray-700 dark:text-yellow-300">
                            Password *
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson" className="text-gray-700 dark:text-yellow-300">
                            Contact Person
                          </Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-gray-700 dark:text-yellow-300">
                            Address *
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-700 dark:text-yellow-300">
                            City *
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <Phone className="w-5 h-5" />
                          Contact & Experience
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-gray-700 dark:text-yellow-300">
                            Phone Number *
                          </Label>
                          <Input
                            id="mobile"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephone" className="text-gray-700 dark:text-yellow-300">
                            Landline Phone
                          </Label>
                          <Input
                            id="telephone"
                            value={formData.telephone}
                            onChange={(e) => handleInputChange("telephone", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience" className="text-gray-700 dark:text-yellow-300">
                            Experience (Years) *
                          </Label>
                          <Input
                            id="experience"
                            type="number"
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-gray-700 dark:text-yellow-300">
                            Self Description
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400 min-h-[100px]"
                            placeholder="Describe Your Experience, Driving Skills..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-yellow-500/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Payment Method
                          </h3>
                          <Select
                            value={formData.paymentType}
                            onValueChange={(value) => handleInputChange("paymentType", value)}
                          >
                            <SelectTrigger className="bg-black/50 border-yellow-500/50 text-yellow-100">
                              <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-yellow-500/50">
                              <SelectItem value="monthly" className="text-yellow-100">
                                Monthly
                              </SelectItem>
                              <SelectItem value="quarterly" className="text-yellow-100">
                                Quarterly
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.paymentType && (
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">Cost</h3>
                            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4 rounded-lg border border-yellow-500/30">
                              <p className="text-gray-700 dark:text-yellow-300 text-lg">
                                {formData.paymentType === "monthly" ? "Monthly" : "Quarterly"} Fee:
                                <span className="text-gray-900 dark:text-yellow-400 font-bold ml-2">
                                  {getPrice().toLocaleString("en-US")} VND
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                      >
                        Register
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-yellow-500/50 text-gray-700 dark:text-yellow-400 hover:bg-yellow-500/10 py-3 bg-transparent"
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="search">
              <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Search Drivers</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-yellow-200">
                    Search For Experienced Drivers Registered On The System
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-yellow-400 w-5 h-5" />
                        <Input
                          placeholder="Enter Driver Name, Driver Code, City Or Experience..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8">
                        Search
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">Search Results</h3>
                      <div className="text-gray-600 dark:text-yellow-200 text-center py-12 border border-yellow-500/30 rounded-lg bg-yellow-900/10">
                        <User className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4 opacity-50" />
                        <p>Enter Keywords To Search For Drivers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}