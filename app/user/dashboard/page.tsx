import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Building2, User, Eye, Clock, CheckCircle, AlertCircle, Users, Star, CreditCard } from "lucide-react"
import Link from "next/link"
import type { CompanyDashboardData, DriverDashboardData } from "../../../lib/types/database"
export default function UserDashboardPage() {
  const userRole: 'company' | 'driver' = 'company'
  const companyData: CompanyDashboardData = {
    company: {
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
    },
    stats: {
      profileViews: 1247,
      totalLeads: 23,
      totalReviews: 15,
      averageRating: 4.8
    },
    subscription: {
      plan: "Premium Monthly",
      nextPayment: "15/01/2025",
      amount: "2,500,000 VND",
      status: "active"
    },
    recentActivity: [
      {
        id: 1,
        type: "lead",
        title: "New Lead",
        description: "Customer Requested Airport Taxi",
        time: "2 Hours Ago",
        status: "new"
      },
      {
        id: 2,
        type: "payment",
        title: "Payment Successful",
        description: "Premium Monthly Package - December 2024",
        time: "1 Day Ago",
        status: "success"
      },
      {
        id: 3,
        type: "review",
        title: "New Review",
        description: "Customer Rated 5 Stars",
        time: "2 Days Ago",
        status: "success"
      }
    ]
  }
  const driverData: DriverDashboardData = {
    driver: {
      driverId: 1,
      driverCode: "DRV001",
      name: "Nguyen Van A",
      contactPerson: "Self",
      addressLine: "123 XYZ Street, District 1, HCMC",
      cityId: 1,
      mobile: "0987-654-321",
      telephone: null,
      email: "nguyenvana@email.com",
      experienceYears: 5,
      description: "Experienced Driver, Safe Driving",
      ownerUserId: 3,
      status: "active",
      createdAt: new Date("2024-11-20"),
      updatedAt: new Date("2024-12-20")
    },
    stats: {
      profileViews: 0,
      totalApplications: 0,
      totalReviews: 0,
      averageRating: 0,
      totalRides: 0
    },
    subscription: {
      plan: "Basic Monthly",
      nextPayment: "20/01/2025",
      amount: "500,000 VND",
      status: "pending"
    },
    recentActivity: [
      {
        id: 1,
        type: "application",
        title: "New Application",
        description: "ABC Taxi Company Contacted",
        time: "3 Hours Ago",
        status: "new"
      },
      {
        id: 2,
        type: "payment",
        title: "Payment Successful",
        description: "Basic Monthly Package - November 2024",
        time: "1 Day Ago",
        status: "success"
      }
    ]
  }
  const currentData: CompanyDashboardData = companyData
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "suspended":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" /> Suspended</Badge>
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>
      case "deleted":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const recentActivity = currentData.recentActivity
  return (
    <div className="space-y-8 pageEnter">
      <div className="fadeInScale">
        <h1 className="text-3xl font-bold text-foreground">
          {userRole === 'company' ? 'Company' : 'Driver'} Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage Your {userRole === 'company' ? 'Company' : 'Driver Profile'}
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {userRole === 'company' ? (
                  <Building2 className="h-6 w-6 text-primary" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{currentData.company.name}</CardTitle>
                <CardDescription>
                  Company Code: {currentData.company.companyCode} • Member Since {currentData.company.createdAt.toLocaleDateString('en-US')}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(currentData.company.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <span>{currentData.company.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Contact:</span>
                <span>{currentData.company.contactPerson}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Address:</span>
                <span>{currentData.company.addressLine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{currentData.stats.averageRating}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'company' ? 'Company Profile Views' : 'Driver Profile Views'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'company' ? 'New Leads' : 'Applications'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.stats.totalLeads}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'company' ? 'Potential Customers' : 'Job Applications'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Total Reviews Received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.subscription.amount}</div>
            <p className="text-xs text-muted-foreground">
              Payment Due: {currentData.subscription.nextPayment}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription Status</CardTitle>
            <Link href={`/user/dashboard/${userRole}/subscriptions`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">{currentData.subscription.plan}</h4>
              <p className="text-sm text-muted-foreground">
                Next Payment: {currentData.subscription.nextPayment}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{currentData.subscription.amount}</div>
              {getStatusBadge(currentData.subscription.status)}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your Recent Actions History
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className={`p-2 rounded-full ${activity.status === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
                  }`}>
                  {activity.type === "payment" ? (
                    <CreditCard className="h-4 w-4" />
                  ) : activity.type === "lead" ? (
                    <Users className="h-4 w-4" />
                  ) : activity.type === "review" ? (
                    <Star className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Quick Access To Main Features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={`/user/dashboard/${userRole}/profile`}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                {userRole === 'company' ? (
                  <>
                    <Building2 className="h-6 w-6" />
                    <span>Edit Profile</span>
                  </>
                ) : (
                  <>
                    <User className="h-6 w-6" />
                    <span>Edit Profile</span>
                  </>
                )}
              </Button>
            </Link>
            {userRole === 'company' ? (
              <Link href="/user/dashboard/company/leads">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Leads</span>
                </Button>
              </Link>
            ) : (
              <Link href="/user/dashboard/driver/applications">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Applications</span>
                </Button>
              </Link>
            )}
            <Link href={`/user/dashboard/${userRole}/payments`}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Payments</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}