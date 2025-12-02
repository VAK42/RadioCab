"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Building2, Search, Eye, Download, Users, Car, DollarSign } from "lucide-react"
import { getCurrentUser } from "../../../../lib/auth"
import { useRouter } from "next/navigation"
export default function AdminOverviewCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  useEffect(() => {
    const user = getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      router.push('/login')
      return
    }
    fetchCompanies()
  }, [router])
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const apiService = (await import('../../../../lib/api')).apiService
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
      const enrichedCompanies = companiesData.map((company: any) => {
        const companyVehicles = allVehicles.filter((v: any) => v.companyId === company.companyId)
        const companyOrders = allOrders.filter((o: any) => o.companyId === company.companyId)
        const revenue = companyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
        const companyAccounts = allAccounts.filter((a: any) => a.companyId === company.companyId)
        const drivers = companyAccounts.filter((a: any) => a.role === 'DRIVER')
        return {
          ...company,
          totalVehicles: companyVehicles.length,
          totalOrders: companyOrders.length,
          revenue,
          totalDrivers: drivers.length,
        }
      })
      setCompanies(enrichedCompanies)
      setError("")
    } catch (err: any) {
      setError(err?.message || 'Cannot Load Company Data')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "INACTIVE": return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default: return <Badge>{status}</Badge>
    }
  }
  const filtered = companies.filter((company: any) => {
    const matchesSearch = (company.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.address || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus
    return matchesSearch && matchesStatus
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-red-400">Company List</h1>
            <p className="text-sm text-gray-600 dark:text-red-200 mt-1">All Companies In System</p>
          </div>
          <Card className="mb-4">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search Companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant={selectedStatus === 'all' ? 'default' : 'outline'} onClick={() => setSelectedStatus('all')}>All</Button>
                <Button variant={selectedStatus === 'ACTIVE' ? 'default' : 'outline'} onClick={() => setSelectedStatus('ACTIVE')}>Active</Button>
                <Button variant={selectedStatus === 'INACTIVE' ? 'default' : 'outline'} onClick={() => setSelectedStatus('INACTIVE')}>Inactive</Button>
              </div>
            </CardContent>
          </Card>
          {loading ? (
            <Card><CardContent className="p-8 text-center">Loading Data...</CardContent></Card>
          ) : error ? (
            <Card><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card>
          ) : filtered.length === 0 ? (
            <Card><CardContent className="p-8 text-center">No Companies Found</CardContent></Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((company: any) => (
                <Card key={company.companyId} className="bg-white/90 dark:bg-gray-800/90">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">{company.address}</p>
                        <p className="text-sm text-gray-500 dark:text-yellow-300/70 mt-1">{company.hotline} • {company.email}</p>
                      </div>
                      {getStatusBadge(company.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Drivers</p>
                        <p className="text-lg font-bold text-blue-900">{company.totalDrivers || 0}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Car className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Vehicles</p>
                        <p className="text-lg font-bold text-orange-900">{company.totalVehicles || 0}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Building2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Orders</p>
                        <p className="text-lg font-bold text-green-900">{(company.totalOrders || 0).toLocaleString()}</p>
                      </div>
                      <div className="col-span-2 text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <DollarSign className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Revenue</p>
                        <p className="text-lg font-bold text-yellow-900">{((company.revenue || 0) / 1_000_000).toFixed(0)}M VND</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-fit"><Eye className="w-4 h-4 mr-2" />View Details</Button>
                      <Button variant="outline" className="w-fit"><Download className="w-4 h-4 mr-2" />Export</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}