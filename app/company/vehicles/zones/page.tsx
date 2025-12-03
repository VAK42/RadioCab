"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Switch } from "../../../../components/ui/switch"
import { MapPin, Plus, Edit, Trash2, Car, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { CompanyStaffOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../../lib/api"
export default function VehicleZonesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [zones, setZones] = useState<any[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [availableWards, setAvailableWards] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedZone, setExpandedZone] = useState<number | null>(null)
  const [showingVehiclesFor, setShowingVehiclesFor] = useState<number | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showWardDialog, setShowWardDialog] = useState(false)
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false)
  const [editingZone, setEditingZone] = useState<any>(null)
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    provinceId: '',
    isActive: true
  })
  const [wardFormData, setWardFormData] = useState({
    wardId: ''
  })
  const [vehicleFormData, setVehicleFormData] = useState({
    vehicleId: '',
    priority: '100'
  })
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      fetchZones(user.companyId)
    }
  }, [])
  const fetchZones = async (companyId: number) => {
    try {
      setLoading(true)
      const [zonesResponse, wardsResponse, provincesResponse, vehiclesResponse] = await Promise.all([
        apiService.getZones({ companyId, pageSize: 1000 }),
        apiService.getWards({ pageSize: 1000 }),
        apiService.getProvinces({ pageSize: 100 }),
        apiService.getVehicles({ companyId, pageSize: 1000 })
      ])
      const zonesWithWards = zonesResponse.items?.map((zone: any) => {
        const wards = zone.zoneWards?.map((zw: any) => {
          const ward = zw.ward || wardsResponse.items?.find((w: any) => w.wardId === zw.wardId)
          return ward ? {
            ...ward,
            zoneWardId: zw.zoneId
          } : null
        }).filter((ward: any) => ward !== null) || []
        return {
          ...zone,
          wards: wards
        }
      }) || []
      setZones(zonesWithWards)
      setProvinces(provincesResponse.items || [])
      setWards(wardsResponse.items || [])
      setVehicles(vehiclesResponse.items || [])
    } catch (error) {
      setZones([])
      setProvinces([])
      setWards([])
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }
  const getVehiclesForZone = (zoneId: number) => {
    return vehicles.filter((v: any) =>
      v.vehicleZonePreferences?.some((vzp: any) => vzp.zoneId === zoneId)
    ).map((v: any) => {
      const preference = v.vehicleZonePreferences?.find((vzp: any) => vzp.zoneId === zoneId)
      return {
        ...v,
        priority: preference?.priority || 100
      }
    }).sort((a: any, b: any) => a.priority - b.priority)
  }
  const toggleZone = (zoneId: number) => {
    setExpandedZone(expandedZone === zoneId ? null : zoneId)
  }
  const openCreateZoneDialog = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      provinceId: '',
      isActive: true
    })
    setShowCreateDialog(true)
  }
  const openEditZoneDialog = (zone: any) => {
    setEditingZone(zone)
    setFormData({
      name: zone.name || '',
      code: zone.code || '',
      description: zone.description || '',
      provinceId: zone.provinceId?.toString() || '',
      isActive: zone.isActive
    })
    setShowEditDialog(true)
  }
  const openWardDialog = (zone: any) => {
    setEditingZone(zone)
    const currentWardIds = zone.wards?.map((w: any) => w.wardId) || []
    const available = wards.filter(w => w.provinceId === zone.provinceId && !currentWardIds.includes(w.wardId))
    setAvailableWards(available)
    setWardFormData({
      wardId: ''
    })
    setShowWardDialog(true)
  }
  const handleCreateZone = async () => {
    try {
      const zoneData = {
        ...formData,
        companyId: currentUser.companyId,
        provinceId: parseInt(formData.provinceId)
      }
      await apiService.createZone(zoneData)
      alert('Create Zone Successfully!')
      setShowCreateDialog(false)
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Create Zone'}`)
    }
  }
  const handleEditZone = async () => {
    try {
      const zoneData = {
        ...formData,
        zoneId: editingZone.zoneId,
        companyId: currentUser.companyId,
        provinceId: parseInt(formData.provinceId)
      }
      await apiService.updateZone(editingZone.zoneId, zoneData)
      alert('Update Zone Successfully!')
      setShowEditDialog(false)
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Update Zone'}`)
    }
  }
  const handleAddWard = async () => {
    try {
      if (!wardFormData.wardId) {
        alert('Please Select Ward')
        return
      }
      await apiService.addWardToZone(editingZone.zoneId, parseInt(wardFormData.wardId))
      alert('Add Ward Successfully!')
      setShowWardDialog(false)
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Add Ward'}`)
    }
  }
  const handleRemoveWard = async (zoneId: number, wardId: number) => {
    if (!confirm('Are You Sure You Want To Remove This Ward From Zone?')) return
    try {
      await apiService.removeWardFromZone(zoneId, wardId)
      alert('Remove Ward Successfully!')
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Remove Ward'}`)
    }
  }
  const handleDeleteZone = async (zoneId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Zone?')) return
    try {
      await apiService.deleteZone(zoneId)
      alert('Delete Zone Successfully!')
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      let errorMessage = 'Cannot Delete Zone'
      if (error.message && (
        error.message.toLowerCase().includes('foreign key') ||
        error.message.toLowerCase().includes('constraint') ||
        error.message.toLowerCase().includes('reference') ||
        error.message.toLowerCase().includes('depends')
      )) {
        errorMessage = 'Cannot Delete This Zone!\n\nZone Has Wards Or Vehicles Assigned.\nPlease Remove All Wards And Vehicles From Zone Before Deleting.'
      } else if (error.message) {
        errorMessage = error.message
      }
      alert(`Error: ${errorMessage}`)
    }
  }
  const openAddVehicleDialog = (zone: any) => {
    setEditingZone(zone)
    const currentVehicleIds = vehicles
      .filter((v: any) => v.vehicleZonePreferences?.some((vzp: any) => vzp.zoneId === zone.zoneId))
      .map((v: any) => v.vehicleId)
    const available = vehicles.filter((v: any) => !currentVehicleIds.includes(v.vehicleId))
    setAvailableVehicles(available)
    setVehicleFormData({
      vehicleId: '',
      priority: '100'
    })
    setShowAddVehicleDialog(true)
  }
  const handleAddVehicleToZone = async () => {
    try {
      if (!vehicleFormData.vehicleId) {
        alert('Please Select Vehicle')
        return
      }
      await apiService.addVehicleToZone(
        parseInt(vehicleFormData.vehicleId),
        editingZone.zoneId,
        parseInt(vehicleFormData.priority)
      )
      alert('Add Vehicle To Zone Successfully!')
      setShowAddVehicleDialog(false)
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Add Vehicle To Zone'}`)
    }
  }
  const handleRemoveVehicleFromZone = async (vehicleId: number, zoneId: number) => {
    if (!confirm('Are You Sure You Want To Remove This Vehicle From Zone?')) return
    try {
      await apiService.removeVehicleFromZone(vehicleId, zoneId)
      alert('Remove Vehicle From Zone Successfully!')
      if (currentUser?.companyId) {
        fetchZones(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Remove Vehicle From Zone'}`)
    }
  }
  return (
    <CompanyStaffOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <MapPin className="w-8 h-8" />
              Operating Zones
            </h1>
            <p className="text-gray-600 dark:text-yellow-200 mt-2">
              Manage Operating Zones And Vehicles Allowed In Each Zone
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateZoneDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Zone
          </Button>
        </div>
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-yellow-200">Loading Data...</p>
            </CardContent>
          </Card>
        ) : zones.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200 mb-2">
                No Operating Zones Found
              </p>
              <p className="text-sm text-gray-500 dark:text-yellow-300/70">
                Create The First Operating Zone To Manage Wards And Vehicles In The Zone
              </p>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Create First Operating Zone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {zones.map((zone) => (
              <Card key={zone.zoneId} className="bg-white/90 dark:bg-gray-800/90 overflow-hidden">
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors" onClick={() => toggleZone(zone.zoneId)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <MapPin className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                            {zone.name} ({zone.code})
                          </CardTitle>
                          {zone.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {zone.province?.name} - {zone.description}
                        </CardDescription>
                        <p className="text-xs text-gray-500 dark:text-yellow-300/70 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {zone.wards?.length || 0} Wards In Zone
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation()
                        openEditZoneDialog(zone)
                      }}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteZone(zone.zoneId)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {expandedZone === zone.zoneId ? (
                          <>
                            Hide <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Details <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedZone === zone.zoneId && (
                  <CardContent className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Wards In Zone ({zone.wards?.length || 0} Wards)
                        </h4>
                        <Button size="sm" variant="outline" onClick={() => openWardDialog(zone)} className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Ward
                        </Button>
                      </div>
                      {zone.wards?.length === 0 ? (
                        <div className="p-6 text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 dark:text-yellow-200">
                            No Wards Added To This Zone
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {zone.wards?.map((ward: any) => (
                            <Card key={`${zone.zoneId}-${ward.wardId}`} className="bg-white dark:bg-gray-800">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                                      <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 dark:text-yellow-400 truncate">
                                        {ward.name}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-yellow-200">
                                        {ward.province?.name || 'N/A'}
                                      </p>
                                      {ward.code && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                          Code: {ward.code}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                                    onClick={() => handleRemoveWard(zone.zoneId, ward.wardId)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Vehicles Assigned To Zone ({getVehiclesForZone(zone.zoneId).length} Vehicles)
                        </h4>
                        <Button size="sm" variant="outline" onClick={() => openAddVehicleDialog(zone)} className="bg-green-500 hover:bg-green-600 text-white border-green-500">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Vehicle
                        </Button>
                      </div>
                      {getVehiclesForZone(zone.zoneId).length === 0 ? (
                        <div className="p-6 text-center bg-white dark:bg-gray-800 rounded-lg">
                          <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 dark:text-yellow-200">
                            No Vehicles Assigned To This Zone
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getVehiclesForZone(zone.zoneId).map((vehicle: any) => (
                            <Card key={vehicle.vehicleId} className="bg-white dark:bg-gray-800">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center shrink-0">
                                      <Car className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-gray-900 dark:text-yellow-400">
                                        {vehicle.plateNumber}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-yellow-200">
                                        {vehicle.model?.brand} {vehicle.model?.modelName}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          Priority: {vehicle.priority}
                                        </Badge>
                                        {vehicle.status === 'ACTIVE' && (
                                          <Badge className="bg-green-100 text-green-800 text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Active
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                                    onClick={() => handleRemoveVehicleFromZone(vehicle.vehicleId, zone.zoneId)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Operating Zone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Zone Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Zone Name"
                />
              </div>
              <div>
                <Label htmlFor="code">Zone Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter Zone Code"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Description"
                />
              </div>
              <div>
                <Label htmlFor="provinceId">Province</Label>
                <select
                  id="provinceId"
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province.provinceId} value={province.provinceId}>
                      {province.name}
                    </option>
                  ))}
                </select>
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
              <Button onClick={handleCreateZone}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Operating Zone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Zone Name</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Zone Name"
                />
              </div>
              <div>
                <Label htmlFor="editCode">Zone Code</Label>
                <Input
                  id="editCode"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter Zone Code"
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Description"
                />
              </div>
              <div>
                <Label htmlFor="editProvinceId">Province</Label>
                <select
                  id="editProvinceId"
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province.provinceId} value={province.provinceId}>
                      {province.name}
                    </option>
                  ))}
                </select>
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
              <Button onClick={handleEditZone}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showWardDialog} onOpenChange={setShowWardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Ward To Zone {editingZone?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wardId">Ward</Label>
                <select
                  id="wardId"
                  value={wardFormData.wardId}
                  onChange={(e) => setWardFormData({ ...wardFormData, wardId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Ward</option>
                  {availableWards.map(ward => (
                    <option key={ward.wardId} value={ward.wardId}>
                      {ward.name} ({ward.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWardDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWard}>
                Add Ward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vehicle To Zone {editingZone?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicleId">Select Vehicle *</Label>
                <select
                  id="vehicleId"
                  value={vehicleFormData.vehicleId}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Vehicle</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.plateNumber} - {vehicle.model?.brand} {vehicle.model?.modelName}
                    </option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-yellow-300/70 mt-1">
                    All Vehicles Have Been Added To This Zone
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority (Smaller Number = Higher Priority)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={vehicleFormData.priority}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, priority: e.target.value })}
                  placeholder="100"
                  min="1"
                  max="999"
                />
                <p className="text-xs text-gray-500 dark:text-yellow-300/70 mt-1">
                  Default: 100. Smaller Number Means Higher Priority For Assignment.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddVehicleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVehicleToZone} className="bg-green-500 hover:bg-green-600">
                Add Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyStaffOnly>
  )
}