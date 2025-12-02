"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Eye, MapPin, Clock, DollarSign, Calendar, Car, AlertCircle } from "lucide-react"
import { apiService } from "../../lib/api"
import { getCurrentUser } from "../../lib/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
export default function BookingHistoryPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  useEffect(() => {
    const user = getCurrentUser()
    const accountId = user?.id
    if (user && accountId) {
      setCurrentUser(user)
      loadOrders(accountId)
    } else {
      setError("Please Login To View Booking History")
      setLoading(false)
    }
  }, [])
  const loadOrders = async (customerAccountId: string) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/drivingorders/customer/${customerAccountId}`) as any
      const ordersData = Array.isArray(response)
        ? response
        : response?.items || response?.data || []
      setOrders(ordersData)
    } catch (error: any) {
      setError(`Error Loading Booking History: ${error.message || 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-gray-500'
      case 'ASSIGNED': return 'bg-blue-500'
      case 'ONGOING': return 'bg-yellow-500'
      case 'DONE': return 'bg-green-500'
      case 'FAILED': return 'bg-red-500'
      case 'CANCELLED': return 'bg-gray-600'
      default: return 'bg-gray-400'
    }
  }
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '0 VND'
    return new Intl.NumberFormat('en-US').format(amount) + ' VND'
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-yellow-200">Loading Booking History...</p>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Data Loading Error
            </h3>
            <p className="text-gray-600 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black">
      <section className="py-12 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/20 dark:to-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-yellow-400 mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            Booking History
          </h1>
          <p className="text-lg text-gray-700 dark:text-yellow-200">
            Review Your Past Trips
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You Don't Have Any Trips Yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Book Your First Trip From The Homepage
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {Array.isArray(orders) && orders.map((order) => (
              <Card key={order.orderId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-yellow-600" />
                        Order #{order.orderId}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <span className="font-medium">Pickup:</span> {order.pickupAddress}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <span className="font-medium">Drop-Off:</span> {order.dropoffAddress}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Distance: {order.totalKm?.toFixed(1) || '0'} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-lg text-yellow-600">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="w-6 h-6 text-yellow-600" />
              Order Details #{selectedOrder?.orderId}
            </DialogTitle>
            <DialogDescription>
              Detailed Information About Your Trip
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Created Date</h4>
                  <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium">Pickup:</span> {selectedOrder.pickupAddress || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-medium">Drop-Off:</span> {selectedOrder.dropoffAddress || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Total Km</h4>
                  <p className="text-lg">{selectedOrder.totalKm?.toFixed(1) || '0'} km</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inner City</h4>
                  <p className="text-lg">{selectedOrder.innerCityKm?.toFixed(1) || '0'} km</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Intercity</h4>
                  <p className="text-lg">{selectedOrder.intercityKm?.toFixed(1) || '0'} km</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Price Details</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.baseFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intercity Fee:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.intercityFee)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-yellow-600">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
              {selectedOrder.driver || selectedOrder.vehicle ? (
                <div>
                  <h4 className="font-semibold mb-2">Driver & Vehicle</h4>
                  <div className="space-y-2 text-sm">
                    {selectedOrder.driver && (
                      <div>
                        <span className="font-medium">Driver:</span> {selectedOrder.driver.fullName || 'N/A'}
                      </div>
                    )}
                    {selectedOrder.vehicle && (
                      <div>
                        <span className="font-medium">Vehicle:</span> {selectedOrder.vehicle.licensePlate || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}