"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { DollarSign, Building2, CheckCircle, Clock, Calendar, TrendingUp, Download, Filter, CreditCard, Wallet } from "lucide-react"
import { AdminOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Textarea } from "../../../../components/ui/textarea"
import { useToast } from "../../../../components/ui/useToast"
export default function MembershipRevenuePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [membershipOrders, setMembershipOrders] = useState<any[]>([])
  const [memberships, setMemberships] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("packages")
  const { toast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    code: '',
    unitPrice: '' as string,
    description: ''
  })
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    unitPrice: '' as string,
    description: ''
  })
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      if (user.companyId) setSelectedCompanyId(String(user.companyId))
      fetchMembershipData()
    }
  }, [])
  const fetchMembershipData = async () => {
    try {
      setLoading(true)
      const apiService = (await import('../../../../lib/api')).apiService
      const companiesResponse = await apiService.getCompanies({ pageSize: 100 })
      const companiesData = companiesResponse.items || companiesResponse.data?.items || companiesResponse.Items || companiesResponse.data || []
      setCompanies(companiesData)
      const membershipPromises = companiesData.map((company: any) =>
        apiService.getMembershipOrders({ companyId: company.companyId, pageSize: 100 })
      )
      const membershipResponses = await Promise.all(membershipPromises)
      const ordersRaw = membershipResponses.flatMap((response: any) => (
        response.items || response.data?.items || response.Items || response.data || []
      ))
      const normalize = (o: any) => {
        return {
          membershipOrderId: o.membershipOrderId ?? o.membership_order_id ?? o.id ?? null,
          companyId: o.companyId ?? o.company_id ?? null,
          payerAccountId: o.payerAccountId ?? o.payer_account_id ?? null,
          payerAccount: o.payer ?? o.payerAccount ?? null,
          unitMonths: o.unitMonths ?? o.unit_months ?? 0,
          unitPrice: Number(o.unitPrice ?? o.unit_price ?? 0),
          amount: Number(o.amount ?? 0),
          startDate: o.startDate ?? o.start_date ?? null,
          endDate: o.endDate ?? o.end_date ?? null,
          paidAt: o.paidAt ?? o.paid_at ?? null,
          paymentMethod: o.paymentMethod ?? o.payment_method ?? null,
          note: o.note ?? null,
          membershipId: o.membershipId ?? o.membership_id ?? null,
          membership: o.membership ?? null,
        }
      }
      const ordersData = ordersRaw.map(normalize)
      const enrichedOrders = ordersData.map((order: any) => {
        const company = companiesData.find((c: any) => c.companyId === order.companyId)
        return {
          ...order,
          companyName: company?.name || `Company #${order.companyId}`,
          payerName: order.payerAccount?.fullName || (order.payerAccountId ? `#${order.payerAccountId}` : 'N/A')
        }
      })
      setMembershipOrders(enrichedOrders)
      try {
        const companyIdFilter = (currentUser?.companyId ? Number(currentUser.companyId) : (selectedCompanyId ? Number(selectedCompanyId) : undefined))
        const membershipsResponse = await apiService.getMemberships({ pageSize: 1000, companyId: companyIdFilter })
        const membershipsData = membershipsResponse.items || membershipsResponse.data?.items || membershipsResponse.Items || membershipsResponse.data || []
        setMemberships(membershipsData)
      } catch (e) {
        setMemberships([])
      }
    } catch (error) {
      setMembershipOrders([])
    } finally {
      setLoading(false)
    }
  }
  const paidOrders = membershipOrders.filter(o => !!o.paidAt)
  const activeMembershipCandidates = membershipOrders
    .map(o => o.membership)
    .filter((m: any) => !!m && (m.isActive === true || m.is_active === true))
  const activeMembershipMap = new Map<any, any>()
  for (const m of activeMembershipCandidates) {
    const id = m.membershipId ?? m.membership_id ?? m.id
    if (!activeMembershipMap.has(id)) activeMembershipMap.set(id, m)
  }
  const activeMembership = activeMembershipMap.size > 0 ? Array.from(activeMembershipMap.values())[0] : null
  const activeMembershipId = activeMembership ? (activeMembership.membershipId ?? activeMembership.membership_id ?? activeMembership.id) : null
  const currentRevenueVnd = activeMembershipId
    ? paidOrders.filter(o => o.membershipId === activeMembershipId).reduce((sum, o) => sum + (o.amount || 0), 0)
    : 0
  const currentPackageUnitPrice = activeMembership ? Number(activeMembership.unitPrice ?? activeMembership.unit_price ?? 0) : 0
  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        Unpaid
      </Badge>
    }
    switch (method) {
      case "CARD":
        return <Badge className="bg-blue-100 text-blue-800">
          <CreditCard className="w-3 h-3 mr-1" />
          Card
        </Badge>
      case "BANK":
        return <Badge className="bg-green-100 text-green-800">
          <Building2 className="w-3 h-3 mr-1" />
          Bank Transfer
        </Badge>
      case "CASH":
        return <Badge className="bg-yellow-100 text-yellow-800">
          <DollarSign className="w-3 h-3 mr-1" />
          Cash
        </Badge>
      case "WALLET":
        return <Badge className="bg-purple-100 text-purple-800">
          <Wallet className="w-3 h-3 mr-1" />
          E-Wallet
        </Badge>
      default:
        return <Badge>{method}</Badge>
    }
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const handleCreate = async () => {
    try {
      const apiService = (await import('../../../../lib/api')).apiService
      const resolvedCompanyId = currentUser?.companyId ? Number(currentUser.companyId) : (selectedCompanyId ? Number(selectedCompanyId) : undefined)
      if (!resolvedCompanyId) {
        toast({ title: 'Missing Information', description: 'Please Select A Company Before Creating A Package.' })
        return
      }
      if (!createForm.name || !createForm.code || !createForm.unitPrice) {
        toast({ title: 'Missing Information', description: 'Please Fill In All Required Fields.' })
        return
      }
      await apiService.createMembership({
        companyId: resolvedCompanyId,
        name: createForm.name.trim(),
        code: createForm.code.trim(),
        unitPrice: Number(createForm.unitPrice),
        description: createForm.description?.trim() || undefined,
        isActive: true
      })
      setCreateOpen(false)
      setCreateForm({ name: '', code: '', unitPrice: '', description: '' })
      toast({ title: 'Package Created Successfully' })
      await fetchMembershipData()
    } catch (e: any) {
      toast({ title: 'Creation Error', description: e?.message || 'Cannot Create Package' })
    }
  }
  const handleDelete = async (id: number) => {
    try {
      const apiService = (await import('../../../../lib/api')).apiService
      await apiService.deleteMembership(id)
      toast({ title: 'Package Deleted' })
      await fetchMembershipData()
    } catch (e: any) {
      toast({ title: 'Cannot Delete', description: e?.message || 'Package May Have Orders' })
    }
  }
  const openEdit = (pkg: any) => {
    setEditId(pkg.id)
    setEditForm({
      name: pkg.name || '',
      code: pkg.code || '',
      unitPrice: String(pkg.unitPrice ?? ''),
      description: pkg.description || ''
    })
    setEditOpen(true)
  }
  const handleEditSave = async () => {
    if (!editId) return
    if (!editForm.name || !editForm.code || !editForm.unitPrice) {
      toast({ title: 'Missing Information', description: 'Please Enter Name, Code And Unit Price.' })
      return
    }
    try {
      const apiService = (await import('../../../../lib/api')).apiService
      await apiService.updateMembership(editId, {
        name: editForm.name.trim(),
        code: editForm.code.trim(),
        unitPrice: Number(editForm.unitPrice),
        description: editForm.description?.trim() || undefined,
      })
      toast({ title: 'Package Updated Successfully' })
      setEditOpen(false)
      setEditId(null)
      await fetchMembershipData()
    } catch (e: any) {
      toast({ title: 'Update Error', description: e?.message || 'Cannot Update Package' })
    }
  }
  return (
    <AdminOnly>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-red-400">
            Membership Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-red-200 mt-1">
            Track Revenue, Service Packages And Payment History
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Current Package Revenue</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {(currentRevenueVnd / 1000000).toFixed(1)}M VND
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Current Package Price</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currentPackageUnitPrice?.toLocaleString()} VND
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">/ Month</p>
                </div>
                <DollarSign className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="packages">Membership Packages</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="packages">
            <Card className="bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Manage Membership Packages</CardTitle>
                    <CardDescription>Create, Enable/Disable, Delete Packages</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!currentUser?.companyId && (
                      <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap">Company</Label>
                        <Select value={selectedCompanyId} onValueChange={(v) => setSelectedCompanyId(v)}>
                          <SelectTrigger className="w-56">
                            <SelectValue placeholder="Select Company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((c: any) => (
                              <SelectItem key={c.companyId} value={String(c.companyId)}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                      <DialogTrigger asChild>
                        <Button>Create New Package</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Membership Package</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label>Package Name</Label>
                            <Input value={createForm.name} onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Example: Standard" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Package Code</Label>
                            <Input value={createForm.code} onChange={(e) => setCreateForm(f => ({ ...f, code: e.target.value }))} placeholder="Example: STD" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Unit Price (VND/Month)</Label>
                            <Input type="number" inputMode="numeric" value={createForm.unitPrice} onChange={(e) => setCreateForm(f => ({ ...f, unitPrice: e.target.value }))} placeholder="1000000" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea value={createForm.description} onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))} placeholder="Short Description" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreate}>Create</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const derivedPkgs = memberships.map((m: any) => ({
                    id: m.membershipId ?? m.membership_id ?? m.id,
                    code: m.code ?? m.Code,
                    name: m.name ?? m.Name,
                    unitPrice: m.unitPrice ?? m.unit_price ?? 0,
                    isActive: (m.isActive ?? m.is_active) === true,
                    companyId: m.companyId ?? m.company_id,
                    description: m.description ?? m.Description ?? ''
                  }))
                  if (derivedPkgs.length === 0) {
                    return <div className="p-6 text-center text-gray-600">No Package Data Yet</div>
                  }
                  const activeByCompany = new Map<number, boolean>()
                  for (const m of derivedPkgs) {
                    if (!activeByCompany.has(m.companyId)) activeByCompany.set(m.companyId, false)
                    if (m.isActive) activeByCompany.set(m.companyId, true)
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {derivedPkgs.map((pkg: any) => {
                        const hasOrders = membershipOrders.some(o => o.membershipId === pkg.id)
                        const anotherActiveExists = (activeByCompany.get(pkg.companyId) === true) && !pkg.isActive
                        const toggleLabel = pkg.isActive ? 'Disable' : 'Enable'
                        return (
                          <Card key={pkg.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">Package</p>
                                  <p className="text-lg font-semibold">{pkg.name ? `${pkg.name} (#${pkg.id})` : `#${pkg.id}`}</p>
                                  {pkg.code && <p className="text-xs text-gray-500">Code: {pkg.code}</p>}
                                  <p className="text-sm text-gray-500">Unit Price: {Number(pkg.unitPrice || 0).toLocaleString()} VND/Month</p>
                                  <p className={`text-xs mt-1 ${pkg.isActive ? 'text-green-600' : 'text-gray-500'}`}>Status: {pkg.isActive ? 'Enabled' : 'Disabled'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  disabled={!pkg.isActive && anotherActiveExists}
                                  title={!pkg.isActive && anotherActiveExists ? 'There Is Already An Enabled Package In This Company' : ''}
                                  onClick={async () => {
                                    try {
                                      const apiService = (await import('../../../../lib/api')).apiService
                                      if (pkg.isActive) {
                                        await apiService.deactivateMembership(pkg.id)
                                      } else {
                                        await apiService.activateMembership(pkg.id)
                                      }
                                      toast({ title: pkg.isActive ? 'Package Disabled' : 'Package Enabled' })
                                      await fetchMembershipData()
                                    } catch (e: any) {
                                      toast({ title: 'Cannot Change Status', description: e?.message || 'Please Try Again' })
                                    }
                                  }}
                                >{toggleLabel}</Button>
                                <Button variant="outline" disabled={hasOrders} title={hasOrders ? 'Cannot Edit: Package Has Orders' : ''} onClick={() => openEdit(pkg)}>Edit</Button>
                                <Button variant="destructive" disabled={hasOrders} title={hasOrders ? 'Cannot Delete: Package Has Orders' : ''} onClick={() => handleDelete(pkg.id)}>Delete</Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card className="bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-red-400">
                      Membership Order History
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-red-200">
                      List Of All Membership Package Orders
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-red-200">Loading Data...</p>
                  </div>
                ) : membershipOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-red-200">No Membership Orders Yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {membershipOrders.map((order) => (
                      <Card key={order.membershipOrderId} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                {order.companyName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
                                Order #{order.membershipOrderId} - Paid By: {order.payerName}
                              </p>
                            </div>
                            {getPaymentMethodBadge(order.paymentMethod)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                              <p className="text-xs text-gray-600 dark:text-blue-300">Duration</p>
                              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                {order.unitMonths} Months
                              </p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                              <p className="text-xs text-gray-600 dark:text-purple-300">Unit Price</p>
                              <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                                {order.unitPrice.toLocaleString()} VND
                              </p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mb-1" />
                              <p className="text-xs text-gray-600 dark:text-green-300">Total Amount</p>
                              <p className="text-sm font-bold text-green-900 dark:text-green-100">
                                {order.amount.toLocaleString()} VND
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-1" />
                              <p className="text-xs text-gray-600 dark:text-orange-300">Time</p>
                              <p className="text-xs font-semibold text-orange-900 dark:text-orange-100">
                                {formatDate(order.startDate)}
                              </p>
                              <p className="text-xs text-orange-700 dark:text-orange-200">
                                To {formatDate(order.endDate)}
                              </p>
                            </div>
                          </div>
                          {order.paidAt && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Paid At: {formatDateTime(order.paidAt)}
                              </p>
                            </div>
                          )}
                          {order.note && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                <strong>Note:</strong> {order.note}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Membership Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Package Name</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Package Code</Label>
                <Input value={editForm.code} onChange={(e) => setEditForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Unit Price (VND/Month)</Label>
                <Input type="number" inputMode="numeric" value={editForm.unitPrice} onChange={(e) => setEditForm(f => ({ ...f, unitPrice: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminOnly>
  )
}