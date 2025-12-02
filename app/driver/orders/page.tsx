"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { FileText, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, User, Phone, Calendar, Navigation, Ban } from "lucide-react"
import { DriverOnly } from "../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../lib/api"
import DriverTripMap from "../../../components/driverTripMap"
export default function DriverOrdersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('orders')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [cancelReason, setCancelReason] = useState<string>('')
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false)
  const [selectedTripOrder, setSelectedTripOrder] = useState<any>(null)
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      fetchDriverOrders(user.id)
    }
  }, [])
  const fetchDriverOrders = async (driverId: string) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/drivingorders/driver/${driverId}?pageSize=100`) as any
      const ordersData = response.items || []
      setOrders(ordersData)
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }
  const handleAcceptOrder = async (order: any) => {
    try {
      setLoading(true)
      await apiService.post(`/drivingorders/${order.orderId}/status`, {
        status: 'ACCEPTED'
      })
      alert('Order Confirmed!')
      await fetchDriverOrders(currentUser.id)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Confirm Order'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleStartOrder = async (order: any) => {
    try {
      setLoading(true)
      await apiService.put(`/drivingorders/${order.orderId}`, {
        status: 'ONGOING',
        pickupTime: new Date().toISOString()
      })
      alert('Order Started!')
      await fetchDriverOrders(currentUser.id)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Start Order'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleCompleteOrder = (order: any) => {
    setSelectedOrder(order)
    setPaymentMethod('CASH')
    setIsCompleteDialogOpen(true)
  }
  const submitCompleteOrder = async () => {
    if (!selectedOrder) return
    try {
      setLoading(true)
      await apiService.post(`/drivingorders/${selectedOrder.orderId}/complete`, {
        totalKm: selectedOrder.totalKm,
        innerCityKm: selectedOrder.innerCityKm || 0,
        intercityKm: selectedOrder.intercityKm || 0,
        trafficKm: 0,
        isRaining: false,
        waitMinutes: 0
      })
      await apiService.put(`/drivingorders/${selectedOrder.orderId}`, {
        paymentMethod: paymentMethod,
        ...(paymentMethod === 'CASH' ? { paidAt: new Date().toISOString() } : {})
      })
      alert('Order Completed Successfully!')
      setIsCompleteDialogOpen(false)
      await fetchDriverOrders(currentUser.id)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Complete Order'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleCancelOrder = (order: any) => {
    setSelectedOrder(order)
    setCancelReason('')
    setIsCancelDialogOpen(true)
  }
  const submitCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      alert('Please Enter Cancellation Reason')
      return
    }
    try {
      setLoading(true)
      await apiService.post(`/drivingorders/${selectedOrder.orderId}/cancel`, {
        reason: cancelReason
      })
      alert('Order Cancelled Successfully!')
      setIsCancelDialogOpen(false)
      await fetchDriverOrders(currentUser.id)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Cancel Order'}`)
    } finally {
      setLoading(false)
    }
  }
  const openTripDialog = (order: any) => {
    setSelectedTripOrder(order)
    setIsTripDialogOpen(true)
  }
  const getTripPrimaryAction = (order: any) => {
    if (!order) return { label: 'Close', handler: () => setIsTripDialogOpen(false) }
    if (order.status === 'ASSIGNED') return { label: 'Confirm', handler: () => handleAcceptOrder(order) }
    if (order.status === 'ACCEPTED') return { label: 'Start', handler: () => handleStartOrder(order) }
    if (order.status === 'ONGOING') return { label: 'Complete', handler: () => handleCompleteOrder(order) }
    return { label: 'Close', handler: () => setIsTripDialogOpen(false) }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="w-3 h-3 mr-1" />
          New
        </Badge>
      case "ASSIGNED":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Received
        </Badge>
      case "ACCEPTED":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      case "ONGOING":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
          <Navigation className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      case "DONE":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString()
    const today = new Date().toDateString()
    return orderDate === today
  })
  const ongoingOrders = orders.filter(order => order.status === 'ONGOING' || order.status === 'ASSIGNED')
  const completedOrders = orders.filter(order => order.status === 'DONE')
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const completedToday = orders.filter(order => {
    if (order.status !== 'DONE') return false
    const d1 = new Date(order.createdAt).toDateString()
    const d2 = new Date().toDateString()
    return d1 === d2
  })
  const completedTodayCount = completedToday.length
  const earningsToday = completedToday.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const parseDateBoundary = (d: string, endOfDay = false) => {
    if (!d) return null
    const dt = new Date(d)
    if (endOfDay) {
      dt.setHours(23, 59, 59, 999)
    }
    return dt
  }
  const fromDt = parseDateBoundary(dateFrom)
  const toDt = parseDateBoundary(dateTo, true)
  const ordersInRange = orders.filter(o => {
    const created = new Date(o.createdAt)
    if (fromDt && created < fromDt) return false
    if (toDt && created > toDt) return false
    return true
  })
  const statsTotalOrders = ordersInRange.length
  const statsTotalKm = ordersInRange.reduce((sum, o) => sum + (o.totalKm || 0), 0)
  const statsTotalAmount = ordersInRange.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  return (
    <DriverOnly>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-yellow-200 mt-2">
              View And Manage Orders Assigned To You
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Orders Today</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {todayOrders.length}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed Today</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {completedTodayCount}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Earnings Today</p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          {earningsToday.toLocaleString()} ₫
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="stats">
              <Card className="mb-4">
                <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 dark:text-yellow-300/70">From Date</label>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 dark:text-yellow-300/70">To Date</label>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-700">
                        <th className="py-2 pr-4">Order Code</th>
                        <th className="py-2 pr-4">Created Time</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">KM</th>
                        <th className="py-2 pr-4">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersInRange.map(o => (
                        <tr key={o.orderId} className="border-b last:border-0 dark:border-gray-800">
                          <td className="py-2 pr-4">#{o.orderId}</td>
                          <td className="py-2 pr-4">{formatDate(o.createdAt)}</td>
                          <td className="py-2 pr-4">{o.status}</td>
                          <td className="py-2 pr-4">{(o.totalKm || 0).toLocaleString()} km</td>
                          <td className="py-2 pr-4">{(o.totalAmount || 0).toLocaleString()} ₫</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="pt-3 font-semibold" colSpan={2}>Total</td>
                        <td className="pt-3"></td>
                        <td className="pt-3 font-semibold">{statsTotalKm.toLocaleString()} km</td>
                        <td className="pt-3 font-semibold">{statsTotalAmount.toLocaleString()} ₫</td>
                      </tr>
                      <tr>
                        <td className="pb-1 text-sm text-gray-600 dark:text-yellow-300/70" colSpan={5}>Total Orders: {statsTotalOrders}</td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-yellow-200">Loading Orders...</p>
                  </CardContent>
                </Card>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-yellow-200">No Orders Yet</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.orderId} className="bg-white/80 dark:bg-gray-800/80 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                            Order #{order.orderId}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500 dark:text-yellow-300/70">
                            {formatDate(order.createdAt)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {order.customer && (
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-yellow-100">{order.customer.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-500 dark:text-yellow-300/70 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.customer.phone || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-yellow-200">Pickup Point</p>
                            <p className="text-gray-900 dark:text-yellow-100">{order.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-yellow-200">Drop-Off Point</p>
                            <p className="text-gray-900 dark:text-yellow-100">{order.dropoffAddress}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-yellow-300/70">Distance</p>
                            <p className="font-semibold text-gray-900 dark:text-yellow-100">{order.totalKm} km</p>
                          </div>
                          {order.pickupTime && (
                            <div className="text-center">
                              <p className="text-sm text-gray-500 dark:text-yellow-300/70">Pickup Time</p>
                              <p className="font-semibold text-gray-900 dark:text-yellow-100">
                                {new Date(order.pickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-yellow-300/70">Total Amount</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {order.totalAmount?.toLocaleString()} ₫
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => openTripDialog(order)}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          View Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Order #{selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Select Payment Method To Complete Order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="WALLET">E-Wallet</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsCompleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitCompleteOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Confirm Completion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isTripDialogOpen} onOpenChange={setIsTripDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trip For Order #{selectedTripOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Map Showing Pickup Point, Destination And Your Current Location
            </DialogDescription>
          </DialogHeader>
          {selectedTripOrder && (
            <div className="space-y-4 mt-2">
              <DriverTripMap order={selectedTripOrder} />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsTripDialogOpen(false)}>Close</Button>
                {selectedTripOrder?.status === 'ONGOING' && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => { handleCancelOrder(selectedTripOrder); setIsTripDialogOpen(false) }}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const { handler } = getTripPrimaryAction(selectedTripOrder)
                    handler()
                    setIsTripDialogOpen(false)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {getTripPrimaryAction(selectedTripOrder).label}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order #{selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Please Enter Reason For Cancelling Order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Cancellation Reason</Label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter Reason For Cancelling Order..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Go Back
              </Button>
              <Button
                onClick={submitCancelOrder}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DriverOnly>
  )
}