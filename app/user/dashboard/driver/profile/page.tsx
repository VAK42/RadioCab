"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Badge } from "../../../../../components/ui/badge"
import { User, MapPin, Save, Upload, Car, CheckCircle, AlertTriangle, Star } from "lucide-react"
import type { Driver, City } from "../../../../../lib/types/database"
export default function DriverProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Driver>>({
    driverId: 1,
    driverCode: "DRV001",
    userId: 1,
    name: "Nguyen Van A",
    addressLine: "123 ABC Street, District 1, HCMC",
    cityId: 1,
    phone: "0123-456-789",
    telephone: "028-1234-5678",
    email: "nguyenvana@email.com",
    experienceYears: 5,
    avatarUrl: "",
    licenseNumber: "123456789",
    licenseType: "B2",
    licenseExpiry: new Date("2029-12-31"),
    vehicleType: "Sedan",
    vehicleModel: "Toyota Camry 2020",
    vehiclePlate: "51A-12345",
    rating: 4.8,
    totalRides: 1247,
    totalDistance: 12500.5,
    isAvailable: true,
    languages: ["Vietnamese", "Basic English"],
    specialties: ["Airport Taxi", "City Taxi", "Tour Taxi"]
  })
  const cities: City[] = [
    {
      cityId: 1, stateId: 1, code: "Q1", name: "District 1",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 2, stateId: 1, code: "Q2", name: "District 2",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 3, stateId: 1, code: "Q3", name: "District 3",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 4, stateId: 2, code: "BD", name: "Ba Dinh",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 5, stateId: 2, code: "HK", name: "Hoan Kiem",
      countryId: 0,
      status: "active"
    }
  ]
  const licenseTypes = [
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ]
  const vehicleTypes = [
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "MPV", label: "MPV" },
    { value: "Hatchback", label: "Hatchback" }
  ]
  const availableLanguages = [
    "Vietnamese",
    "Basic English",
    "Fluent English",
    "Basic Chinese",
    "Basic Japanese",
    "Basic Korean"
  ]
  const availableSpecialties = [
    "Airport Taxi",
    "City Taxi",
    "Tour Taxi",
    "Hourly Taxi",
    "Long Distance Taxi",
    "Trip Taxi"
  ]
  const handleInputChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  const handleArrayChange = (field: 'languages' | 'specialties', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] || []
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        }
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        }
      }
    })
  }
  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Driver Profile</h1>
          <p className="text-muted-foreground mt-2">
            Update Personal Information According To Database Standards
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <User className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload Portrait Photo To Display On Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={!isEditing}>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG Or GIF. Maximum 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Basic Information About Yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="driverCode">Driver Code</Label>
              <Input
                id="driverCode"
                value={formData.driverCode || ""}
                onChange={(e) => handleInputChange("driverCode", e.target.value)}
                disabled={!isEditing}
                placeholder="DRV001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter Full Name"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="0123-456-789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Landline Phone</Label>
              <Input
                id="telephone"
                value={formData.telephone || ""}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                disabled={!isEditing}
                placeholder="028-1234-5678"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityId">City *</Label>
              <Select
                value={formData.cityId?.toString()}
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("cityId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.cityId} value={city.cityId.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine">Detailed Address *</Label>
            <Textarea
              id="addressLine"
              value={formData.addressLine || ""}
              onChange={(e) => handleInputChange("addressLine", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter Detailed Address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Information About Driving Experience And Skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Driving Experience (Years) *</Label>
              <Input
                id="experienceYears"
                type="number"
                value={formData.experienceYears || ""}
                onChange={(e) => handleInputChange("experienceYears", parseInt(e.target.value))}
                disabled={!isEditing}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber || ""}
                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                disabled={!isEditing}
                placeholder="123456789"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="licenseType">License Type *</Label>
              <Select
                value={formData.licenseType || ""}
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("licenseType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select License Type" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry ? formData.licenseExpiry.toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("licenseExpiry", new Date(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>
            Information About Vehicle Used For Service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={formData.vehicleType || ""}
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("vehicleType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model *</Label>
              <Input
                id="vehicleModel"
                value={formData.vehicleModel || ""}
                onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                disabled={!isEditing}
                placeholder="Toyota Camry 2020"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehiclePlate">License Plate *</Label>
            <Input
              id="vehiclePlate"
              value={formData.vehiclePlate || ""}
              onChange={(e) => handleInputChange("vehiclePlate", e.target.value)}
              disabled={!isEditing}
              placeholder="51A-12345"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills And Expertise</CardTitle>
          <CardDescription>
            Skills And Services You Can Provide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Languages</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {availableLanguages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`lang-${lang}`}
                    checked={formData.languages?.includes(lang) || false}
                    onChange={(e) => handleArrayChange("languages", lang, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`lang-${lang}`} className="text-sm">{lang}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Label>Specialties</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {availableSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`spec-${specialty}`}
                    checked={formData.specialties?.includes(specialty) || false}
                    onChange={(e) => handleArrayChange("specialties", specialty, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`spec-${specialty}`} className="text-sm">{specialty}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
          <CardDescription>
            Information About Work Performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.rating}/5.0</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Car className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.totalRides}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.totalDistance}Km</div>
              <div className="text-sm text-muted-foreground">Total Distance</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile Status</CardTitle>
          <CardDescription>
            Information About Profile Display Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {formData.isAvailable ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h4 className="font-medium">
                  {formData.isAvailable ? 'Ready To Accept Trips' : 'Activity Paused'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.isAvailable
                    ? 'Your Profile Is Displayed And Can Accept Trips'
                    : 'Your Profile Is Temporarily Not Accepting New Trips'
                  }
                </p>
              </div>
            </div>
            <Badge
              variant={formData.isAvailable ? "default" : "secondary"}
              className={formData.isAvailable ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {formData.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}