"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { FileText, CreditCard, Calendar, User, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentUser } from "../../../lib/auth"
import { apiService } from "../../../lib/api"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
export default function MembershipHistoryPage() {
  const [membershipOrders, setMembershipOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [renewOpen, setRenewOpen] = useState(false)
  const [renewMonths, setRenewMonths] = useState<string>("")
  const [activeMembership, setActiveMembership] = useState<any | null>(null)
  const [qrUrl, setQrUrl] = useState<string>("")
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentNote, setPaymentNote] = useState<string>("")
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.companyId) {
      setUser(currentUser)
      loadMembershipOrders(currentUser.companyId)
      loadActiveMembership(currentUser.companyId)
    } else {
      setError("User Company Information Not Found")
      setLoading(false)
    }
  }, [])
  const loadMembershipOrders = async (companyId: number) => {
    try {
      setLoading(true)
      const response = await apiService.getMembershipOrders({ companyId })
      if (response?.data?.items || response?.items) {
        const orders = response?.data?.items || response?.items || []
        setMembershipOrders(orders)
      } else {
        setMembershipOrders([])
      }
    } catch (error: any) {
      setError(`Error Loading Membership History: ${error.message || 'Unknown'}`)
      setMembershipOrders([])
    } finally {
      setLoading(false)
    }
  }
  const loadActiveMembership = async (_companyId: number) => {
    try {
      const res = await apiService.getMemberships({ isActive: true, pageSize: 1 })
      const items = (res as any).items || (res as any).data?.items || (res as any).Items || (res as any).data || []
      const m = items[0]
      setActiveMembership(m || null)
    } catch {
      setActiveMembership(null)
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Payment
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US')
  }
  const latestPaidEndDate: Date | null = (() => {
    if (!membershipOrders || membershipOrders.length === 0) return null
    const paid = membershipOrders.filter((o: any) => !!o.paidAt && !!o.endDate)
    if (paid.length === 0) return null
    const max = paid.reduce((acc: any, cur: any) => {
      const accTime = new Date(acc.endDate).getTime()
      const curTime = new Date(cur.endDate).getTime()
      return curTime > accTime ? cur : acc
    })
    try {
      return new Date(max.endDate)
    } catch {
      return null
    }
  })()
  const daysRemaining: number | null = (() => {
    if (!latestPaidEndDate) return null
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const end = new Date(latestPaidEndDate.getFullYear(), latestPaidEndDate.getMonth(), latestPaidEndDate.getDate()).getTime()
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  })()
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-yellow-200">Loading Membership History...</p>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 border-red-500/30">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Error Loading Data
              </h3>
              <p className="text-gray-600 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                <FileText className="w-8 h-8" />
                Membership History
              </h1>
              <p className="text-gray-600 dark:text-yellow-200 mt-2">
                View Registered Membership Packages And Payment Information
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-yellow-300">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                  {membershipOrders.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-yellow-300">Total Cost</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(membershipOrders.reduce((sum, order) => sum + (order.amount || 0), 0))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-yellow-300">Expires</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                  {latestPaidEndDate ? latestPaidEndDate.toLocaleDateString('en-US') : 'N/A'}
                </p>
                <p className="text-xs text-gray-600 dark:text-yellow-200">
                  {daysRemaining !== null ? `${daysRemaining} Days Remaining` : '—'}
                </p>
              </div>
              <Button onClick={() => setRenewOpen(true)} disabled={!activeMembership}>
                Renew
              </Button>
            </div>
          </div>
          {membershipOrders.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                  No Membership History
                </h3>
                <p className="text-gray-600 dark:text-yellow-200">
                  Company Has Not Registered Any Membership Package
                </p>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Instructions:</strong> Run SQL Script To Create Table Structure
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    File: server/RadioCabs_BE/create_membership_table.sql
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {membershipOrders.map((order) => (
                <Card key={order.membershipOrderId} className="bg-white/80 dark:bg-gray-800/80 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-blue-400">
                            {order.membership?.name || `Membership Package ${order.unitMonths} Months`}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-blue-300">
                            {order.membership?.code && `Code: ${order.membership.code}`} • ID: #{order.membershipOrderId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {formatCurrency(order.amount)}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                          <Calendar className="w-4 h-4" />
                          Duration
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-blue-400">
                          {order.unitMonths} Months
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                          <DollarSign className="w-4 h-4" />
                          Unit Price
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-blue-400">
                          {formatCurrency(order.unitPrice)}/Month
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                          <Calendar className="w-4 h-4" />
                          Start Date
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-blue-400">
                          {formatDate(order.startDate)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                          <Calendar className="w-4 h-4" />
                          End Date
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-blue-400">
                          {formatDate(order.endDate)}
                        </p>
                      </div>
                      {order.membership && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <FileText className="w-4 h-4" />
                            Package Name
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-blue-400">
                            {order.membership.name}
                          </p>
                        </div>
                      )}
                      {order.membership && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <FileText className="w-4 h-4" />
                            Package Code
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-blue-400">
                            {order.membership.code}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <User className="w-4 h-4" />
                            Payer
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-blue-400">
                              {order.payer?.fullName || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-blue-300">
                              ID: {order.payer?.accountId || 'N/A'} • Username: {order.payer?.username || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <CreditCard className="w-4 h-4" />
                            Payment Method
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-blue-400">
                            {order.paymentMethod || 'Not Specified'}
                          </p>
                        </div>
                        {order.paymentCode && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                              <CreditCard className="w-4 h-4" />
                              Payment Code
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-blue-400 font-mono text-sm">
                              {order.paymentCode}
                            </p>
                          </div>
                        )}
                      </div>
                      {order.paidAt && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <Clock className="w-4 h-4" />
                            Payment Date
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-blue-400">
                            {formatDate(order.paidAt)}
                          </p>
                        </div>
                      )}
                      {order.note && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300">
                            <FileText className="w-4 h-4" />
                            Note
                          </div>
                          <p className="text-gray-900 dark:text-blue-400 mt-1">
                            {order.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Membership Package</DialogTitle>
          </DialogHeader>
          {activeMembership ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Active Package</p>
                <p className="font-semibold">{activeMembership.name} ({activeMembership.code})</p>
                <p className="text-sm text-gray-600">Unit Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(Number(activeMembership.unitPrice ?? activeMembership.unit_price ?? 0))}/Month</p>
              </div>
              <div className="grid gap-2">
                <Label>Renewal Months</Label>
                <Input type="number" inputMode="numeric" min={1} value={renewMonths} onChange={(e) => setRenewMonths(e.target.value)} placeholder="Enter Number Of Months" />
              </div>
              <div className="space-y-2">
                {Number(renewMonths) > 0 && (
                  <>
                    <p className="text-sm text-gray-600">
                      Total Amount: <span className="font-semibold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(Number(renewMonths) * Number(activeMembership.unitPrice ?? activeMembership.unit_price ?? 0))}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          const months = Math.max(1, Number(renewMonths) || 1)
                          const unit = Number(activeMembership.unitPrice ?? activeMembership.unit_price ?? 0)
                          const amount = months * unit
                          const companyId = user?.companyId || user?.CompanyId || ""
                          const code = activeMembership.code || "MEMB"
                          const note = `GIAHAN ${code} ${months}T CTY ${companyId}`
                          const vietqr = {
                            acqId: "970422",
                            accountNo: "0859226688",
                            accountName: "BUI DAI PHU",
                            template: "compact"
                          }
                          const url = `https://img.vietqr.io/image/${vietqr.acqId}-${vietqr.accountNo}-${vietqr.template}.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(vietqr.accountName)}`
                          setPaymentAmount(amount)
                          setPaymentNote(note)
                          setQrUrl(url)
                        }}
                        disabled={!renewMonths}
                      >
                        View QR Code
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {qrUrl && (
                <div className="mt-2 border rounded-lg p-3 flex flex-col items-center gap-3">
                  <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain" />
                  <div className="text-sm text-gray-700 space-y-1 text-center">
                    <p>
                      Amount: <span className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(paymentAmount)}</span>
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <p className="break-all">
                        Content: <span className="font-mono">{paymentNote}</span>
                      </p>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          try {
                            if (!user?.id || !user?.companyId) {
                              alert('Cannot Identify Account Or Company.');
                              return;
                            }
                            const months = Math.max(1, Number(renewMonths) || 1)
                            const unit = Number(activeMembership?.unitPrice ?? activeMembership?.unit_price ?? 0)
                            const amount = months * unit
                            const membershipId = activeMembership?.membershipId ?? activeMembership?.MembershipId ?? activeMembership?.id ?? undefined
                            const payerAccountId = Number((user as any)?.accountId ?? (user as any)?.AccountId ?? user.id)
                            const companyId = Number((user as any)?.companyId ?? (user as any)?.CompanyId)
                            await apiService.createMembershipOrder(companyId, {
                              payerAccountId,
                              membershipId: membershipId ? Number(membershipId) : undefined,
                              unitPrice: Number(unit),
                              unitMonths: Number(months),
                              amount: Number(amount),
                              paymentMethod: 'VIETQR_TEST',
                              paymentCode: undefined,
                              note: paymentNote || undefined
                            })
                            alert('Membership Order Created (Test).')
                            setRenewOpen(false)
                            setQrUrl("")
                            setRenewMonths("")
                            if (user?.companyId) {
                              loadMembershipOrders(Number(user.companyId))
                            }
                          } catch (e: any) {
                            alert(`Error Creating Order: ${e?.message || 'Unknown'}`)
                          }
                        }}
                        className="h-8 px-3"
                      >
                        Complete Payment (Test)
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Scan QR Code With Banking App To Pay. After Payment, You Can Close This Window.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">Active Package Not Identified</div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                const months = Math.max(1, Number(renewMonths) || 1)
                const unit = Number(activeMembership?.unitPrice ?? activeMembership?.unit_price ?? 0)
                const amount = months * unit
                const companyId = user?.companyId || user?.CompanyId || ""
                const code = activeMembership?.code || "MEMB"
                const note = `GIAHAN ${code} ${months}T CTY ${companyId}`
                const vietqr = {
                  acqId: "970422",
                  accountNo: "0859226688",
                  accountName: "BUI DAI PHU",
                  template: "compact"
                }
                const url = `https://img.vietqr.io/image/${vietqr.acqId}-${vietqr.accountNo}-${vietqr.template}.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(vietqr.accountName)}`
                setPaymentAmount(amount)
                setPaymentNote(note)
                setQrUrl(url)
              }}
              disabled={!activeMembership || !renewMonths}
            >
              Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}