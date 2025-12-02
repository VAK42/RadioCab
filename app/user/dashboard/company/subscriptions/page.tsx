"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../components/ui/dialog"
import { Label } from "../../../../../components/ui/label"
import { Input } from "../../../../../components/ui/input"
import { Calendar, DollarSign, CheckCircle, XCircle, Clock, RefreshCw, Plus, Settings } from "lucide-react"
type SubscriptionStatus = 1 | 2 | 3 | 4
type Subscription = {
  subscriptionId: number
  planId: number
  statusId: SubscriptionStatus
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}
export default function CompanySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(false)
  const mockSubscriptions: Subscription[] = [
    {
      subscriptionId: 1,
      planId: 1,
      statusId: 2,
      startDate: new Date("2024-12-01"),
      endDate: new Date("2025-01-01"),
      createdAt: new Date("2024-12-01T10:00:00"),
      updatedAt: new Date("2024-12-15T14:30:00")
    },
    {
      subscriptionId: 2,
      planId: 2,
      statusId: 1,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-02-01"),
      createdAt: new Date("2024-12-20T15:45:00"),
      updatedAt: new Date("2024-12-20T15:45:00")
    },
    {
      subscriptionId: 3,
      planId: 3,
      statusId: 4,
      startDate: new Date("2024-11-01"),
      endDate: new Date("2024-12-01"),
      createdAt: new Date("2024-11-01T08:00:00"),
      updatedAt: new Date("2024-11-15T09:20:00")
    }
  ]
  const mockPlans = [
    { planId: 1, name: "Basic Monthly", price: 2500000, description: "Basic Monthly Package" },
    { planId: 2, name: "Premium Monthly", price: 3500000, description: "Premium Monthly Package" },
    { planId: 3, name: "Basic Quarterly", price: 1500000, description: "Basic 3-Month Package" },
    { planId: 4, name: "Premium Quarterly", price: 2500000, description: "Premium 3-Month Package" },
    { planId: 5, name: "Enterprise Yearly", price: 8000000, description: "Enterprise Annual Package" }
  ]
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubscriptions(mockSubscriptions)
      setLoading(false)
    }
    fetchSubscriptions()
  }, [])
  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 2:
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case 3:
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Expired</Badge>
      case 4:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" /> Canceled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  const getPlanName = (planId: number) => {
    const plan = mockPlans.find(p => p.planId === planId)
    return plan ? plan.name : "Unknown Plan"
  }
  const getPlanPrice = (planId: number) => {
    const plan = mockPlans.find(p => p.planId === planId)
    return plan ? plan.price : 0
  }
  const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsDialogOpen(true)
  }
  const handleCancelSubscription = (subscriptionId: number) => {
    if (confirm("Are You Sure You Want To Cancel This Subscription?")) {
      setSubscriptions(prev => prev.map(sub =>
        sub.subscriptionId === subscriptionId
          ? {
            ...sub,
            statusId: 4,
            updatedAt: new Date()
          }
          : sub
      ))
    }
  }
  const handleRenewSubscription = (subscriptionId: number) => {
    if (confirm("Are You Sure You Want To Renew This Subscription?")) {
      setSubscriptions(prev => prev.map(sub =>
        sub.subscriptionId === subscriptionId
          ? {
            ...sub,
            statusId: 2,
            endDate: new Date(sub.endDate.getTime() + 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          }
          : sub
      ))
    }
  }
  const activeSubscriptions = subscriptions.filter(sub => sub.statusId === 2)
  const pendingSubscriptions = subscriptions.filter(sub => sub.statusId === 1)
  const cancelledSubscriptions = subscriptions.filter(sub => sub.statusId === 4)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading Data...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Track And Manage Service Subscription Packages
          </p>
        </div>
        <Button onClick={() => setIsNewSubscriptionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Subscribe To New Package
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Packages In Use
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Need Action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              All Subscription Packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Cancelled Packages
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription List</CardTitle>
          <CardDescription>
            {subscriptions.length} Subscription Package(S) Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const daysRemaining = calculateDaysRemaining(subscription.endDate)
              const planName = getPlanName(subscription.planId)
              return (
                <div key={subscription.subscriptionId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{planName}</h3>
                        {getStatusBadge(subscription.statusId)}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Duration:</span>
                          </div>
                          <div className="text-muted-foreground">
                            {subscription.startDate.toLocaleDateString('en-US')} - {subscription.endDate.toLocaleDateString('en-US')}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Remaining:</span>
                          </div>
                          <div className="text-muted-foreground">
                            {daysRemaining > 0 ? `${daysRemaining} Days` : 'Expired'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Created At: {subscription.createdAt.toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubscription(subscription)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      {subscription.statusId === 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {subscription.statusId === 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewSubscription(subscription.subscriptionId)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Detailed Information About Subscription Package
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Package</Label>
                  <Input value={getPlanName(selectedSubscription.planId)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Subscription ID</Label>
                  <Input value={selectedSubscription.subscriptionId.toString()} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input value={selectedSubscription.startDate.toLocaleDateString('en-US')} disabled />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input value={selectedSubscription.endDate.toLocaleDateString('en-US')} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedSubscription.statusId)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Package ID</Label>
                  <Input value={selectedSubscription.planId.toString()} disabled />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {selectedSubscription.statusId === 2 && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelSubscription(selectedSubscription.subscriptionId)}
                  >
                    Cancel Subscription
                  </Button>
                )}
                {selectedSubscription.statusId === 1 && (
                  <Button onClick={() => handleRenewSubscription(selectedSubscription.subscriptionId)}>
                    Renew Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isNewSubscriptionOpen} onOpenChange={setIsNewSubscriptionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscribe To New Package</DialogTitle>
            <DialogDescription>
              Choose A Service Package That Suits Your Needs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4">
              {mockPlans.map((plan) => (
                <div key={plan.planId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{plan.price.toLocaleString()} VND</div>
                      <Button size="sm">Select Package</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewSubscriptionOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}