"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Badge } from "../../../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../components/ui/dialog"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Users, Search, Filter, Plus, Building2, MapPin, Calendar, Clock, CheckCircle, XCircle, Eye, FileText } from "lucide-react"
interface JobApplication {
  applicationId: number;
  driverId: number;
  companyId: number;
  companyName: string;
  companyContact: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  position: string;
  salary: number;
  commissionRate: number;
  requirements: string[];
  benefits: string[];
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  appliedDate: Date;
  reviewedDate?: Date;
  interviewDate?: Date;
  notes?: string;
  responseMessage?: string;
}
export default function DriverApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
  const mockApplications: JobApplication[] = [
    {
      applicationId: 1,
      driverId: 1,
      companyId: 1,
      companyName: "ABC Taxi Company",
      companyContact: "Nguyen Van A",
      companyPhone: "0123-456-789",
      companyEmail: "hr@abctaxi.com",
      companyAddress: "123 ABC Street, District 1, HCMC",
      position: "Taxi Driver",
      salary: 8000000,
      commissionRate: 15,
      requirements: ["B2 License", "2+ Years Experience", "Basic English"],
      benefits: ["Health Insurance", "Fuel Allowance", "Sales Bonus"],
      status: "interviewed",
      appliedDate: new Date("2024-12-15"),
      reviewedDate: new Date("2024-12-16"),
      interviewDate: new Date("2024-12-20"),
      notes: "Good Interview, Waiting For Final Result",
      responseMessage: "Thank You For Participating In The Interview. We Will Notify You Of The Results Within 3 Days."
    },
    {
      applicationId: 2,
      driverId: 1,
      companyId: 2,
      companyName: "XYZ Transport",
      companyContact: "Tran Thi B",
      companyPhone: "0987-654-321",
      companyEmail: "careers@xyztransport.com",
      companyAddress: "456 XYZ Street, District 2, HCMC",
      position: "7-Seat Car Driver",
      salary: 9000000,
      commissionRate: 18,
      requirements: ["B2 License", "3+ Years Experience", "Know HCMC Routes"],
      benefits: ["Health Insurance", "Lunch Allowance", "Monthly Bonus"],
      status: "accepted",
      appliedDate: new Date("2024-12-10"),
      reviewedDate: new Date("2024-12-12"),
      interviewDate: new Date("2024-12-18"),
      notes: "Accepted, Starting Work From 01/01/2025",
      responseMessage: "Congratulations! You Have Been Accepted For The 7-Seat Car Driver Position. Please Contact Us To Complete The Hiring Process."
    },
    {
      applicationId: 3,
      driverId: 1,
      companyId: 3,
      companyName: "Green Taxi",
      companyContact: "Le Van C",
      companyPhone: "0369-258-147",
      companyEmail: "jobs@greentaxi.com",
      companyAddress: "789 Green Street, District 3, HCMC",
      position: "Electric Taxi Driver",
      salary: 7500000,
      commissionRate: 12,
      requirements: ["B2 License", "1+ Years Experience", "Environmental Awareness"],
      benefits: ["Health Insurance", "Electric Vehicle Training", "Green Bonus"],
      status: "rejected",
      appliedDate: new Date("2024-12-05"),
      reviewedDate: new Date("2024-12-08"),
      notes: "Insufficient Experience With Electric Vehicles",
      responseMessage: "Thank You For Your Interest In The Position. However, We Have Selected Another Candidate Who Is More Suitable. Good Luck!"
    },
    {
      applicationId: 4,
      driverId: 1,
      companyId: 4,
      companyName: "Fast Taxi",
      companyContact: "Pham Thi D",
      companyPhone: "0247-135-246",
      companyEmail: "recruitment@fasttaxi.com",
      companyAddress: "321 Fast Street, District 7, HCMC",
      position: "Premium Taxi Driver",
      salary: 12000000,
      commissionRate: 20,
      requirements: ["B2 License", "5+ Years Experience", "Good English", "Own Car"],
      benefits: ["Health Insurance", "High Allowance", "Generous Bonus", "Paid Leave"],
      status: "pending",
      appliedDate: new Date("2024-12-22"),
      notes: "Premium Position, Strict Requirements"
    }
  ]
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setApplications(mockApplications)
      setLoading(false)
    }
    fetchApplications()
  }, [])
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending Review</Badge>
      case "reviewed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Eye className="h-3 w-3 mr-1" /> Reviewed</Badge>
      case "interviewed":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><Users className="h-3 w-3 mr-1" /> Interviewed</Badge>
      case "accepted":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.companyAddress.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }
  const handleWithdrawApplication = (applicationId: number) => {
    if (confirm("Are You Sure You Want To Withdraw This Application?")) {
      setApplications(prev => prev.filter(app => app.applicationId !== applicationId))
    }
  }
  const pendingApplications = applications.filter(app => app.status === "pending")
  const reviewedApplications = applications.filter(app => app.status === "reviewed")
  const acceptedApplications = applications.filter(app => app.status === "accepted")
  const rejectedApplications = applications.filter(app => app.status === "rejected")
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
          <h1 className="text-3xl font-bold text-foreground">Manage Applications</h1>
          <p className="text-muted-foreground mt-2">
            Track And Manage Your Job Applications
          </p>
        </div>
        <Button onClick={() => setIsNewApplicationOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Applications Pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Already Reviewed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Successful
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Unsuccessful
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search By Company, Position..."
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
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
          <CardTitle>Application List</CardTitle>
          <CardDescription>
            {filteredApplications.length} Application(S) Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.applicationId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{application.companyName}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Position:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.position}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Address:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.companyAddress}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Salary:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.salary.toLocaleString()} VND/Month
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Applied:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.appliedDate.toLocaleDateString('en-US')}
                        </div>
                      </div>
                    </div>
                    {application.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {application.notes}
                      </div>
                    )}
                    {application.responseMessage && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-sm text-blue-800">
                          <span className="font-medium">Company Response:</span> {application.responseMessage}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(application.status === "pending" || application.status === "reviewed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.applicationId)}
                      >
                        <XCircle className="h-4 w-4" />
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed Information About Job Application
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={selectedApplication.companyName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={selectedApplication.position} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input value={`${selectedApplication.salary.toLocaleString()} VND/Month`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Commission</Label>
                  <Input value={`${selectedApplication.commissionRate}%`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input value={selectedApplication.companyContact} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={selectedApplication.companyPhone} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={selectedApplication.companyEmail} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company Address</Label>
                <Textarea value={selectedApplication.companyAddress} disabled rows={2} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <ul className="space-y-1">
                      {selectedApplication.requirements.map((req, index) => (
                        <li key={index} className="text-sm">• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Benefits</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <ul className="space-y-1">
                      {selectedApplication.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm">• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Application Date</Label>
                  <Input value={selectedApplication.appliedDate.toLocaleDateString('en-US')} disabled />
                </div>
                {selectedApplication.reviewedDate && (
                  <div className="space-y-2">
                    <Label>Review Date</Label>
                    <Input value={selectedApplication.reviewedDate.toLocaleDateString('en-US')} disabled />
                  </div>
                )}
                {selectedApplication.interviewDate && (
                  <div className="space-y-2">
                    <Label>Interview Date</Label>
                    <Input value={selectedApplication.interviewDate.toLocaleDateString('en-US')} disabled />
                  </div>
                )}
              </div>
              {selectedApplication.notes && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={selectedApplication.notes} disabled rows={3} />
                </div>
              )}
              {selectedApplication.responseMessage && (
                <div className="space-y-2">
                  <Label>Company Response</Label>
                  <Textarea value={selectedApplication.responseMessage} disabled rows={3} />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {(selectedApplication.status === "pending" || selectedApplication.status === "reviewed") && (
                  <Button
                    variant="destructive"
                    onClick={() => handleWithdrawApplication(selectedApplication.applicationId)}
                  >
                    Withdraw Application
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isNewApplicationOpen} onOpenChange={setIsNewApplicationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
            <DialogDescription>
              Search And Apply For Suitable Positions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Search Company</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter Company Name Or Position..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">District 1</SelectItem>
                  <SelectItem value="q2">District 2</SelectItem>
                  <SelectItem value="q3">District 3</SelectItem>
                  <SelectItem value="q7">District 7</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="mpv">MPV</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewApplicationOpen(false)}>
                Cancel
              </Button>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}