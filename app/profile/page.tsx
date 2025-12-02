"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { User, CreditCard, Bell, Settings, Edit, Save, X, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { getCurrentUser } from "../../lib/auth"
import { apiService } from "../../lib/api"
import { Badge } from "../../components/ui/badge"
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    role: "",
    joinDate: "",
    status: "active"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [drivingOrders, setDrivingOrders] = useState<any[]>([])
  const [membershipOrders, setMembershipOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({})
  const [changingPassword, setChangingPassword] = useState(false)
  useEffect(() => {
    const loadUserData = async () => {
      const user = getCurrentUser()
      if (user) {
        setCurrentUser(user)
        setProfileData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: '',
          company: user.companyName || '',
          role: user.role || '',
          joinDate: '',
          status: 'active'
        })
        if (user.role === 'CUSTOMER' && user.id) {
          await loadCustomerDrivingOrders(parseInt(user.id))
        }
        if (user.role === 'MANAGER' && user.companyId) {
          await loadMembershipOrders(user.companyId)
        }
      }
    }
    loadUserData()
  }, [])
  const loadCustomerDrivingOrders = async (customerId: number) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/drivingorders/customer/${customerId}?pageSize=100`) as any
      setDrivingOrders(response.items || [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const loadMembershipOrders = async (companyId: number) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/membershiporders?companyId=${companyId}&pageSize=100`) as any
      setMembershipOrders(response.items || [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }
  const handleSave = () => {
    setSuccess("Information Has Been Updated Successfully!")
    setIsEditing(false)
    setTimeout(() => setSuccess(""), 3000)
  }
  const handleCancel = () => {
    setIsEditing(false)
    setError("")
  }
  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Please Enter Current Password'
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Please Enter New Password'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password Does Not Match'
    }
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return
    }
    try {
      setChangingPassword(true)
      await apiService.post('/accounts/change-password', {
        accountId: currentUser.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      alert('Password Changed Successfully!')
      setIsChangePasswordOpen(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordErrors({})
    } catch (error: any) {
      alert(`${error.message || 'Password Change Failed'}`)
    } finally {
      setChangingPassword(false)
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending Approval
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }
  const getOrderStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'NEW': 'bg-blue-100 text-blue-800',
      'ASSIGNED': 'bg-yellow-100 text-yellow-800',
      'ONGOING': 'bg-purple-100 text-purple-800',
      'DONE': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(amount)
  }
  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 pageEnter">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fadeInScale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Personal Page
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage Your Personal Information And Account
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16 slideInLeft">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-yellow-900/20 border border-yellow-500/30">
                <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Personal Information
                          </CardTitle>
                          {!isEditing ? (
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              className="border-yellow-500/50 text-primary hover:bg-yellow-500/10"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-red-500/50 text-red-600 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {success && (
                          <Alert className="bg-green-900/20 border-green-500/50 mb-4">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>{success}</AlertDescription>
                          </Alert>
                        )}
                        {error && (
                          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-gray-700 dark:text-yellow-300">
                                Full Name
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="fullName"
                                  value={profileData.fullName}
                                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.fullName}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
                                Email
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => handleInputChange("email", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-gray-700 dark:text-yellow-300">
                                Phone Number
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                                  onChange={(e) => handleInputChange("phone", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.phone}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company" className="text-gray-700 dark:text-yellow-300">
                                Company
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="company"
                                  value={profileData.company}
                                  onChange={(e) => handleInputChange("company", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.company}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700 dark:text-yellow-300">
                              Address
                            </Label>
                            {isEditing ? (
                              <Input
                                id="address"
                                value={profileData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.address}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900 dark:text-yellow-400">
                          Account Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Status</span>
                          {getStatusBadge(profileData.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Account Type</span>
                          <span className="text-gray-900 dark:text-yellow-400 font-medium capitalize">{profileData.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Join Date</span>
                          <span className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.joinDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <Settings className="w-6 h-6" />
                          Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full justify-start" variant="outline">
                          <Bell className="w-4 h-4 mr-2" />
                          Notifications
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => setIsChangePasswordOpen(true)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      {currentUser?.role === 'CUSTOMER' ? 'My Orders' : 'Membership Orders'}
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      {currentUser?.role === 'CUSTOMER'
                        ? 'History Of Rides You Have Booked'
                        : 'Company Membership Order History'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-yellow-200">Loading Data...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentUser?.role === 'CUSTOMER' && (
                          <>
                            {drivingOrders.length === 0 ? (
                              <p className="text-center py-8 text-gray-600 dark:text-yellow-200">
                                You Have No Orders Yet
                              </p>
                            ) : (
                              drivingOrders.map((order: any) => (
                                <Card key={order.orderId} className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-semibold text-gray-900 dark:text-yellow-400">
                                            Order #{order.orderId}
                                          </span>
                                          {getOrderStatusBadge(order.status)}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Order Code:</span> {order.orderId}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Driver:</span> {order.driver?.fullName || 'Not Assigned'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">License Plate:</span> {order.vehicle?.plateNumber || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Vehicle Model:</span> {order.vehicle?.vehicleModel?.modelName || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Pickup Location:</span> {order.pickupAddress || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Destination:</span> {order.dropoffAddress || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200">
                                          <span className="font-medium">Total Amount:</span> {formatCurrency(order.totalAmount || 0)}
                                        </p>
                                        {order.pickupTime && (
                                          <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
                                            {new Date(order.pickupTime).toLocaleString('en-US')}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </>
                        )}
                        {currentUser?.role === 'MANAGER' && (
                          <>
                            {membershipOrders.length === 0 ? (
                              <p className="text-center py-8 text-gray-600 dark:text-yellow-200">
                                Company Has No Membership Orders Yet
                              </p>
                            ) : (
                              membershipOrders.map((order: any) => (
                                <Card key={order.membershipOrderId} className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-semibold text-gray-900 dark:text-yellow-400">
                                            Membership Order #{order.membershipOrderId}
                                          </span>
                                          <Badge>{order.status}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200 mb-1">
                                          <span className="font-medium">Package:</span> {order.membershipPlanName || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-yellow-200">
                                          <span className="font-medium">Total Amount:</span> {formatCurrency(order.totalAmount || 0)}
                                        </p>
                                        {order.createdAt && (
                                          <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
                                            {new Date(order.createdAt).toLocaleString('en-US')}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Please Enter Current Password And New Password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter Current Password"
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm">{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter New Password"
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm">{passwordErrors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Re-Enter New Password"
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm">{passwordErrors.confirmPassword}</p>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangePasswordOpen(false)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordErrors({})
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {changingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}