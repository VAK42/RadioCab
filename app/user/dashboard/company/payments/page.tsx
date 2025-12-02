"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Badge } from "../../../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../components/ui/dialog"
import { Label } from "../../../../../components/ui/label"
import { CreditCard, Search, Filter, Download, Eye, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Receipt, Banknote, Smartphone } from "lucide-react"
import type { Payment } from "../../../../../lib/types/database"
export default function CompanyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const mockPayments: Payment[] = [
    {
      paymentId: 1,
      subscriptionId: 1,
      statusId: 2,
      amount: 2500000,
      currency: "USD",
      methodId: 1,
      txnRef: "TXN123456789",
      paidAt: new Date("2024-12-15T10:30:00"),
      createdAt: new Date("2024-12-15T10:30:00"),
      userId: 0,
      updatedAt: new Date("2024-12-15T10:30:00")
    },
    {
      paymentId: 2,
      subscriptionId: 1,
      statusId: 1,
      amount: 1500000,
      currency: "USD",
      methodId: 2,
      txnRef: "TXN123456790",
      paidAt: new Date("2024-12-15T10:30:00"),
      createdAt: new Date("2024-12-20T14:15:00"),
      userId: 0,
      updatedAt: new Date("2024-12-15T10:30:00")
    },
    {
      paymentId: 3,
      subscriptionId: 2,
      statusId: 3,
      amount: 800000,
      currency: "USD",
      methodId: 3,
      txnRef: "TXN123456791",
      paidAt: new Date("2024-12-15T10:30:00"),
      createdAt: new Date("2024-12-18T09:45:00"),
      userId: 0,
      updatedAt: new Date("2024-12-15T10:30:00")
    },
    {
      paymentId: 4,
      subscriptionId: 1,
      statusId: 4,
      amount: 500000,
      currency: "USD",
      methodId: 1,
      txnRef: "TXN987654321",
      paidAt: new Date("2024-12-10T16:20:00"),
      createdAt: new Date("2024-12-10T16:20:00"),
      userId: 0,
      updatedAt: new Date("2024-12-15T10:30:00")
    }
  ]
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPayments(mockPayments)
      setLoading(false)
    }
    fetchPayments()
  }, [])
  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 2:
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>
      case 3:
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
      case 4:
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><Receipt className="h-3 w-3 mr-1" /> Refunded</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  const getMethodIcon = (methodId: number) => {
    switch (methodId) {
      case 1:
        return <CreditCard className="h-4 w-4" />
      case 2:
        return <Banknote className="h-4 w-4" />
      case 3:
        return <Smartphone className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }
  const getMethodName = (methodId: number) => {
    switch (methodId) {
      case 1:
        return "Credit/Debit Card"
      case 2:
        return "Bank Transfer"
      case 3:
        return "Wallet"
      default:
        return "Unknown"
    }
  }
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.txnRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || payment.statusId.toString() === statusFilter
    const matchesMethod = methodFilter === "all" || payment.methodId.toString() === methodFilter
    const matchesDate = dateFilter === "all" ||
      (dateFilter === "today" && payment.paidAt && payment.paidAt.toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" && payment.paidAt && payment.paidAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && payment.paidAt && payment.paidAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  })
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDialogOpen(true)
  }
  const handleRefundPayment = (paymentId: number) => {
    if (confirm("Are You Sure You Want To Refund This Transaction?")) {
      setPayments(prev => prev.map(payment =>
        payment.paymentId === paymentId
          ? {
            ...payment,
            statusId: 4
          }
          : payment
      ))
    }
  }
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const successfulPayments = payments.filter(payment => payment.statusId === 2).length
  const failedPayments = payments.filter(payment => payment.statusId === 3).length
  const refundedPayments = payments.filter(payment => payment.statusId === 4).length
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
          <h1 className="text-3xl font-bold text-foreground">Payment History</h1>
          <p className="text-muted-foreground mt-2">
            Track And Manage Payment Transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              This Month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()} VND</div>
            <p className="text-xs text-muted-foreground">
              Total Payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulPayments}</div>
            <p className="text-xs text-muted-foreground">
              Successful Transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Refunded Transactions
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Transaction Code, Amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">Paid</SelectItem>
                  <SelectItem value="3">Failed</SelectItem>
                  <SelectItem value="4">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">Credit/Debit Card</SelectItem>
                  <SelectItem value="2">Bank Transfer</SelectItem>
                  <SelectItem value="3">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>
            {filteredPayments.length} Transaction(S) Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.paymentId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.methodId)}
                        <span className="font-medium">{payment.txnRef || `PAY-${payment.paymentId}`}</span>
                      </div>
                      {getStatusBadge(payment.statusId)}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Amount:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Method:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {getMethodName(payment.methodId)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Transaction Date:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {payment.paidAt ? payment.paidAt.toLocaleString('en-US') : 'Not Paid Yet'}
                        </div>
                      </div>
                      {payment.txnRef && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Transaction Code:</span>
                          </div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {payment.txnRef}
                          </div>
                        </div>
                      )}
                    </div>
                    {payment.statusId === 4 && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <div className="text-sm text-red-800">
                          <span className="font-medium">Refunded:</span> {payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Created At: {payment.createdAt.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payment.statusId === 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefundPayment(payment.paymentId)}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed Information About Payment Transaction
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Transaction Code</Label>
                  <Input value={selectedPayment.txnRef || `PAY-${selectedPayment.paymentId}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Payment ID</Label>
                  <Input value={selectedPayment.paymentId.toString()} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input value={`${selectedPayment.amount.toLocaleString()} ${selectedPayment.currency}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Input value={getMethodName(selectedPayment.methodId)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedPayment.statusId)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Transaction Date</Label>
                  <Input value={selectedPayment.paidAt ? selectedPayment.paidAt.toLocaleString('en-US') : 'Not Paid Yet'} disabled />
                </div>
              </div>
              {selectedPayment.statusId === 4 && (
                <div className="space-y-2">
                  <Label>Refund Information</Label>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="font-medium">Refund Amount:</span> {selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> Refunded
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {selectedPayment.statusId === 2 && (
                  <Button variant="destructive" onClick={() => handleRefundPayment(selectedPayment.paymentId)}>
                    <Receipt className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}