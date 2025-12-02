"use client"
import { useEffect, useState } from "react"
import { AdminOnly } from "../../../../components/roleBasedAccess"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Building2, Mail, Phone, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { useToast } from "../../../../components/ui/useToast"
export default function NewRegistrationsPage() {
  const [companiesNew, setCompaniesNew] = useState<any[]>([])
  const [companiesRefused, setCompaniesRefused] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const { toast } = useToast()
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const apiService = (await import("../../../../lib/api")).apiService
        const res = await apiService.getCompanies({ pageSize: 1000 })
        const items = (res as any).items || (res as any).data?.items || (res as any).Items || (res as any).data || []
        const normalized = items.map((c: any) => ({
          companyId: c.companyId ?? c.company_id,
          name: c.name,
          hotline: c.hotline,
          email: c.email,
          address: c.address,
          taxCode: c.taxCode ?? c.tax_code,
          status: c.status,
          createdAt: c.createdAt ?? c.created_at,
        }))
        setCompaniesNew(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'NEW')))
        setCompaniesRefused(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'REFUSED')))
      } catch (e) {
        setCompaniesNew([])
        setCompaniesRefused([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  const openDetail = (c: any) => {
    setSelected(c)
    setDetailOpen(true)
  }
  const approve = async () => {
    if (!selected) return
    try {
      const apiService = (await import("../../../../lib/api")).apiService
      await apiService.updateCompany(selected.companyId, { status: 'APPROVE' })
      toast({ title: 'Registration Approved' })
      setDetailOpen(false)
      setSelected(null)
      setLoading(true)
      const res = await apiService.getCompanies({ pageSize: 1000 })
      const items = (res as any).items || (res as any).data?.items || (res as any).Items || (res as any).data || []
      const normalized = items.map((c: any) => ({
        companyId: c.companyId ?? c.company_id,
        name: c.name,
        hotline: c.hotline,
        email: c.email,
        address: c.address,
        taxCode: c.taxCode ?? c.tax_code,
        status: c.status,
        createdAt: c.createdAt ?? c.created_at,
      }))
      setCompaniesNew(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'NEW')))
      setCompaniesRefused(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'REFUSED')))
    } catch (e: any) {
      toast({ title: 'Cannot Approve', description: e?.message || 'Please Try Again' })
    } finally {
      setLoading(false)
    }
  }
  const refuse = async () => {
    if (!selected) return
    try {
      const apiService = (await import("../../../../lib/api")).apiService
      await apiService.updateCompany(selected.companyId, { status: 'REFUSED' })
      toast({ title: 'Registration Refused' })
      setDetailOpen(false)
      setSelected(null)
      setLoading(true)
      const res = await apiService.getCompanies({ pageSize: 1000 })
      const items = (res as any).items || (res as any).data?.items || (res as any).Items || (res as any).data || []
      const normalized = items.map((c: any) => ({
        companyId: c.companyId ?? c.company_id,
        name: c.name,
        hotline: c.hotline,
        email: c.email,
        address: c.address,
        taxCode: c.taxCode ?? c.tax_code,
        status: c.status,
        createdAt: c.createdAt ?? c.created_at,
      }))
      setCompaniesNew(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'NEW')))
      setCompaniesRefused(normalized.filter((c: any) => (String(c.status).toUpperCase() === 'REFUSED')))
    } catch (e: any) {
      toast({ title: 'Cannot Refuse', description: e?.message || 'Please Try Again' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <AdminOnly>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-red-400">New Registrations</h1>
          <p className="text-sm text-gray-600 dark:text-red-200 mt-1">List Of Companies With NEW Status</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="pending">Approve Registration</TabsTrigger>
            <TabsTrigger value="refused">Refusal History</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card className="bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="text-xl">Pending Companies</CardTitle>
                <CardDescription>Showing Max 1000 New Records</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-red-200">Loading Data...</p>
                  </div>
                ) : companiesNew.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">No New Registrations</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companiesNew.map((c) => (
                      <Card key={c.companyId} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-gray-500" />
                              <p className="text-lg font-semibold">{c.name}</p>
                            </div>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">NEW</Badge>
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{c.hotline}</div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{c.address}</div>
                            <div>Tax Code: {c.taxCode}</div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" onClick={() => openDetail(c)}>View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="refused">
            <Card className="bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="text-xl">Refusal History</CardTitle>
                <CardDescription>Companies With REFUSED Status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-red-200">Loading Data...</p>
                  </div>
                ) : companiesRefused.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">No Refused Records</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companiesRefused.map((c) => (
                      <Card key={c.companyId} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-gray-500" />
                              <p className="text-lg font-semibold">{c.name}</p>
                            </div>
                            <Badge variant="outline" className="border-red-500 text-red-700">REFUSED</Badge>
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{c.hotline}</div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{c.address}</div>
                            <div>Tax Code: {c.taxCode}</div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" onClick={() => openDetail(c)}>View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Company Information</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div><strong>Name:</strong> {selected.name}</div>
                <div><strong>Hotline:</strong> {selected.hotline}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                <div><strong>Address:</strong> {selected.address}</div>
                <div><strong>Tax Code:</strong> {selected.taxCode}</div>
                <div><strong>Status:</strong> {String(selected.status).toUpperCase()}</div>
              </div>
            )}
            {activeTab === 'pending' && (
              <DialogFooter>
                <Button onClick={approve}>Approve</Button>
                <Button variant="destructive" onClick={refuse}>Refuse</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminOnly>
  )
}