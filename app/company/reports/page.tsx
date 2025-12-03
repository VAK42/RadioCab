"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { BarChart3, TrendingUp, Users, Car, Download, Filter, XCircle } from "lucide-react"
import { getCurrentUser } from "../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../lib/api"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [vehiclesData, setVehiclesData] = useState<any[]>([])
  const [driversData, setDriversData] = useState<any[]>([])
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [modelCountRange, setModelCountRange] = useState<'month' | 'year'>('month')
  const [modelCountMonth, setModelCountMonth] = useState<string>(String(new Date().getMonth() + 1))
  const [modelCountYear, setModelCountYear] = useState<string>(String(new Date().getFullYear()))
  const [modelCountData, setModelCountData] = useState<any[]>([])
  const [modelRevenueRange, setModelRevenueRange] = useState<'month' | 'year'>('month')
  const [modelRevenueMonth, setModelRevenueMonth] = useState<string>(String(new Date().getMonth() + 1))
  const [modelRevenueYear, setModelRevenueYear] = useState<string>(String(new Date().getFullYear()))
  const [modelRevenueData, setModelRevenueData] = useState<any[]>([])
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      const now = new Date()
      const first = new Date(now.getFullYear(), now.getMonth(), 1)
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      setStartDate(first.toISOString().split('T')[0])
      setEndDate(last.toISOString().split('T')[0])
      loadReportsData(user.companyId)
    } else {
      setError("Company Information Not Found")
      setLoading(false)
    }
  }, [])
  const loadReportsData = async (companyId: number) => {
    try {
      setLoading(true)
      const vehiclesResponse = await apiService.getVehicles({ companyId })
      const driversResponse = await apiService.getAccounts({ companyId, role: 'DRIVER' })
      const ordersResponse = await apiService.getDrivingOrders({ companyId })
      setVehiclesData(vehiclesResponse?.data?.items || vehiclesResponse?.items || [])
      setDriversData(driversResponse?.data?.items || driversResponse?.items || [])
      setOrdersData(ordersResponse?.data?.items || ordersResponse?.items || [])
      processChartData(ordersResponse?.data?.items || ordersResponse?.items || [])
    } catch (error: any) {
      setError(`Error Loading Report Data: ${error.message || 'Unknown'} `)
    } finally {
      setLoading(false)
    }
  }
  const processChartData = (orders: any[]) => {
    const groupedData: { [key: string]: { completed: number, cancelled: number, revenue: number } } = {}
    const sd = startDate ? new Date(startDate) : null
    const ed = endDate ? new Date(endDate) : null
    const inRange = (d: Date) => {
      if (sd) {
        const s = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate())
        if (d < s) return false
      }
      if (ed) {
        const e = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 23, 59, 59, 999)
        if (d > e) return false
      }
      return true
    }
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt || order.pickupTime || order.startTime)
      if (isNaN(orderDate.getTime())) return
      if (!inRange(orderDate)) return
      let key = ''
      switch (timeRange) {
        case 'day':
          key = orderDate.toISOString().split('T')[0]
          break
        case 'month':
          key = `${orderDate.getFullYear()} -${String(orderDate.getMonth() + 1).padStart(2, '0')} `
          break
        case 'year':
          key = orderDate.getFullYear().toString()
          break
      }
      if (!groupedData[key]) {
        groupedData[key] = { completed: 0, cancelled: 0, revenue: 0 }
      }
      const status = String(order.status || '').toUpperCase()
      if (status === 'DONE' || status === 'COMPLETED') {
        groupedData[key].completed++
        groupedData[key].revenue += order.totalAmount || 0
      } else if (status === 'CANCELLED') {
        groupedData[key].cancelled++
      }
    })
    const chartArray = Object.entries(groupedData)
      .map(([time, data]) => ({
        time,
        completed: data.completed,
        cancelled: data.cancelled,
        revenue: data.revenue
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
    setChartData(chartArray)
  }
  const handleTimeRangeChange = (value: 'day' | 'month' | 'year') => {
    setTimeRange(value)
    processChartData(ordersData)
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US')
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
  useEffect(() => {
    processChartData(ordersData)
  }, [ordersData, startDate, endDate, timeRange])
  const getOrderDate = (o: any) => new Date(o.createdAt || o.pickupTime || o.startTime)
  const getModelKey = (o: any) => {
    const m = o.model || o.Model
    const name = m?.modelName || m?.ModelName
    const brand = m?.brand || m?.Brand
    const id = o.modelId || o.ModelId
    return {
      key: name ? `${brand ? brand + ' - ' : ''}${name}` : `Model #${id}`,
      id: id
    }
  }
  const recomputePerModel = () => {
    if (!ordersData || ordersData.length === 0) {
      setModelCountData([]); setModelRevenueData([]); return
    }
    const monthInt1 = parseInt(modelCountMonth)
    const yearInt1 = parseInt(modelCountYear)
    const monthInt2 = parseInt(modelRevenueMonth)
    const yearInt2 = parseInt(modelRevenueYear)
    const groupCounts: Record<string, { completed: number, cancelled: number }> = {}
    const groupRevenue: Record<string, { revenue: number }> = {}
    for (const o of ordersData) {
      const d = getOrderDate(o)
      if (isNaN(d.getTime())) continue
      let pass1 = false
      if (modelCountRange === 'year') {
        pass1 = d.getFullYear() === yearInt1
      } else {
        pass1 = d.getFullYear() === yearInt1 && (d.getMonth() + 1) === monthInt1
      }
      let pass2 = false
      if (modelRevenueRange === 'year') {
        pass2 = d.getFullYear() === yearInt2
      } else {
        pass2 = d.getFullYear() === yearInt2 && (d.getMonth() + 1) === monthInt2
      }
      const status = String(o.status || '').toUpperCase()
      const { key } = getModelKey(o)
      if (pass1) {
        if (!groupCounts[key]) groupCounts[key] = { completed: 0, cancelled: 0 }
        if (status === 'DONE' || status === 'COMPLETED') groupCounts[key].completed++
        else if (status === 'CANCELLED') groupCounts[key].cancelled++
      }
      if (pass2) {
        if (!groupRevenue[key]) groupRevenue[key] = { revenue: 0 }
        if (status === 'DONE' || status === 'COMPLETED') groupRevenue[key].revenue += (o.totalAmount || 0)
      }
    }
    setModelCountData(Object.entries(groupCounts).map(([model, v]) => ({ model, completed: v.completed, cancelled: v.cancelled })))
    setModelRevenueData(Object.entries(groupRevenue).map(([model, v]) => ({ model, revenue: v.revenue })))
  }
  useEffect(() => {
    recomputePerModel()
  }, [ordersData, modelCountRange, modelCountMonth, modelCountYear, modelRevenueRange, modelRevenueMonth, modelRevenueYear])
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-yellow-200">Loading Report Data...</p>
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
            <BarChart3 className="w-8 h-8" />
            Reports & Statistics
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Vehicle And Driver Statistics Over Time
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
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
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
              <Label htmlFor="startDate">From Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">To Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <div className="flex flex-col text-sm text-gray-700 dark:text-yellow-200 p-2 border rounded">
                <span>Completed: {chartData.reduce((s, i) => s + (i.completed || 0), 0)}</span>
                <span>Cancelled: {chartData.reduce((s, i) => s + (i.cancelled || 0), 0)}</span>
                <span>Revenue: {formatCurrency(chartData.reduce((s, i) => s + (i.revenue || 0), 0))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-blue-300">
              Total Vehicles
            </CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-blue-400">
              {vehiclesData.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-blue-300">
              Active Vehicles
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-purple-300">
              Total Drivers
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-purple-400">
              {driversData.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-purple-300">
              Active Drivers
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Order Statistics Over Time
            </CardTitle>
            <CardDescription className="text-yellow-200">
              Bar Chart Showing Completed And Cancelled Orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-yellow-300">
                  <BarChart3 className="w-16 h-16 mb-2 opacity-50" />
                  <p>No Order Data Available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                    <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-green-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Statistics Over Time
            </CardTitle>
            <CardDescription className="text-green-200">
              Bar Chart Showing Revenue From Completed Orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-green-300">
                  <TrendingUp className="w-16 h-16 mb-2 opacity-50" />
                  <p>No Revenue Data Available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTick} />
                    <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600 dark:text-green-300">
                Total Revenue: {formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-200/80 to-indigo-300/80 dark:from-indigo-900/20 dark:to-black border-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-indigo-400">Orders By Vehicle Model</CardTitle>
            <CardDescription className="text-indigo-200">Completed And Cancelled Orders By Vehicle Model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div>
                <Label className="text-xs">Period</Label>
                <Select value={modelCountRange} onValueChange={(v: 'month' | 'year') => setModelCountRange(v)}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Period" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">By Month</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {modelCountRange === 'month' && (
                <>
                  <div>
                    <Label className="text-xs">Month</Label>
                    <Select value={modelCountMonth} onValueChange={setModelCountMonth}>
                      <SelectTrigger className="w-[100px]"><SelectValue placeholder="Month" /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, i) => <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Year</Label>
                    <Input value={modelCountYear} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModelCountYear(e.target.value)} className="w-[110px]" />
                  </div>
                </>
              )}
              {modelCountRange === 'year' && (
                <div>
                  <Label className="text-xs">Year</Label>
                  <Input value={modelCountYear} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModelCountYear(e.target.value)} className="w-[110px]" />
                </div>
              )}
            </div>
            <div className="h-72">
              {modelCountData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-indigo-300">No Data Available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelCountData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-25} textAnchor="end" interval={0} height={60} tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                    <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-200/80 to-emerald-300/80 dark:from-emerald-900/20 dark:to-black border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-emerald-400">Revenue By Vehicle Model</CardTitle>
            <CardDescription className="text-emerald-200">Total Revenue From Completed Orders By Vehicle Model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div>
                <Label className="text-xs">Period</Label>
                <Select value={modelRevenueRange} onValueChange={(v: 'month' | 'year') => setModelRevenueRange(v)}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Period" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">By Month</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {modelRevenueRange === 'month' && (
                <>
                  <div>
                    <Label className="text-xs">Month</Label>
                    <Select value={modelRevenueMonth} onValueChange={setModelRevenueMonth}>
                      <SelectTrigger className="w-[100px]"><SelectValue placeholder="Month" /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, i) => <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Year</Label>
                    <Input value={modelRevenueYear} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModelRevenueYear(e.target.value)} className="w-[110px]" />
                  </div>
                </>
              )}
              {modelRevenueRange === 'year' && (
                <div>
                  <Label className="text-xs">Year</Label>
                  <Input value={modelRevenueYear} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModelRevenueYear(e.target.value)} className="w-[110px]" />
                </div>
              )}
            </div>
            <div className="h-72">
              {modelRevenueData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-emerald-300">No Data Available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelRevenueData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-25} textAnchor="end" interval={0} height={60} tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}