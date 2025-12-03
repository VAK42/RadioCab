"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Switch } from "../../../../components/ui/switch"
import { Plus, Edit, Trash2, Search, Car, X } from "lucide-react"
import { CompanyStaffOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../../lib/api"

export default function VehicleSegmentsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [segments, setSegments] = useState<any[]>([])
  const [filteredSegments, setFilteredSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingSegment, setEditingSegment] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      fetchVehicleSegments(user.companyId)
    } else {
      alert('Please Login To View Vehicle Data')
    }
  }, [])
  const fetchVehicleSegments = async (companyId: number) => {
    try {
      setLoading(true)
      const response = await apiService.getVehicleSegments({ companyId, pageSize: 1000 })
      setSegments(response.items || [])
      setFilteredSegments(response.items || [])
    } catch (error) {
      alert(`Error Loading Data: ${error}`)
      setSegments([])
      setFilteredSegments([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    let filtered = segments
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(segment =>
        segment.name?.toLowerCase().includes(query) ||
        segment.code?.toLowerCase().includes(query) ||
        segment.description?.toLowerCase().includes(query)
      )
    }
    setFilteredSegments(filtered)
  }, [searchQuery, segments])
  const handleDelete = async (segmentId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Segment?')) return
    try {
      const result = await apiService.deleteVehicleSegment(segmentId)
      alert('Delete Segment Successfully!')
      if (currentUser) {
        fetchVehicleSegments(currentUser.companyId)
      }
    } catch (error: any) {
      let errorMessage = 'Cannot Delete Segment'
      if (error.message && error.message.includes('404')) {
        errorMessage = 'Segment Not Found'
      } else if (error.message && (error.message.includes('foreign key') || error.message.includes('constraint'))) {
        errorMessage = 'Cannot Delete Segment Because It Is In Use'
      } else if (error.message) {
        errorMessage = error.message
      }
      alert(`Error: ${errorMessage}`)
    }
  }
  const openCreateSegmentDialog = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      isActive: true
    })
    setShowCreateDialog(true)
  }
  const openEditSegmentDialog = (segment: any) => {
    setEditingSegment(segment)
    setFormData({
      name: segment.name || '',
      code: segment.code || '',
      description: segment.description || '',
      isActive: segment.isActive
    })
    setShowEditDialog(true)
  }
  const handleCreateSegment = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please Enter Segment Name')
        return
      }
      if (!formData.code.trim()) {
        alert('Please Enter Segment Code')
        return
      }
      const segmentData = {
        ...formData,
        companyId: currentUser.companyId
      }
      await apiService.createVehicleSegment(segmentData)
      alert('Create Segment Successfully!')
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true
      })
      setShowCreateDialog(false)
      if (currentUser) {
        fetchVehicleSegments(currentUser.companyId)
      }
    } catch (error: any) {
      let errorMessage = 'Cannot Create Segment'
      if (error.message && error.message.includes('duplicate')) {
        errorMessage = 'Segment Code Already Exists'
      } else if (error.message && error.message.includes('unique')) {
        errorMessage = 'Segment Code Already Exists'
      }
      alert(`Error: ${errorMessage}`)
    }
  }
  const handleEditSegment = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please Enter Segment Name')
        return
      }
      if (!formData.code.trim()) {
        alert('Please Enter Segment Code')
        return
      }
      const segmentData = {
        ...formData,
        segmentId: editingSegment.segmentId
      }
      await apiService.updateVehicleSegment(segmentData)
      alert('Update Segment Successfully!')
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true
      })
      setShowEditDialog(false)
      if (currentUser) {
        fetchVehicleSegments(currentUser.companyId)
      }
    } catch (error: any) {
      let errorMessage = 'Cannot Update Segment'
      if (error.message && error.message.includes('duplicate')) {
        errorMessage = 'Segment Code Already Exists'
      } else if (error.message && error.message.includes('unique')) {
        errorMessage = 'Segment Code Already Exists'
      }
      alert(`Error: ${errorMessage}`)
    }
  }
  return (
    <CompanyStaffOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <Car className="w-8 h-8" />
              Phân khúc xe (Segments)
            </h1>
            <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
              Quản lý các phân khúc xe của công ty
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateSegmentDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Segment mới
          </Button>
        </div>
        {!loading && segments.length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/90 mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên segment, mã segment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 truncate"
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-yellow-300">
                    {filteredSegments.length} / {segments.length} segment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-yellow-200">Loading Data...</p>
            </CardContent>
          </Card>
        ) : segments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Segments Found</p>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateSegmentDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Segment
              </Button>
            </CardContent>
          </Card>
        ) : filteredSegments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Segments Found</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-4">
                Clear Filter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSegments.map(segment => (
              <Card key={segment.segmentId} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                          {segment.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-yellow-200">
                          {segment.code}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={segment.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {segment.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-yellow-200 mb-4">
                    {segment.description || 'No Description'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditSegmentDialog(segment)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(segment.segmentId)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vehicle Segment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Segment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Segment Name"
                  required
                  className="truncate"
                />
              </div>
              <div>
                <Label htmlFor="code">Segment Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter Segment Code"
                  required
                  className="truncate"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Segment Description"
                  className="truncate"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSegment}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vehicle Segment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Segment Name *</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Segment Name"
                  required
                  className="truncate"
                />
              </div>
              <div>
                <Label htmlFor="editCode">Segment Code *</Label>
                <Input
                  id="editCode"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter Segment Code"
                  required
                  className="truncate"
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Segment Description"
                  className="truncate"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSegment}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyStaffOnly >
  )
}