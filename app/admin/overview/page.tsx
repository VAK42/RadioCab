"use client"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Building2, Users, FileText, TrendingUp, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { AdminOnly } from "../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../lib/auth"
import { useEffect, useState } from "react"
import Link from "next/link"
export default function AdminOverviewPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      fetchSystemOverview()
    }
  }, [])
  const fetchSystemOverview = async () => {
    try {
      setLoading(true)
      const apiService = (await import('../../../lib/api')).apiService
      const [companiesResponse, vehiclesResponse, ordersResponse, accountsResponse] = await Promise.all([
        apiService.getCompanies({ pageSize: 100 }),
        apiService.getVehicles({ pageSize: 1000 }),
        apiService.getDrivingOrders({ pageSize: 1000 }),
        apiService.getAccounts({ pageSize: 5000 })
      ])
      const companiesData = companiesResponse.items || []
      const allVehicles = vehiclesResponse.items || []
      const allOrders = ordersResponse.items || []
      const allAccounts = accountsResponse.items || []
      try { (window as any).__allOrdersSnapshot = allOrders } catch { }
      const enrichedCompanies = companiesData.map((company: any) => {
        const companyVehicles = allVehicles.filter((v: any) => v.companyId === company.companyId)
        const companyOrders = allOrders.filter((o: any) => o.companyId === company.companyId)
        const revenue = companyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
        const companyAccounts = allAccounts.filter((a: any) => a.companyId === company.companyId)
        const drivers = companyAccounts.filter((a: any) => a.role === 'DRIVER')
        const employees = companyAccounts.filter((a: any) => a.role !== 'CUSTOMER')
        return {
          ...company,
          totalEmployees: employees.length,
          totalDrivers: drivers.length,
          totalVehicles: companyVehicles.length,
          totalOrders: companyOrders.length,
          totalComplaints: 0,
          revenue: revenue
        }
      })
      setCompanies(enrichedCompanies)
      setError("")
    } catch (err: any) {
      setError(err?.message || 'Cannot Connect To Server')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }
  const totalCompanies = companies.length
  const totalEmployees = companies.reduce((sum, c) => sum + (c.totalEmployees || 0), 0)
  const totalDrivers = companies.reduce((sum, c) => sum + (c.totalDrivers || 0), 0)
  const totalOrdersAll = companies.reduce((sum, c) => sum + (c.totalOrders || 0), 0)
  const ordersToday = (() => {
    const todayStr = new Date().toDateString()
    return 0
  })()
  const totalRevenue = companies.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  return (
    <AdminOnly>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-red-400">
            System Information
          </h1>
          <p className="text-sm text-gray-600 dark:text-red-200 mt-1">
            Overview Of Taxi Companies In RadioCabs System
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 cursor-pointer">
            <CardContent className="p-6">
              <Link href="/admin/overview/companies">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Companies</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {totalCompanies}
                    </p>
                  </div>
                  <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 cursor-pointer">
            <CardContent className="p-6">
              <Link href="/admin/overview/employees">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Employees</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {totalEmployees}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {totalDrivers} Drivers
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 cursor-pointer">
            <CardContent className="p-6">
              <Link href="/admin/overview/employees">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Orders Today</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {(() => {
                        try {
                          const w: any = window as any
                          if (w.__allOrdersSnapshot) {
                            const today = new Date().toDateString()
                            const count = (w.__allOrdersSnapshot as any[]).filter(o => new Date(o.createdAt).toDateString() === today).length
                            return count.toLocaleString()
                          }
                        } catch { }
                        return 0
                      })()}
                    </p>
                  </div>
                  <FileText className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {(totalRevenue / 1000000000).toFixed(1)}B VND
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700 cursor-pointer">
            <CardContent className="p-6">
              <Link href="/admin/overview/statistics">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">System Statistics</p>
                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                      Open Chart
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Revenue, New Orders, New Companies, New Drivers</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-400">API Connection Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminOnly>
  )
}