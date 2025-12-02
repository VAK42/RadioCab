"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Search, Eye, Download, Clock } from "lucide-react"
import { getCurrentUser } from "../../../../lib/auth"
import { useRouter } from "next/navigation"
export default function AdminOverviewEmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companyQuery, setCompanyQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  useEffect(() => {
    const user = getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      router.push('/login')
      return
    }
    fetchEmployees()
  }, [router])
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const apiService = (await import('../../../../lib/api')).apiService
      const [accountsRes, companiesRes] = await Promise.all([
        apiService.getAccounts({ pageSize: 5000 }) as any,
        apiService.getCompanies({ pageSize: 1000 }) as any,
      ])
      const items = accountsRes.items || []
      const companies = (companiesRes.items || []) as any[]
      const companyIdToName = new Map<number, string>(companies.map((c: any) => [c.companyId, c.name]))
      const mapped = items
        .filter((a: any) => a.role !== 'CUSTOMER')
        .map((a: any) => ({
          id: a.accountId,
          name: a.fullName,
          email: a.email,
          phone: a.phone,
          role: a.role,
          company: a.company?.name || (a.companyId ? (companyIdToName.get(a.companyId) || 'N/A') : 'N/A'),
          status: a.status,
          joinDate: new Date(a.createdAt).toLocaleDateString('en-US'),
          lastActive: a.updatedAt || a.createdAt
        }))
      setEmployees(mapped)
      setError("")
    } catch (err: any) {
      setError(err?.message || 'Cannot Load Employee Data')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-red-500 text-white">Admin</Badge>
      case "MANAGER": return <Badge className="bg-blue-500 text-white">Manager</Badge>
      case "DRIVER": return <Badge className="bg-green-500 text-white">Driver</Badge>
      case "ACCOUNTANT": return <Badge className="bg-purple-500 text-white">Accountant</Badge>
      case "DISPATCHER": return <Badge className="bg-orange-500 text-white">Dispatcher</Badge>
      default: return <Badge className="bg-gray-500 text-white">Other</Badge>
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-500 text-white">Active</Badge>
      case "INACTIVE": return <Badge className="bg-red-500 text-white">Inactive</Badge>
      default: return <Badge className="bg-gray-500 text-white">Unknown</Badge>
    }
  }
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.phone || '').includes(searchQuery)
    const matchesCompany = !companyQuery || (employee.company || '').toLowerCase().includes(companyQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || employee.role === selectedRole
    return matchesSearch && matchesCompany && matchesRole
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-yellow-400">Employee List</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search Employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Filter By Company Name..."
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                className="px-3 py-2"
              />
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="px-3 py-2 border rounded-md">
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="DRIVER">Driver</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="DISPATCHER">Dispatcher</option>
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border rounded-md">
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <Card><CardContent className="p-8 text-center">Loading Data...</CardContent></Card>
            ) : error ? (
              <Card><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card>
            ) : filteredEmployees.length === 0 ? (
              <Card><CardContent className="p-8 text-center">No Employees Found</CardContent></Card>
            ) : (
              filteredEmployees.map(employee => (
                <Card key={employee.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold">{employee.name}</h3>
                          {getRoleBadge(employee.role)}
                          {getStatusBadge(employee.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div><p className="text-sm text-gray-600">Email</p><p className="font-medium">{employee.email}</p></div>
                          <div><p className="text-sm text-gray-600">Phone</p><p className="font-medium">{employee.phone}</p></div>
                          <div><p className="text-sm text-gray-600">Company</p><p className="font-medium">{employee.company}</p></div>
                          <div><p className="text-sm text-gray-600">Joined</p><p className="font-medium">{employee.joinDate}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" /><span className="text-sm">Last Active: {new Date(employee.lastActive).toLocaleString('en-US')}</span></div>
                      </div>
                      <div className="flex gap-2 ml-4"><Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button><Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button></div>
                    </div>
                  </CardContent>
                </Card>
              )))
            }
          </div>
        </div>
      </div>
    </div>
  )
}