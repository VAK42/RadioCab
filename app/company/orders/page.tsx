"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { FileText, Search, Plus, Eye, MapPin, Clock, DollarSign, User, XCircle, Filter, X, UserPlus, Ban } from "lucide-react"
import { getCurrentUser } from "../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import DriverAssignMapDialog from "../../../components/driverAssignMapDialog"
export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(false)
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [vehicleModels, setVehicleModels] = useState<any[]>([])
  const [orderFormData, setOrderFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    fromProvinceId: '',
    toProvinceId: '',
    modelId: '',
    totalKm: '',
    innerCityKm: '',
    intercityKm: ''
  })
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null)
  const [filters, setFilters] = useState({
    orderSearch: '',
    driverSearch: '',
    addressSearch: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      loadOrders(user.companyId)
      loadProvinces()
      loadVehicleModels(user.companyId)
    } else {
      setError("Company Information Not Found")
      setLoading(false)
    }
  }, [])
  const loadProvinces = async () => {
    try {
      const response = await apiService.getProvinces({ page: 1, pageSize: 1000 })
      const provincesData = response?.data?.items || response?.items || []
      setProvinces(provincesData)
    } catch (error: any) {
    }
  }
  const loadVehicleModels = async (companyId: number) => {
    try {
      const response = await apiService.getVehicleModels({ companyId, page: 1, pageSize: 1000 })
      const modelsData = response?.data?.items || response?.items || []
      setVehicleModels(modelsData.filter((m: any) => m.isActive))
    } catch (error: any) {
    }
  }
  const loadOrders = async (companyId: number) => {
    try {
      setLoading(true)
      const response = await apiService.getDrivingOrders({ companyId })
      const ordersData = response?.data?.items || response?.items || []
      setOrders(ordersData)
    } catch (error: any) {
      setError(`Error Loading Orders: ${error.message || 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }
  const filteredOrders = orders.filter(order => {
    if (filters.orderSearch) {
      const orderSearchLower = filters.orderSearch.toLowerCase()
      const orderIdMatch = order.orderId.toString().includes(orderSearchLower)
      if (!orderIdMatch) return false
    }
    if (filters.driverSearch) {
      const driverSearchLower = filters.driverSearch.toLowerCase()
      const driverIdMatch = order.driverAccountId?.toString().includes(driverSearchLower) || false
      if (!driverIdMatch) return false
    }
    if (filters.addressSearch) {
      const addressSearchLower = filters.addressSearch.toLowerCase()
      const pickupMatch = (order.pickupAddress || '').toLowerCase().includes(addressSearchLower)
      const dropoffMatch = (order.dropoffAddress || '').toLowerCase().includes(addressSearchLower)
      if (!pickupMatch && !dropoffMatch) return false
    }
    if (filters.status && order.status !== filters.status) {
      return false
    }
    if (filters.startDate || filters.endDate) {
      const orderDate = new Date(order.createdAt)
      if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        if (orderDate < startDate) return false
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        if (orderDate > endDate) return false
      }
    }
    if (filters.minAmount || filters.maxAmount) {
      const amount = order.totalAmount || 0
      if (filters.minAmount) {
        const minAmount = parseFloat(filters.minAmount)
        if (amount < minAmount) return false
      }
      if (filters.maxAmount) {
        const maxAmount = parseFloat(filters.maxAmount)
        if (amount > maxAmount) return false
      }
    }
    return true
  })
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }
  const clearFilters = () => {
    setFilters({
      orderSearch: '',
      driverSearch: '',
      addressSearch: '',
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    })
  }
  const hasActiveFilters = Object.values(filters).some(value => value !== '')
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { label: "New", color: "bg-blue-100 text-blue-800" },
      ASSIGNED: { label: "Assigned", color: "bg-yellow-100 text-yellow-800" },
      ONGOING: { label: "Ongoing", color: "bg-orange-100 text-orange-800" },
      COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      FAILED: { label: "Failed", color: "bg-gray-100 text-gray-800" }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: "bg-gray-100 text-gray-800" }
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US')
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }
  const handleAssignDriver = async (order: any) => {
    setSelectedOrder(order)
    setIsAssignDialogOpen(true)
    await loadAvailableSchedules(order.companyId, order.modelId)
  }
  const loadAvailableSchedules = async (companyId: number, modelId: number) => {
    try {
      setLoadingSchedules(true)
      const response = await apiService.getDriverSchedules({ companyId, page: 1, pageSize: 100 })
      const schedules = response?.data?.items || response?.items || []
      const now = new Date()
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const activeSchedules = schedules.filter((schedule: any) => {
        const workDate = schedule.workDate.split('T')[0].split(' ')[0]
        const matchesDate = workDate === today
        const matchesStatus = schedule.status === 'ON' || schedule.status === 'PLANNED'
        const matchesModel = schedule.vehicle?.modelId === modelId
        return matchesDate && matchesStatus && matchesModel
      })
      setAvailableSchedules(activeSchedules)
    } catch (error: any) {
      setError(`Error Loading Driver Schedules: ${error.message || 'Unknown'}`)
    } finally {
      setLoadingSchedules(false)
    }
  }
  const handleSelectDriver = async (schedule: any) => {
    if (!selectedOrder) return
    if (!schedule.vehicleId) {
      alert('This Driver Has No Assigned Vehicle. Please Select Another Driver.')
      return
    }
    if (!schedule.scheduleId) {
      alert('Error: Driver Schedule Not Found')
      return
    }
    try {
      setLoading(true)
      await apiService.post(`/drivingorders/${selectedOrder.orderId}/assign-driver`, {
        driverId: schedule.driverAccountId,
        vehicleId: schedule.vehicleId,
        driverScheduleId: schedule.scheduleId
      })
      alert(`${selectedOrder.status === 'ASSIGNED' ? 'Changed' : 'Assigned'} Driver ${schedule.driver?.fullName || schedule.driverAccountId} Successfully!`)
      setIsAssignDialogOpen(false)
      await loadOrders(currentUser?.companyId)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Assign Driver'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleCancelOrder = async (order: any) => {
    const reason = prompt(`Are You Sure You Want To Cancel Order #${order.orderId}?\n\nPlease Enter Cancellation Reason:`)
    if (!reason) {
      return
    }
    try {
      setLoading(true)
      await apiService.cancelDrivingOrder(order.orderId, reason)
      await loadOrders(currentUser?.companyId)
    } catch (error: any) {
      setError(`Error Canceling Order: ${error.message || 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }
  const shouldShowAssignButton = (status: string) => {
    return ['NEW', 'ASSIGNED'].includes(status)
  }
  const shouldShowCancelButton = (status: string) => {
    return ['ASSIGNED', 'ONGOING'].includes(status)
  }
  const getAssignButtonLabel = (status: string) => {
    return status === 'ASSIGNED' ? 'Change Driver' : 'Assign Driver'
  }
  useEffect(() => {
    if (orderFormData.modelId && (orderFormData.totalKm || orderFormData.innerCityKm || orderFormData.intercityKm)) {
      calculateOrderPrice()
    }
  }, [orderFormData.modelId, orderFormData.totalKm, orderFormData.innerCityKm, orderFormData.intercityKm])
  const calculateOrderPrice = async () => {
    if (!orderFormData.modelId || !orderFormData.fromProvinceId) {
      setCalculatedPrice(null)
      return
    }
    try {
      const priceResponse = await apiService.getModelPriceProvinces({ page: 1, pageSize: 100 })
      const prices = priceResponse?.data?.items || priceResponse?.items || []
      const modelPrice = prices.find((p: any) =>
        p.modelId === parseInt(orderFormData.modelId) &&
        p.provinceId === parseInt(orderFormData.fromProvinceId) &&
        p.isActive
      )
      if (!modelPrice) {
        setCalculatedPrice(null)
        return
      }
      const totalKm = parseFloat(orderFormData.totalKm) || 0
      const innerCityKm = parseFloat(orderFormData.innerCityKm) || 0
      const intercityKm = parseFloat(orderFormData.intercityKm) || 0
      let baseFare = modelPrice.openingFare
      if (totalKm <= 20) {
        baseFare += totalKm * modelPrice.rateFirst20Km
      } else {
        baseFare += 20 * modelPrice.rateFirst20Km
        baseFare += (totalKm - 20) * modelPrice.rateOver20Km
      }
      let intercityFee = 0
      if (intercityKm > 0) {
        intercityFee = intercityKm * modelPrice.intercityRatePerKm
      }
      const totalAmount = baseFare + intercityFee
      setCalculatedPrice({
        baseFare: modelPrice.openingFare,
        rateFirst20Km: modelPrice.rateFirst20Km,
        rateOver20Km: modelPrice.rateOver20Km,
        intercityRatePerKm: modelPrice.intercityRatePerKm,
        calculatedBaseFare: baseFare,
        intercityFee,
        totalAmount
      })
    } catch (error: any) {
      setCalculatedPrice(null)
    }
  }
  const handleAddOrder = async () => {
    if (!orderFormData.pickupAddress || !orderFormData.dropoffAddress ||
      !orderFormData.fromProvinceId || !orderFormData.toProvinceId ||
      !orderFormData.modelId || !orderFormData.totalKm) {
      alert('Please Fill In All Required Fields')
      return
    }
    try {
      setLoading(true)
      const priceResponse = await apiService.getModelPriceProvinces({ page: 1, pageSize: 100 })
      const prices = priceResponse?.data?.items || priceResponse?.items || []
      const modelPrice = prices.find((p: any) =>
        p.modelId === parseInt(orderFormData.modelId) &&
        p.provinceId === parseInt(orderFormData.fromProvinceId) &&
        p.isActive
      )
      if (!modelPrice) {
        alert('Price Model Not Found For Selected Model And Province. Please Check Again.')
        setLoading(false)
        return
      }
      const totalKm = parseFloat(orderFormData.totalKm)
      const innerCityKm = parseFloat(orderFormData.innerCityKm) || 0
      const intercityKm = parseFloat(orderFormData.intercityKm) || 0
      let baseFare = modelPrice.openingFare
      if (totalKm <= 20) {
        baseFare += totalKm * modelPrice.rateFirst20Km
      } else {
        baseFare += 20 * modelPrice.rateFirst20Km
        baseFare += (totalKm - 20) * modelPrice.rateOver20Km
      }
      const intercityFee = intercityKm > 0 ? intercityKm * modelPrice.intercityRatePerKm : 0
      const totalAmount = baseFare + intercityFee
      const orderData = {
        companyId: currentUser?.companyId,
        pickupAddress: orderFormData.pickupAddress,
        dropoffAddress: orderFormData.dropoffAddress,
        fromProvinceId: parseInt(orderFormData.fromProvinceId),
        toProvinceId: parseInt(orderFormData.toProvinceId),
        modelId: parseInt(orderFormData.modelId),
        priceRefId: modelPrice.modelPriceId,
        totalKm: totalKm,
        innerCityKm: innerCityKm,
        intercityKm: intercityKm,
        baseFare: baseFare,
        intercityUnitPrice: modelPrice.intercityRatePerKm,
        intercityFee: intercityFee,
        totalAmount: totalAmount
      }
      await apiService.post('/drivingorders', orderData)
      alert('Order Created Successfully!')
      setIsAddOrderDialogOpen(false)
      setOrderFormData({
        pickupAddress: '',
        dropoffAddress: '',
        fromProvinceId: '',
        toProvinceId: '',
        modelId: '',
        totalKm: '',
        innerCityKm: '',
        intercityKm: ''
      })
      setCalculatedPrice(null)
      await loadOrders(currentUser?.companyId)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Create Order'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleOpenAddOrderDialog = () => {
    setIsAddOrderDialogOpen(true)
  }
  const handleModelChange = (modelId: string) => {
    setOrderFormData({ ...orderFormData, modelId })
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-yellow-200">Loading Orders...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 dark:text-red-200">{error}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Danh sách đơn hàng từ hệ thống driving_order
          </p>
        </div>
        <Button onClick={handleOpenAddOrderDialog} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn hàng mới
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Orders By Address, Status Or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-yellow-100 dark:bg-yellow-800' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-yellow-500 text-black">
                  {Object.values(filters).filter(v => v !== '').length}
                </Badge>
              )}
            </Button>
            <div className="text-sm text-gray-600 dark:text-yellow-300">
              {filteredOrders.length} Orders
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderSearch">Search By Order</Label>
                  <Input
                    id="orderSearch"
                    placeholder="Order ID..."
                    value={filters.orderSearch}
                    onChange={(e) => handleFilterChange('orderSearch', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverSearch">Search By Driver</Label>
                  <Input
                    id="driverSearch"
                    placeholder="Driver ID..."
                    value={filters.driverSearch}
                    onChange={(e) => handleFilterChange('driverSearch', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressSearch">Search By Address</Label>
                  <Input
                    id="addressSearch"
                    placeholder="Pickup/Dropoff Address..."
                    value={filters.addressSearch}
                    onChange={(e) => handleFilterChange('addressSearch', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">From Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">To Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Min Amount (VND)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Max Amount (VND)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    placeholder="Unlimited"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <div className="text-sm text-gray-600 dark:text-yellow-300">
                  {hasActiveFilters && `${Object.values(filters).filter(v => v !== '').length} Active Filters`}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-yellow-300" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-yellow-300 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 dark:text-yellow-200">
                {searchQuery ? 'No Orders Found Matching Search Criteria' : 'Company Has No Orders In The System'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId}
              className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                        Order #{order.orderId}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="space-y-2">
                      {order.pickupAddress && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span><strong>Pickup:</strong> {order.pickupAddress}</span>
                        </div>
                      )}
                      {order.dropoffAddress && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span><strong>Dropoff:</strong> {order.dropoffAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Created At: {formatDate(order.createdAt)}</span>
                  </div>
                  {order.driverAccountId && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <User className="w-4 h-4 mr-2" />
                      <span>Driver ID: {order.driverAccountId}</span>
                    </div>
                  )}
                  {order.totalKm > 0 && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Distance: {order.totalKm} km</span>
                    </div>
                  )}
                  {order.pickupTime && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Pickup Time: {formatDate(order.pickupTime)}</span>
                    </div>
                  )}
                  {order.dropoffTime && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Dropoff Time: {formatDate(order.dropoffTime)}</span>
                    </div>
                  )}
                </div>
                {order.totalAmount > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Total Amount:</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-yellow-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                )}
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(order)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {shouldShowAssignButton(order.status) && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => handleAssignDriver(order)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {getAssignButtonLabel(order.status)}
                    </Button>
                  )}
                  {shouldShowCancelButton(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleCancelOrder(order)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Detailed Information About Order And Related Tables
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Order ID</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">#{selectedOrder.orderId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Status</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Pickup Address</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.pickupAddress}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Dropoff Address</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.dropoffAddress}</p>
                    </div>
                    {selectedOrder.pickupTime && (
                      <div>
                        <Label className="text-sm font-semibold">Pickup Time</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedOrder.pickupTime).toLocaleString('en-US')}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-semibold">Created Date</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(selectedOrder.createdAt).toLocaleString('en-US')}
                      </p>
                    </div>
                    {selectedOrder.updatedAt && (
                      <div>
                        <Label className="text-sm font-semibold">Updated Date</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedOrder.updatedAt).toLocaleString('en-US')}
                        </p>
                      </div>
                    )}
                    {selectedOrder.paymentMethod && (
                      <div>
                        <Label className="text-sm font-semibold">Payment Method</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.paymentMethod}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Distance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Total Km</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.totalKm} km</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Inner City Km</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.innerCityKm || 0} km</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Intercity Km</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.intercityKm || 0} km</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Traffic Km</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.trafficKm || 0} km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Price Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Base Fare</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(selectedOrder.baseFare || 0)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Traffic Fee</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(selectedOrder.trafficFee || 0)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Rain Fee</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(selectedOrder.rainFee || 0)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Intercity Fee</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(selectedOrder.intercityFee || 0)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Other Fee</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(selectedOrder.otherFee || 0)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t">
                      <Label className="text-sm font-semibold text-lg">Total Amount</Label>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(selectedOrder.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {(selectedOrder.isRaining !== undefined || selectedOrder.waitMinutes !== undefined) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Special Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedOrder.isRaining !== undefined && (
                        <div>
                          <Label className="text-sm font-semibold">Raining</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedOrder.isRaining ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                      {selectedOrder.waitMinutes !== undefined && (
                        <div>
                          <Label className="text-sm font-semibold">Wait Time</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.waitMinutes} Minutes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {selectedOrder.vehicle && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Plate Number</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.vehicle.plateNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Color</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.vehicle.color}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {selectedOrder.driver && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Driver Name</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.driver.fullName}</p>
                      </div>
                      {selectedOrder.driver.phone && (
                        <div>
                          <Label className="text-sm font-semibold">Phone Number</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.driver.phone}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {selectedOrder.customer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Customer Name</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.customer.fullName}</p>
                      </div>
                      {selectedOrder.customer.phone && (
                        <div>
                          <Label className="text-sm font-semibold">Phone Number</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.customer.phone}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {selectedOrder.driverSchedule && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Driver Schedule Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Schedule ID</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.driverSchedule.scheduleId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Work Date</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedOrder.driverSchedule.workDate).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Start Time</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedOrder.driverSchedule.startTime}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">End Time</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedOrder.driverSchedule.endTime}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Status</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.driverSchedule.status}</p>
                      </div>
                      {selectedOrder.driverSchedule.vehicle && (
                        <div>
                          <Label className="text-sm font-semibold">Plate Number</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedOrder.driverSchedule.vehicle.plateNumber}
                          </p>
                        </div>
                      )}
                      {selectedOrder.driverSchedule.driver && (
                        <div>
                          <Label className="text-sm font-semibold">Driver</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedOrder.driverSchedule.driver.fullName}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedOrder.driverSchedule.note && (
                      <div>
                        <Label className="text-sm font-semibold">Note</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.driverSchedule.note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {selectedOrder.priceRef && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Model Price Province Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Price ID</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.priceRef.modelPriceId}</p>
                      </div>
                      {selectedOrder.priceRef.province && (
                        <div>
                          <Label className="text-sm font-semibold">Province/City</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.priceRef.province.name}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-semibold">Opening Fare</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.openingFare)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Price First 20km</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.rateFirst20Km)}/km
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Price Over 20km</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.rateOver20Km)}/km
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Traffic Add Price</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.trafficAddPerKm)}/km
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Rain Add Price</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.rainAddPerTrip)}/trip
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Intercity Price</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(selectedOrder.priceRef.intercityRatePerKm)}/km
                        </p>
                      </div>
                      {selectedOrder.priceRef.timeStart && selectedOrder.priceRef.timeEnd && (
                        <>
                          <div>
                            <Label className="text-sm font-semibold">Start Time</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.priceRef.timeStart}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">End Time</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.priceRef.timeEnd}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <Label className="text-sm font-semibold">Start Date</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedOrder.priceRef.dateStart).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">End Date</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(selectedOrder.priceRef.dateEnd).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Status</Label>
                        <Badge className={selectedOrder.priceRef.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedOrder.priceRef.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    {selectedOrder.priceRef.note && (
                      <div>
                        <Label className="text-sm font-semibold">Note</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.priceRef.note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {!selectedOrder.driverSchedule && !selectedOrder.priceRef && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No Driver Schedule Or Price Model Information Related To This Order.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Driver For Order #{selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Map Popup: View Pickup/Dropoff And Available Drivers. Click On Driver To Select.
            </DialogDescription>
          </DialogHeader>
          {loadingSchedules ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <p className="ml-4 text-gray-600 dark:text-yellow-300">Loading Drivers List...</p>
            </div>
          ) : (
            selectedOrder && (
              <DriverAssignMapDialog
                order={selectedOrder}
                schedules={availableSchedules}
                onSelectDriver={handleSelectDriver}
              />
            )
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
        <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter Information To Create New Order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                placeholder="Enter Pickup Address..."
                value={orderFormData.pickupAddress}
                onChange={(e) => setOrderFormData({ ...orderFormData, pickupAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffAddress">Dropoff Address *</Label>
              <Input
                id="dropoffAddress"
                placeholder="Enter Dropoff Address..."
                value={orderFormData.dropoffAddress}
                onChange={(e) => setOrderFormData({ ...orderFormData, dropoffAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromProvinceId">Pickup Province *</Label>
                <select
                  id="fromProvinceId"
                  value={orderFormData.fromProvinceId}
                  onChange={(e) => {
                    setOrderFormData({ ...orderFormData, fromProvinceId: e.target.value })
                    setCalculatedPrice(null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Pickup Province...</option>
                  {provinces.map((province) => (
                    <option key={province.ProvinceId || province.provinceId} value={province.ProvinceId || province.provinceId}>
                      {province.Name || province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toProvinceId">Dropoff Province *</Label>
                <select
                  id="toProvinceId"
                  value={orderFormData.toProvinceId}
                  onChange={(e) => setOrderFormData({ ...orderFormData, toProvinceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Dropoff Province...</option>
                  {provinces.map((province) => (
                    <option key={province.ProvinceId || province.provinceId} value={province.ProvinceId || province.provinceId}>
                      {province.Name || province.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelId">Vehicle Model *</Label>
              <select
                id="modelId"
                value={orderFormData.modelId}
                onChange={(e) => {
                  handleModelChange(e.target.value)
                  setCalculatedPrice(null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Vehicle Model...</option>
                {vehicleModels.map((model) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.modelName} - {model.brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalKm">Total KM *</Label>
                <Input
                  id="totalKm"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={orderFormData.totalKm}
                  onChange={(e) => setOrderFormData({ ...orderFormData, totalKm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="innerCityKm">Inner City KM</Label>
                <Input
                  id="innerCityKm"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={orderFormData.innerCityKm}
                  onChange={(e) => setOrderFormData({ ...orderFormData, innerCityKm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intercityKm">Intercity KM</Label>
                <Input
                  id="intercityKm"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={orderFormData.intercityKm}
                  onChange={(e) => setOrderFormData({ ...orderFormData, intercityKm: e.target.value })}
                />
              </div>
            </div>
            {calculatedPrice && (
              <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-black border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Automatic Price Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Opening Fare:</span>
                      <span className="font-semibold">{calculatedPrice.baseFare?.toLocaleString('en-US')} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Price/km (≤20km):</span>
                      <span className="font-semibold">{calculatedPrice.rateFirst20Km?.toLocaleString('en-US')} VND/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Price/km ({'>'}20km):</span>
                      <span className="font-semibold">{calculatedPrice.rateOver20Km?.toLocaleString('en-US')} VND/km</span>
                    </div>
                    {calculatedPrice.intercityFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Intercity Fee ({orderFormData.intercityKm} km x {calculatedPrice.intercityRatePerKm?.toLocaleString('en-US')}):</span>
                        <span className="font-semibold text-blue-600">{calculatedPrice.intercityFee?.toLocaleString('en-US')} VND</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-700 dark:text-green-300">Total Amount:</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{calculatedPrice.totalAmount?.toLocaleString('en-US')} VND</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddOrderDialogOpen(false)
                  setOrderFormData({
                    pickupAddress: '',
                    dropoffAddress: '',
                    fromProvinceId: '',
                    toProvinceId: '',
                    modelId: '',
                    totalKm: '',
                    innerCityKm: '',
                    intercityKm: ''
                  })
                  setCalculatedPrice(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddOrder}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {loading ? 'Creating...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}