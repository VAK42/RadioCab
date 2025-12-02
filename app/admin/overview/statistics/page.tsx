"use client"
import { useEffect, useState } from "react"
import { AdminOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { apiService } from "../../../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { BarChart3, TrendingUp, Filter, XCircle } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
type TimeRange = 'day' | 'month' | 'year'
export default function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [companiesData, setCompaniesData] = useState<any[]>([])
  const [accountsData, setAccountsData] = useState<any[]>([])
  const [revenueSeries, setRevenueSeries] = useState<any[]>([])
  const [newOrdersSeries, setNewOrdersSeries] = useState<any[]>([])
  const [newCompaniesSeries, setNewCompaniesSeries] = useState<any[]>([])
  const [newDriversSeries, setNewDriversSeries] = useState<any[]>([])
  useEffect(() => {
    const u = getCurrentUser()
    if (!u || (u.role !== 'ADMIN' && u.role !== 'MANAGER')) {
    }
    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setStartDate(first.toISOString().split('T')[0])
    setEndDate(last.toISOString().split('T')[0])
    loadAll()
  }, [])
  const loadAll = async () => {
    try {
      setLoading(true)
      const [ordersRes, companiesRes, accountsRes] = await Promise.all([
        apiService.getDrivingOrders({ pageSize: 10000 }),
        apiService.getCompanies({ pageSize: 10000 }),
        apiService.getAccounts({ pageSize: 20000 })
      ])
      setOrdersData(ordersRes?.items || ordersRes?.data?.items || [])
      setCompaniesData(companiesRes?.items || companiesRes?.data?.items || [])
      setAccountsData(accountsRes?.items || accountsRes?.data?.items || [])
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Cannot Load Data')
      setOrdersData([]); setCompaniesData([]); setAccountsData([])
    } finally {
      setLoading(false)
    }
  }
  const formatKey = (d: Date) => {
    switch (timeRange) {
      case 'day': return d.toISOString().split('T')[0]
      case 'month': return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      case 'year': return `${d.getFullYear()}`
    }
  }
  const formatTick = (value: string) => {
    try {
      if (timeRange === 'day') {
        const d = new Date(value)
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
      }
      if (timeRange === 'month') {
        const [y, m] = value.split('-')
        return `${m}/${y}`
      }
      return value
    } catch { return value }
  }
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(amount)
  const recompute = () => {
    const sd = startDate ? new Date(startDate) : null
    const ed = endDate ? new Date(endDate) : null
    const inRange = (d: Date) => {
      if (sd) { const s = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate()); if (d < s) return false }
      if (ed) { const e = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 23, 59, 59, 999); if (d > e) return false }
      return true
    }
    const revenueMap: Record<string, number> = {}
    const newOrdersMap: Record<string, number> = {}
    const newCompaniesMap: Record<string, number> = {}
    const newDriversMap: Record<string, number> = {}
    for (const o of ordersData) {
      const d = new Date(o.createdAt || o.pickupTime || o.startTime)
      if (isNaN(d.getTime()) || !inRange(d)) continue
      const key = formatKey(d)
      const status = String(o.status || '').toUpperCase()
      if (!newOrdersMap[key]) newOrdersMap[key] = 0
      newOrdersMap[key]++
      if (status === 'DONE' || status === 'COMPLETED') {
        if (!revenueMap[key]) revenueMap[key] = 0
        revenueMap[key] += (o.totalAmount || 0)
      }
    }
    for (const c of companiesData) {
      const d = new Date(c.createdAt || c.CreatedAt)
      if (isNaN(d.getTime()) || !inRange(d)) continue
      const key = formatKey(d)
      if (!newCompaniesMap[key]) newCompaniesMap[key] = 0
      newCompaniesMap[key]++
    }
    for (const a of accountsData) {
      const role = String(a.role || a.Role)
      if (role !== 'DRIVER') continue
      const d = new Date(a.createdAt || a.CreatedAt)
      if (isNaN(d.getTime()) || !inRange(d)) continue
      const key = formatKey(d)
      if (!newDriversMap[key]) newDriversMap[key] = 0
      newDriversMap[key]++
    }
    const toSeries = (map: Record<string, number>, field: string) => Object.entries(map)
      .map(([time, value]) => ({ time, [field]: value }))
      .sort((a, b) => a.time.localeCompare(b.time))
    setRevenueSeries(Object.entries(revenueMap).map(([time, v]) => ({ time, revenue: v })).sort((a, b) => a.time.localeCompare(b.time)))
    setNewOrdersSeries(toSeries(newOrdersMap, 'orders'))
    setNewCompaniesSeries(toSeries(newCompaniesMap, 'companies'))
    setNewDriversSeries(toSeries(newDriversMap, 'drivers'))
  }
  useEffect(() => {
    recompute()
  }, [ordersData, companiesData, accountsData, timeRange, startDate, endDate])
  const handleTimeRangeChange = (v: TimeRange) => setTimeRange(v)
  if (loading) {
    return (
      <AdminOnly>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-yellow-200">Loading Statistics Data...</p>
          </div>
        </div>
      </AdminOnly>
    )
  }
  if (error) {
    return (
      <AdminOnly>
        <div className="space-y-6">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-400">Data Load Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminOnly>
    )
  }
  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              System Statistics
            </h1>
            <p className="text-gray-600 dark:text-yellow-200 mt-2">System-Wide Aggregation (All Companies)</p>
          </div>
        </div>
        <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Time Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={(v: any) => handleTimeRangeChange(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">By Day</SelectItem>
                    <SelectItem value="month">By Month</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant={timeRange === 'day' ? 'default' : 'outline'} onClick={() => handleTimeRangeChange('day')}>Day</Button>
                  <Button size="sm" variant={timeRange === 'month' ? 'default' : 'outline'} onClick={() => handleTimeRangeChange('month')}>Month</Button>
                  <Button size="sm" variant={timeRange === 'year' ? 'default' : 'outline'} onClick={() => handleTimeRangeChange('year')}>Year</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-green-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Over Time
              </CardTitle>
              <CardDescription className="text-green-200">Total Revenue Of Completed Orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {revenueSeries.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-green-300">No Data Available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                      <YAxis tickFormatter={(v) => `${Math.round((v as number) / 1000)}k`} />
                      <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                New Orders Over Time
              </CardTitle>
              <CardDescription className="text-yellow-200">Number Of New Orders Created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {newOrdersSeries.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-yellow-300">No Data Available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newOrdersSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" name="New Orders" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-200/80 to-indigo-300/80 dark:from-indigo-900/20 dark:to-black border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-indigo-400">New Companies Over Time</CardTitle>
              <CardDescription className="text-indigo-200">Number Of New Companies Created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {newCompaniesSeries.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-indigo-300">No Data Available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newCompaniesSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="companies" name="New Companies" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-200/80 to-emerald-300/80 dark:from-emerald-900/20 dark:to-black border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-emerald-400">New Drivers Over Time</CardTitle>
              <CardDescription className="text-emerald-200">Number Of New Drivers Created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {newDriversSeries.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-emerald-300">No Data Available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newDriversSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="drivers" name="New Drivers" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminOnly>
  )
}