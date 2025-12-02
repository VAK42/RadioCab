"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Badge } from "../../../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Users, Search, Filter, Plus, Phone, Mail, MapPin, Calendar, Clock, DollarSign, MessageSquare, CheckCircle, XCircle, AlertCircle, Eye, Edit, Trash2 } from "lucide-react"
interface Lead {
  leadId: number
  companyId: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceType: string
  pickupLocation?: string
  destination?: string
  pickupTime?: Date
  estimatedFare?: number
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  source: string
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}
export default function CompanyLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const mockLeads: Lead[] = [
    {
      leadId: 1,
      companyId: 1,
      customerName: "Nguyen Van A",
      customerPhone: "0123-456-789",
      customerEmail: "nguyenvana@email.com",
      serviceType: "Airport Taxi",
      pickupLocation: "Tan Son Nhat Airport",
      destination: "District 1, HCMC",
      pickupTime: new Date("2024-12-25T08:00:00"),
      estimatedFare: 150000,
      status: "new",
      notes: "Customer Requested 4-Seat Car",
      source: "Website",
      priority: "high",
      createdAt: new Date("2024-12-20T10:30:00"),
      updatedAt: new Date("2024-12-20T10:30:00")
    },
    {
      leadId: 2,
      companyId: 1,
      customerName: "Tran Thi B",
      customerPhone: "0987-654-321",
      customerEmail: "tranthib@email.com",
      serviceType: "City Taxi",
      pickupLocation: "District 2, HCMC",
      destination: "District 7, HCMC",
      pickupTime: new Date("2024-12-26T14:00:00"),
      estimatedFare: 80000,
      status: "contacted",
      notes: "Customer Contacted, Waiting For Confirmation",
      source: "Hotline",
      priority: "medium",
      createdAt: new Date("2024-12-19T15:45:00"),
      updatedAt: new Date("2024-12-20T09:15:00")
    },
    {
      leadId: 3,
      companyId: 1,
      customerName: "Le Van C",
      customerPhone: "0369-258-147",
      customerEmail: "levanc@email.com",
      serviceType: "Hourly Taxi",
      pickupLocation: "District 3, HCMC",
      destination: "District 10, HCMC",
      pickupTime: new Date("2024-12-27T09:00:00"),
      estimatedFare: 200000,
      status: "confirmed",
      notes: "Customer Confirmed, Need To Prepare Car",
      source: "App",
      priority: "high",
      createdAt: new Date("2024-12-18T11:20:00"),
      updatedAt: new Date("2024-12-21T16:30:00")
    }
  ]
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLeads(mockLeads)
      setLoading(false)
    }
    fetchLeads()
  }, [])
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" /> New</Badge>
      case "contacted":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Contacted</Badge>
      case "quoted":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><DollarSign className="h-3 w-3 mr-1" /> Quoted</Badge>
      case "confirmed":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Confirmed</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customerPhone.includes(searchTerm) ||
      lead.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })
  const handleStatusUpdate = (leadId: number, newStatus: string) => {
    setLeads(prev => prev.map(lead =>
      lead.leadId === leadId
        ? { ...lead, status: newStatus as any, updatedAt: new Date() }
        : lead
    ))
  }
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }
  const handleDeleteLead = (leadId: number) => {
    if (confirm("Are You Sure You Want To Delete This Lead?")) {
      setLeads(prev => prev.filter(lead => lead.leadId !== leadId))
    }
  }
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
          <h1 className="text-3xl font-bold text-foreground">Manage Leads</h1>
          <p className="text-muted-foreground mt-2">
            Track And Manage Potential Customers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Lead
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% From Last Month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "new").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need Immediate Action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              In Progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Success
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search By Name, Phone, Service..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
          <CardTitle>Leads List</CardTitle>
          <CardDescription>
            {filteredLeads.length} Lead(S) Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.leadId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{lead.customerName}</h3>
                      {getStatusBadge(lead.status)}
                      {getPriorityBadge(lead.priority)}
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lead.customerPhone}
                      </div>
                      {lead.customerEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {lead.customerEmail}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {lead.serviceType}
                      </div>
                      {lead.estimatedFare && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {lead.estimatedFare.toLocaleString()} VND
                        </div>
                      )}
                    </div>
                    {lead.pickupLocation && lead.destination && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Route:</span> {lead.pickupLocation} → {lead.destination}
                      </div>
                    )}
                    {lead.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {lead.notes}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Created At: {lead.createdAt.toLocaleString('en-US')} • Source: {lead.source}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.leadId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <DialogTitle>
              {isEditMode ? "Edit Lead" : "Lead Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update Lead Information" : "View Detailed Lead Information"}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={selectedLead.customerName}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={selectedLead.customerPhone}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={selectedLead.customerEmail || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Input
                    value={selectedLead.serviceType}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <Input
                    value={selectedLead.pickupLocation || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input
                    value={selectedLead.destination || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pickup Time</Label>
                  <Input
                    type="datetime-local"
                    value={selectedLead.pickupTime ? selectedLead.pickupTime.toISOString().slice(0, 16) : ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Price</Label>
                  <Input
                    type="number"
                    value={selectedLead.estimatedFare || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedLead.status}
                    disabled={!isEditMode}
                    onValueChange={(value) => handleStatusUpdate(selectedLead.leadId, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select
                    value={selectedLead.priority}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={selectedLead.notes || ""}
                  disabled={!isEditMode}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {isEditMode && (
                  <Button>
                    Save Changes
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