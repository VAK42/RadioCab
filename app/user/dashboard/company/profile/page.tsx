"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Badge } from "../../../../../components/ui/badge"
import { Building2, Save, Upload, CheckCircle, AlertTriangle } from "lucide-react"
import type { Company, City, MembershipType } from "../../../../../lib/types/database"
export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Company>>({
    companyId: 1,
    companyCode: "CAB001",
    name: "ABC Taxi Company",
    contactPerson: "Nguyen Van A",
    designation: "Director",
    addressLine: "123 ABC Street, District 1, HCMC",
    cityId: 1,
    mobile: "0123-456-789",
    telephone: "028-1234-5678",
    faxNumber: "028-1234-5679",
    email: "contact@abctaxi.com",
    membershipTypeId: 1,
    ownerUserId: 2,
    status: "active",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-12-20")
  })
  const cities: City[] = [
    {
      cityId: 1, stateId: 1, name: "Mumbai",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 2, stateId: 2, name: "New Delhi",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 3, stateId: 3, name: "Bengaluru",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 4, stateId: 4, name: "Chennai",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 5, stateId: 5, name: "Kolkata",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 6, stateId: 6, name: "Hyderabad",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 7, stateId: 1, name: "Pune",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 8, stateId: 8, name: "Jaipur",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 9, stateId: 7, name: "Ahmedabad",
      countryId: 0,
      status: "active"
    },
    {
      cityId: 10, stateId: 1, name: "Nagpur",
      countryId: 0,
      status: "active"
    }
  ]
  const membershipTypes: MembershipType[] = [
    {
      membershipTypeId: 1, code: "premium", name: "Premium",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    },
    {
      membershipTypeId: 2, code: "basic", name: "Basic",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    },
    {
      membershipTypeId: 3, code: "free", name: "Free",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    }
  ]
  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <h1 className="text-3xl font-bold text-foreground">Edit Company Profile</h1>
          <p className="text-muted-foreground mt-2">
            Update Company Information According To Database Standards
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
              <Building2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
      {formData.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Profile Pending Approval</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Your Profile Is Awaiting Verification From The Admin Team. Please Ensure Information Is Accurate And Complete.
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload Company Logo To Display On Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={!isEditing}>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Logo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG Or SVG. Maximum 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Main Information About Your Company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                value={formData.companyCode || ""}
                onChange={(e) => handleInputChange("companyCode", e.target.value)}
                disabled={!isEditing}
                placeholder="ABC001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter Company Name"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter Contact Person Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation || ""}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                disabled={!isEditing}
                placeholder="Director, Manager..."
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Phone Number *</Label>
              <Input
                id="mobile"
                value={formData.mobile || ""}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
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
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faxNumber">Fax Number</Label>
              <Input
                id="faxNumber"
                value={formData.faxNumber || ""}
                onChange={(e) => handleInputChange("faxNumber", e.target.value)}
                disabled={!isEditing}
                placeholder="028-1234-5679"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="membershipTypeId">Membership Type</Label>
              <Select
                value={formData.membershipTypeId?.toString()}
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("membershipTypeId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Membership Type" />
                </SelectTrigger>
                <SelectContent>
                  {membershipTypes.map((type) => (
                    <SelectItem key={type.membershipTypeId} value={type.membershipTypeId.toString()}>
                      {type.name}
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || ""}
              disabled={!isEditing}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
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
              {formData.status === 'active' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h4 className="font-medium">
                  {formData.status === 'active' ? 'Profile Is Active' : 'Profile Pending Verification'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.status === 'active'
                    ? 'Your Profile Is Currently Displayed On The Website'
                    : 'Your Profile Is Being Reviewed By The Admin Team'
                  }
                </p>
              </div>
            </div>
            <Badge
              variant={formData.status === 'active' ? "default" : "secondary"}
              className={formData.status === 'active' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {formData.status === 'active' ? 'Active' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}