"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react"
interface Subscription {
  subscriptionId: number;
  planName: string;
  planType: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number;
  features: string[];
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}
export default function DriverSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const mockSubscriptions: Subscription[] = [
    {
      subscriptionId: 1,
      planName: "Basic Monthly",
      planType: "basic",
      price: 500000,
      duration: 1,
      features: [
        "Basic Profile Display",
        "Apply To Maximum 5 Companies/Month",
        "Email Support",
        "Basic Reports"
      ],
      status: "active",
      startDate: new Date("2024-11-20"),
      endDate: new Date("2024-12-20"),
      autoRenew: true
    },
    {
      subscriptionId: 2,
      planName: "Premium Monthly",
      planType: "premium",
      price: 1500000,
      duration: 1,
      features: [
        "Featured Profile Display",
        "Unlimited Applications",
        "Priority Display",
        "24/7 Support",
        "Detailed Reports",
        "Career Consulting"
      ],
      status: "pending",
      startDate: new Date("2024-12-21"),
      endDate: new Date("2025-01-21"),
      autoRenew: false
    }
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending Payment</Badge>
      case "expired":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" /> Expired</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-gold-100 text-gold-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscription Packages</h1>
        <p className="text-muted-foreground mt-2">
          Manage Your Subscription Packages And Payments
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Package
          </CardTitle>
          <CardDescription>
            Information About Current Subscription Package
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.filter(sub => sub.status === "active").map((subscription) => (
            <div key={subscription.subscriptionId} className="p-6 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{subscription.planName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription.duration} Month • Auto Renew: {subscription.autoRenew ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {subscription.price.toLocaleString()} VND
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Features Included:</h4>
                  <ul className="space-y-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Time Information:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Start:</span>
                      <span>{subscription.startDate.toLocaleDateString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{subscription.endDate.toLocaleDateString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="text-primary font-medium">
                        {Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Subscription Packages</CardTitle>
          <CardDescription>
            Upgrade Package For More Features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="text-3xl font-bold text-primary mt-2">500,000 VND</div>
                <p className="text-sm text-muted-foreground">/Month</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic Profile Display
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Apply To Maximum 5 Companies/Month
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Email Support
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic Reports
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Select This Package
              </Button>
            </div>
            <div className="p-6 border rounded-lg border-primary bg-primary/5">
              <div className="text-center mb-4">
                <Badge className="mb-2">Popular</Badge>
                <h3 className="text-xl font-semibold">Premium</h3>
                <div className="text-3xl font-bold text-primary mt-2">1,500,000 VND</div>
                <p className="text-sm text-muted-foreground">/Month</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Featured Profile Display
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Unlimited Applications
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Priority Display
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  24/7 Support
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Detailed Reports
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Career Consulting
                </li>
              </ul>
              <Button className="w-full">
                Upgrade To Premium
              </Button>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="text-3xl font-bold text-primary mt-2">3,000,000 VND</div>
                <p className="text-sm text-muted-foreground">/Month</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  All Premium Features
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  API Integration
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Dedicated Support
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Custom Interface
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Advanced Reports
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  In-Depth Training
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact For More Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>
            All Your Subscription Packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.subscriptionId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{subscription.planName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subscription.startDate.toLocaleDateString('en-US')} - {subscription.endDate.toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{subscription.price.toLocaleString()} VND</div>
                    {getStatusBadge(subscription.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}