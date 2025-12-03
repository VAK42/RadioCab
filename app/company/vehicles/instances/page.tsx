"use client"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"
import { Switch } from "../../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Plus, Edit, Trash2, Search, Car, MapPin, Filter, X, ChevronDown, ChevronUp, User, Calendar } from "lucide-react"
import { CompanyStaffOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../../lib/api"
export default function VehicleInstancesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [zones, setZones] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [vehicleProvinces, setVehicleProvinces] = useState<any[]>([])
  const [vehicleZones, setVehicleZones] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [editingDriverAssignment, setEditingDriverAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<string>("all")
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedWard, setSelectedWard] = useState<string>("all")
  const [selectedDriver, setSelectedDriver] = useState<string>("all")
  const [selectedWeekday, setSelectedWeekday] = useState<string>("all")
  const [selectedWorkDate, setSelectedWorkDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [showingProvincesFor, setShowingProvincesFor] = useState<number | null>(null)
  const [showingZonesFor, setShowingZonesFor] = useState<number | null>(null)
  const [showingWardsFor, setShowingWardsFor] = useState<number | null>(null)
  const [showingDriversFor, setShowingDriversFor] = useState<number | null>(null)
  const [showingSchedulesFor, setShowingSchedulesFor] = useState<number | null>(null)
  const [expandedVehicleId, setExpandedVehicleId] = useState<number | null>(null)
  const [vehicleDetails, setVehicleDetails] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDriverDialog, setShowDriverDialog] = useState(false)
  const [showZoneDialog, setShowZoneDialog] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)
  const [formData, setFormData] = useState({
    plateNumber: '',
    vin: '',
    color: '',
    yearManufactured: '',
    odometerKm: '',
    modelId: '',
    isActive: true
  })
  const [driverFormData, setDriverFormData] = useState({
    driverAccountId: '',
    startAt: '',
    endAt: ''
  })
  const [zoneFormData, setZoneFormData] = useState({
    zoneId: '',
    priority: '100'
  })
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      fetchVehicles(user.companyId, {})
    } else {
      alert('Please Login To View Vehicle Data')
    }
  }, [])
  const fetchVehicles = async (companyId: number, additionalFilters?: any) => {
    try {
      setLoading(true)
      const filterParams: any = { companyId, pageSize: 1000 }
      if (additionalFilters?.provinceId && additionalFilters.provinceId !== "all") {
        filterParams.provinceId = parseInt(additionalFilters.provinceId)
      }
      if (additionalFilters?.zoneId && additionalFilters.zoneId !== "all") {
        filterParams.zoneId = parseInt(additionalFilters.zoneId)
      }
      if (additionalFilters?.wardId && additionalFilters.wardId !== "all") {
        filterParams.wardId = parseInt(additionalFilters.wardId)
      }
      if (additionalFilters?.driverId && additionalFilters.driverId !== "all") {
        filterParams.driverId = parseInt(additionalFilters.driverId)
      }
      if (additionalFilters?.weekday && additionalFilters.weekday !== "all") {
        filterParams.weekday = parseInt(additionalFilters.weekday)
      }
      if (additionalFilters?.workDate) {
        filterParams.workDate = additionalFilters.workDate
      }
      const [vehiclesResponse, provincesResponse, zonesResponse, wardsResponse, vehicleProvincesResponse, vehicleZonesResponse, modelsResponse, driversResponse] = await Promise.all([
        apiService.getVehicles(filterParams),
        apiService.getProvinces({ pageSize: 100 }),
        apiService.getZones({ companyId, pageSize: 1000 }),
        apiService.getWards({ pageSize: 1000 }),
        apiService.getVehicleInProvinces({ pageSize: 1000 }),
        apiService.getVehicleZonePreferences({ pageSize: 1000 }),
        apiService.getVehicleModels({ companyId, pageSize: 1000 }),
        apiService.getAccounts({ companyId, role: 'DRIVER', pageSize: 1000 })
      ])
      const getItems = (resp: any) => resp?.data?.items || resp?.items || []
      setVehicles(getItems(vehiclesResponse))
      setFilteredVehicles(getItems(vehiclesResponse))
      setProvinces(getItems(provincesResponse))
      setZones(getItems(zonesResponse))
      setWards(getItems(wardsResponse))
      setVehicleProvinces(getItems(vehicleProvincesResponse))
      setVehicleZones(getItems(vehicleZonesResponse))
      setModels(getItems(modelsResponse))
      setDrivers(getItems(driversResponse))
    } catch (error) {
      alert(`Error Loading Data: ${error}`)
      setVehicles([])
      setFilteredVehicles([])
      setProvinces([])
      setZones([])
      setWards([])
      setVehicleProvinces([])
      setVehicleZones([])
      setModels([])
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    let filtered = vehicles
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(vehicle =>
        vehicle.plateNumber?.toLowerCase().includes(query) ||
        vehicle.model?.brand?.toLowerCase().includes(query) ||
        vehicle.model?.modelName?.toLowerCase().includes(query) ||
        vehicle.color?.toLowerCase().includes(query)
      )
    }
    if (selectedProvince !== "all") {
      filtered = filtered.filter(vehicle =>
        vehicleProvinces.some(vp =>
          vp.vehicleId === vehicle.vehicleId &&
          vp.provinceId.toString() === selectedProvince
        )
      )
    }
    if (selectedZone !== "all") {
      filtered = filtered.filter(vehicle =>
        vehicleZones.some(vz =>
          vz.vehicleId === vehicle.vehicleId &&
          vz.zoneId.toString() === selectedZone
        )
      )
    }
    if (selectedWard !== "all") {
      filtered = filtered.filter(vehicle => {
        const vehicleZoneIds = vehicleZones
          .filter(vz => vz.vehicleId === vehicle.vehicleId)
          .map(vz => vz.zoneId)
        return zones.some(zone =>
          vehicleZoneIds.includes(zone.zoneId) &&
          zone.zoneWards?.some((zw: any) => zw.wardId.toString() === selectedWard)
        )
      })
    }
    if (selectedDriver !== "all") {
      filtered = filtered.filter(vehicle => {
        return vehicle.driverVehicleAssignments?.some((dva: any) =>
          dva.driverAccountId?.toString() === selectedDriver
        )
      })
    }
    if (selectedWeekday !== "all") {
      filtered = filtered.filter(vehicle => {
        return vehicle.driverScheduleTemplates?.some((dst: any) =>
          dst.weekday === parseInt(selectedWeekday) && dst.isActive
        )
      })
    }
    if (selectedWorkDate) {
      filtered = filtered.filter(vehicle => {
        return vehicle.driverSchedules?.some((ds: any) => {
          const scheduleDate = ds.workDate.split('T')[0].split(' ')[0]
          return scheduleDate === selectedWorkDate
        })
      })
    }
    setFilteredVehicles(filtered)
  }, [searchQuery, vehicles, selectedProvince, selectedZone, selectedWard, selectedDriver, selectedWeekday, selectedWorkDate, vehicleProvinces, vehicleZones, zones])
  const getProvincesForVehicle = (vehicleId: number) => {
    return vehicleProvinces
      .filter(vp => vp.vehicleId === vehicleId)
      .map(vp => {
        const province = provinces.find(p => p.provinceId === vp.provinceId)
        return {
          ...vp,
          province: province
        }
      })
  }
  const getZonesForVehicle = (vehicleId: number) => {
    return vehicleZones
      .filter(vz => vz.vehicleId === vehicleId)
      .map(vz => {
        const zone = zones.find(z => z.zoneId === vz.zoneId)
        return {
          ...vz,
          zone: zone
        }
      })
  }
  const getWardsForVehicle = (vehicleId: number) => {
    const vehicleZoneIds = vehicleZones
      .filter(vz => vz.vehicleId === vehicleId)
      .map(vz => vz.zoneId)
    const allWards: any[] = []
    zones.forEach(zone => {
      if (vehicleZoneIds.includes(zone.zoneId) && zone.zoneWards) {
        zone.zoneWards.forEach((zw: any) => {
          const ward = wards.find(w => w.wardId === zw.wardId)
          if (ward && !allWards.find(w => w.wardId === ward.wardId)) {
            allWards.push(ward)
          }
        })
      }
    })
    return allWards
  }
  const viewProvinces = (vehicleId: number) => {
    setShowingProvincesFor(showingProvincesFor === vehicleId ? null : vehicleId)
    setShowingZonesFor(null)
    setShowingWardsFor(null)
    setExpandedVehicleId(vehicleId)
  }
  const viewZones = (vehicleId: number) => {
    setShowingZonesFor(showingZonesFor === vehicleId ? null : vehicleId)
    setShowingProvincesFor(null)
    setShowingWardsFor(null)
    setExpandedVehicleId(vehicleId)
  }
  const viewWards = (vehicleId: number) => {
    setShowingWardsFor(showingWardsFor === vehicleId ? null : vehicleId)
    setShowingProvincesFor(null)
    setShowingZonesFor(null)
    setExpandedVehicleId(vehicleId)
  }
  const toggleVehicleDetails = (vehicleId: number) => {
    setExpandedVehicleId(expandedVehicleId === vehicleId ? null : vehicleId)
    setShowingProvincesFor(null)
    setShowingZonesFor(null)
    setShowingWardsFor(null)
    setShowingDriversFor(null)
    setShowingSchedulesFor(null)
  }
  const fetchVehicleDetails = async (vehicleId: number) => {
    try {
      const details = await apiService.getVehicleById(vehicleId)
      setVehicleDetails(details)
      return details
    } catch (error) {
      console.error('Failed To Fetch Vehicle Details:', error)
      return null
    }
  }
  const viewDrivers = async (vehicleId: number) => {
    setShowingDriversFor(showingDriversFor === vehicleId ? null : vehicleId)
    setShowingProvincesFor(null)
    setShowingZonesFor(null)
    setShowingSchedulesFor(null)
    setExpandedVehicleId(vehicleId)
    if (showingDriversFor !== vehicleId) {
      await fetchVehicleDetails(vehicleId)
    }
  }
  const viewSchedules = async (vehicleId: number) => {
    setShowingSchedulesFor(showingSchedulesFor === vehicleId ? null : vehicleId)
    setShowingProvincesFor(null)
    setShowingZonesFor(null)
    setShowingDriversFor(null)
    setExpandedVehicleId(vehicleId)
    if (showingSchedulesFor !== vehicleId) {
      await fetchVehicleDetails(vehicleId)
    }
  }
  const handleDelete = async (vehicleId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Vehicle?')) return
    try {
      await apiService.deleteVehicle(vehicleId)
      alert('Vehicle Deleted Successfully!')
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Delete Vehicle'}`)
    }
  }
  const openCreateVehicleDialog = () => {
    setFormData({
      plateNumber: '',
      vin: '',
      color: '',
      yearManufactured: '',
      odometerKm: '',
      modelId: '',
      isActive: true
    })
    setShowCreateDialog(true)
  }
  const openEditVehicleDialog = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setFormData({
      plateNumber: vehicle.plateNumber || '',
      vin: vehicle.vin || '',
      color: vehicle.color || '',
      yearManufactured: vehicle.yearManufactured?.toString() || '',
      odometerKm: vehicle.odometerKm?.toString() || '',
      modelId: vehicle.modelId?.toString() || '',
      isActive: vehicle.status === 'ACTIVE'
    })
    setShowEditDialog(true)
  }
  const openDriverDialog = async (vehicle: any) => {
    setEditingVehicle(vehicle)
    setEditingDriverAssignment(null)
    setDriverFormData({
      driverAccountId: '',
      startAt: '',
      endAt: ''
    })
    if (currentUser?.companyId) {
      try {
        const driversResponse = await apiService.getAccounts({
          companyId: currentUser.companyId,
          role: 'DRIVER',
          pageSize: 1000
        })
        setDrivers(driversResponse.items || [])
      } catch (error) {
        alert('Failed To Fetch Drivers')
      }
    }
    setShowDriverDialog(true)
  }
  const openZoneDialog = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setZoneFormData({
      zoneId: '',
      priority: '100'
    })
    setShowZoneDialog(true)
  }
  const handleCreateVehicle = async () => {
    try {
      const vehicleData = {
        ...formData,
        companyId: currentUser.companyId,
        modelId: parseInt(formData.modelId),
        yearManufactured: parseInt(formData.yearManufactured),
        odometerKm: parseFloat(formData.odometerKm),
        status: formData.isActive ? 'ACTIVE' : 'INACTIVE'
      }
      await apiService.createVehicle(vehicleData)
      alert('Vehicle Created Successfully!')
      setShowCreateDialog(false)
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Create Vehicle'}`)
    }
  }
  const handleEditVehicle = async () => {
    try {
      const vehicleData = {
        ...formData,
        vehicleId: editingVehicle.vehicleId,
        companyId: currentUser.companyId,
        modelId: parseInt(formData.modelId),
        yearManufactured: parseInt(formData.yearManufactured),
        odometerKm: parseFloat(formData.odometerKm),
        status: formData.isActive ? 'ACTIVE' : 'INACTIVE'
      }
      await apiService.updateVehicle(vehicleData)
      alert('Vehicle Updated Successfully!')
      setShowEditDialog(false)
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Update Vehicle'}`)
    }
  }
  const handleCreateDriverAssignment = async () => {
    try {
      const assignmentData = {
        vehicleId: editingVehicle.vehicleId,
        driverId: parseInt(driverFormData.driverAccountId),
        assignedFrom: driverFormData.startAt,
        assignedTo: driverFormData.endAt || null,
        isActive: true
      }
      await apiService.createDriverVehicleAssignment(assignmentData)
      alert('Driver Assigned Successfully!')
      setShowDriverDialog(false)
      setEditingDriverAssignment(null)
      setDriverFormData({ driverAccountId: '', startAt: '', endAt: '' })
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Assign Driver'}`)
    }
  }
  const openEditDriverDialog = async (assignment: any) => {
    setEditingDriverAssignment(assignment)
    setEditingVehicle(vehicles.find(v => v.vehicleId === assignment.vehicleId))
    setDriverFormData({
      driverAccountId: assignment.driverAccountId?.toString() || '',
      startAt: assignment.startAt ? new Date(assignment.startAt).toISOString().split('T')[0] : '',
      endAt: assignment.endAt ? new Date(assignment.endAt).toISOString().split('T')[0] : ''
    })
    if (currentUser?.companyId) {
      try {
        const driversResponse = await apiService.getAccounts({
          companyId: currentUser.companyId,
          role: 'DRIVER',
          pageSize: 1000
        })
        setDrivers(driversResponse.items || [])
      } catch (error) {
        alert('Failed To Fetch Drivers')
      }
    }
    setShowDriverDialog(true)
  }
  const handleUpdateDriverAssignment = async () => {
    try {
      const assignmentData = {
        driverId: parseInt(driverFormData.driverAccountId),
        assignedFrom: driverFormData.startAt,
        assignedTo: driverFormData.endAt || null,
        isActive: true
      }
      await apiService.updateDriverVehicleAssignment(editingDriverAssignment.assignmentId, assignmentData)
      alert('Driver Assignment Updated Successfully!')
      setShowDriverDialog(false)
      setEditingDriverAssignment(null)
      setDriverFormData({ driverAccountId: '', startAt: '', endAt: '' })
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Update Assignment'}`)
    }
  }
  const handleDeleteDriverAssignment = async (assignmentId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Driver Assignment?')) return
    try {
      await apiService.deleteDriverVehicleAssignment(assignmentId)
      alert('Driver Assignment Deleted Successfully!')
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Delete Assignment'}`)
    }
  }
  const handleAddVehicleToZone = async () => {
    try {
      if (!zoneFormData.zoneId) {
        alert('Please Select Zone')
        return
      }
      const priority = parseInt(zoneFormData.priority) || 100
      await apiService.addVehicleToZone(editingVehicle.vehicleId, parseInt(zoneFormData.zoneId), priority)
      alert('Vehicle Added To Zone Successfully!')
      setShowZoneDialog(false)
      setZoneFormData({ zoneId: '', priority: '100' })
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Add Vehicle To Zone'}`)
    }
  }
  const handleRemoveVehicleFromZone = async (vehicleId: number, zoneId: number) => {
    if (!confirm('Are You Sure You Want To Remove Vehicle From This Zone?')) return
    try {
      await apiService.removeVehicleFromZone(vehicleId, zoneId)
      alert('Vehicle Removed From Zone Successfully!')
      if (currentUser) {
        fetchVehicles(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Remove Vehicle From Zone'}`)
    }
  }
  const getAvailableZonesForVehicle = (vehicleId: number) => {
    const vehicleZoneIds = vehicleZones
      .filter(vz => vz.vehicleId === vehicleId)
      .map(vz => vz.zoneId)
    return zones.filter(zone => !vehicleZoneIds.includes(zone.zoneId))
  }
  const getZonesForProvinceFilter = () => {
    if (selectedProvince === "all") {
      return zones
    }
    return zones.filter(z => z.provinceId.toString() === selectedProvince)
  }
  const getWardsForZoneFilter = () => {
    if (selectedZone === "all") {
      return wards
    }
    const selectedZoneData = zones.find(z => z.zoneId.toString() === selectedZone)
    if (!selectedZoneData || !selectedZoneData.zoneWards) {
      return []
    }
    return selectedZoneData.zoneWards.map((zw: any) => {
      const ward = wards.find(w => w.wardId === zw.wardId)
      return ward
    }).filter((ward: any) => ward !== undefined)
  }
  return (
    <CompanyStaffOnly>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
              Vehicle Instances
            </h1>
            <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
              Manage Specific Company Vehicles
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateVehicleDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
        {!loading && vehicles.length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/90 mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search By Plate Number, Model, Color..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <div className="text-sm text-gray-600 dark:text-yellow-300">
                    {filteredVehicles.length} / {vehicles.length} Vehicles
                  </div>
                </div>
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Province
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value)
                          setSelectedZone("all")
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="all">All Provinces</option>
                        {provinces.map(province => (
                          <option key={province.provinceId} value={province.provinceId}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Zone
                      </label>
                      <select
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={selectedProvince === "all"}
                      >
                        <option value="all">All Zones</option>
                        {getZonesForProvinceFilter().map(zone => (
                          <option key={zone.zoneId} value={zone.zoneId}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Ward
                      </label>
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={selectedZone === "all"}
                      >
                        <option value="all">All Wards</option>
                        {getWardsForZoneFilter().map((ward: any) => (
                          <option key={ward.wardId} value={ward.wardId}>
                            {ward.name} ({ward.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Driver
                      </label>
                      <select
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="all">All Drivers</option>
                        {drivers.map(driver => (
                          <option key={driver.accountId} value={driver.accountId}>
                            {driver.fullName} ({driver.phone || driver.username})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Weekday
                      </label>
                      <select
                        value={selectedWeekday}
                        onChange={(e) => setSelectedWeekday(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="all">All Weekdays</option>
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-yellow-300 mb-2">
                        Filter By Work Date
                      </label>
                      <input
                        type="date"
                        value={selectedWorkDate}
                        onChange={(e) => setSelectedWorkDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProvince("all")
                          setSelectedZone("all")
                          setSelectedWard("all")
                          setSelectedDriver("all")
                          setSelectedWeekday("all")
                          setSelectedWorkDate("")
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
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
        ) : vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Vehicles Found</p>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateVehicleDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Vehicles Found</p>
              <Button onClick={() => { setSelectedProvince("all"); setSelectedZone("all"); setSearchQuery("") }} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map(vehicle => {
              const vm = vehicle.model || models.find((m: any) => m.modelId === vehicle.modelId)
              const rawImg = vm?.imageUrl as string | undefined
              const vmImageUrl = rawImg
                ? (rawImg.startsWith('http') || rawImg.startsWith('/')
                  ? apiService.getFileUrl(rawImg)
                  : apiService.getFileUrl(`uploads/models/${rawImg}`))
                : null
              const vmBrand = vm?.brand
              const vmName = vm?.modelName
              return (
                <Card key={vehicle.vehicleId} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-gray-400" />
                          <h3 className="font-bold text-lg text-gray-900 dark:text-yellow-400">
                            {vehicle.plateNumber}
                          </h3>
                        </div>
                        <Badge className={vehicle.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {vehicle.status === 'ACTIVE' ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="w-full h-32 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                        {vmImageUrl && (
                          <img
                            src={vmImageUrl}
                            alt={`${vmBrand || ''} ${vmName || ''}`.trim()}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback')
                              if (fallback) {
                                (fallback as HTMLElement).style.display = 'flex'
                              }
                            }}
                          />
                        )}
                        <div className={`image-fallback w-full h-full items-center justify-center ${vmImageUrl ? 'hidden' : 'flex'}`}>
                          <Car className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-yellow-200">
                        <p className="font-medium">{vmBrand} {vmName}</p>
                        {vehicle.color && <p className="text-xs text-gray-500 dark:text-yellow-300/70">Color: {vehicle.color}</p>}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-yellow-300/70">
                        {vehicle.yearManufactured && <span>Year: {vehicle.yearManufactured}</span>}
                        <span>Km: {vehicle.odometerKm.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVehicleDetails(vehicle.vehicleId)}
                          className="flex-1"
                        >
                          {expandedVehicleId === vehicle.vehicleId ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    {expandedVehicleId === vehicle.vehicleId && (
                      <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button
                            variant={showingProvincesFor === vehicle.vehicleId ? "default" : "outline"}
                            size="sm"
                            className={showingProvincesFor === vehicle.vehicleId ? "w-full bg-blue-500 hover:bg-blue-600 text-white" : "w-full"}
                            onClick={() => viewProvinces(vehicle.vehicleId)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Provinces ({getProvincesForVehicle(vehicle.vehicleId).length})
                          </Button>
                          <Button
                            variant={showingZonesFor === vehicle.vehicleId ? "default" : "outline"}
                            size="sm"
                            className={showingZonesFor === vehicle.vehicleId ? "w-full bg-purple-500 hover:bg-purple-600 text-white" : "w-full"}
                            onClick={() => viewZones(vehicle.vehicleId)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Zone ({getZonesForVehicle(vehicle.vehicleId).length})
                          </Button>
                          <Button
                            variant={showingWardsFor === vehicle.vehicleId ? "default" : "outline"}
                            size="sm"
                            className={showingWardsFor === vehicle.vehicleId ? "w-full bg-green-500 hover:bg-green-600 text-white" : "w-full"}
                            onClick={() => viewWards(vehicle.vehicleId)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Ward ({getWardsForVehicle(vehicle.vehicleId).length})
                          </Button>
                          <Button
                            variant={showingDriversFor === vehicle.vehicleId ? "default" : "outline"}
                            size="sm"
                            className={showingDriversFor === vehicle.vehicleId ? "w-full bg-yellow-500 hover:bg-yellow-600 text-white" : "w-full"}
                            onClick={() => viewDrivers(vehicle.vehicleId)}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Drivers
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                          <Button
                            variant={showingSchedulesFor === vehicle.vehicleId ? "default" : "outline"}
                            size="sm"
                            className={showingSchedulesFor === vehicle.vehicleId ? "w-full bg-orange-500 hover:bg-orange-600 text-white" : "w-full"}
                            onClick={() => viewSchedules(vehicle.vehicleId)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedules
                          </Button>
                        </div>
                        {showingProvincesFor === vehicle.vehicleId && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Operating Provinces
                            </h5>
                            {getProvincesForVehicle(vehicle.vehicleId).length === 0 ? (
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                No Provinces Configured
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {getProvincesForVehicle(vehicle.vehicleId).map((vp: any) => (
                                  <div key={vp.vehicleInProvinceId} className="p-3 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-gray-900 dark:text-yellow-100">
                                          {vp.province?.name || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-yellow-200">
                                          {vp.allowed ? 'Allowed' : 'Not Allowed'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {showingZonesFor === vehicle.vehicleId && (
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Operating Zones
                              </h5>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openZoneDialog(vehicle)}
                                className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Zone
                              </Button>
                            </div>
                            {getZonesForVehicle(vehicle.vehicleId).length === 0 ? (
                              <p className="text-sm text-purple-700 dark:text-purple-300">
                                No Zones Configured
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {getZonesForVehicle(vehicle.vehicleId).map((vz: any) => (
                                  <div key={vz.vehicleZonePreferenceId} className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                          <MapPin className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 dark:text-yellow-100">
                                            {vz.zone?.name || 'N/A'}
                                          </p>
                                          <p className="text-xs text-gray-600 dark:text-yellow-200">
                                            Priority: {vz.priority || 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveVehicleFromZone(vehicle.vehicleId, vz.zoneId)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {showingWardsFor === vehicle.vehicleId && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <h5 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Operating Wards
                            </h5>
                            {getWardsForVehicle(vehicle.vehicleId).length === 0 ? (
                              <p className="text-sm text-green-700 dark:text-green-300">
                                No Wards Configured
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {getWardsForVehicle(vehicle.vehicleId).map((ward: any) => (
                                  <div key={ward.wardId} className="flex items-center justify-between text-sm p-2 bg-white dark:bg-gray-900 rounded-lg">
                                    <span className="text-green-900 dark:text-green-300">
                                      {ward.name || 'N/A'} ({ward.code || 'N/A'})
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {ward.province?.name || 'N/A'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {showingDriversFor === vehicle.vehicleId && (
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-yellow-900 dark:text-yellow-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Authorized Drivers
                              </h5>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDriverDialog(vehicle)}
                                className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Driver
                              </Button>
                            </div>
                            {!vehicleDetails || !vehicleDetails.driverVehicleAssignments || vehicleDetails.driverVehicleAssignments.length === 0 ? (
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                No Drivers Assigned
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {vehicleDetails.driverVehicleAssignments.map((dva: any) => (
                                  <div key={dva.assignmentId} className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                          <User className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900 dark:text-yellow-100">
                                            {dva.driver?.fullName || 'N/A'}
                                          </p>
                                          <p className="text-xs text-gray-600 dark:text-yellow-200">
                                            ID: {dva.driver?.accountId || 'N/A'} | Phone: {dva.driver?.phone || 'N/A'}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-yellow-300/70">
                                            From: {new Date(dva.startAt).toLocaleDateString()}
                                            {dva.endAt ? ` - To: ${new Date(dva.endAt).toLocaleDateString()}` : ' (Current)'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => openEditDriverDialog(dva)}
                                          className="text-blue-600 hover:text-blue-700"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeleteDriverAssignment(dva.assignmentId)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {showingSchedulesFor === vehicle.vehicleId && (
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                            <h5 className="font-semibold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Driver Schedules This Month
                            </h5>
                            {!vehicleDetails || !vehicleDetails.driverSchedules || vehicleDetails.driverSchedules.length === 0 ? (
                              <p className="text-sm text-orange-700 dark:text-orange-300">
                                No Schedules This Month
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {vehicleDetails.driverSchedules.map((ds: any) => (
                                  <div key={ds.scheduleId} className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-gray-900 dark:text-yellow-100">
                                          {ds.driver?.fullName || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-yellow-200">
                                          ID: {ds.driver?.accountId || 'N/A'} | {new Date(ds.workDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-yellow-300/70">
                                          {ds.startTime} - {ds.endTime} | Status: {ds.status}
                                        </p>
                                        {ds.note && (
                                          <p className="text-xs text-gray-500 dark:text-yellow-300/70 italic">
                                            Note: {ds.note}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditVehicleDialog(vehicle)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Vehicle
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-red-600" onClick={() => handleDelete(vehicle.vehicleId)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa xe
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="Enter Plate Number"
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="Enter VIN"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Enter Color"
                />
              </div>
              <div>
                <Label htmlFor="yearManufactured">Year Manufactured</Label>
                <Input
                  id="yearManufactured"
                  type="number"
                  value={formData.yearManufactured}
                  onChange={(e) => setFormData({ ...formData, yearManufactured: e.target.value })}
                  placeholder="Enter Year Manufactured"
                />
              </div>
              <div>
                <Label htmlFor="odometerKm">Odometer (Km)</Label>
                <Input
                  id="odometerKm"
                  type="number"
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                  placeholder="Enter Odometer (Km)"
                />
              </div>
              <div>
                <Label htmlFor="modelId">Vehicle Model</Label>
                <Select value={formData.modelId} onValueChange={(value) => setFormData({ ...formData, modelId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.modelId} value={model.modelId.toString()}>
                        {model.brand} {model.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button onClick={handleCreateVehicle}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editPlateNumber">Plate Number</Label>
                <Input
                  id="editPlateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="Enter Plate Number"
                />
              </div>
              <div>
                <Label htmlFor="editVin">VIN</Label>
                <Input
                  id="editVin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="Enter VIN"
                />
              </div>
              <div>
                <Label htmlFor="editColor">Color</Label>
                <Input
                  id="editColor"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Enter Color"
                />
              </div>
              <div>
                <Label htmlFor="editYearManufactured">Year Manufactured</Label>
                <Input
                  id="editYearManufactured"
                  type="number"
                  value={formData.yearManufactured}
                  onChange={(e) => setFormData({ ...formData, yearManufactured: e.target.value })}
                  placeholder="Enter Year Manufactured"
                />
              </div>
              <div>
                <Label htmlFor="editOdometerKm">Odometer (Km)</Label>
                <Input
                  id="editOdometerKm"
                  type="number"
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                  placeholder="Enter Odometer (Km)"
                />
              </div>
              <div>
                <Label htmlFor="editModelId">Vehicle Model</Label>
                <Select value={formData.modelId} onValueChange={(value) => setFormData({ ...formData, modelId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.modelId} value={model.modelId.toString()}>
                        {model.brand} {model.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button onClick={handleEditVehicle}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDriverAssignment ? 'Edit Driver Assignment' : 'Assign Driver'} For Vehicle {editingVehicle?.plateNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="driverAccountId">Driver</Label>
                <Select value={driverFormData.driverAccountId} onValueChange={(value) => setDriverFormData({ ...driverFormData, driverAccountId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map(driver => (
                      <SelectItem key={driver.accountId} value={driver.accountId.toString()}>
                        {driver.fullName} ({driver.phone || driver.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startAt">Start Date</Label>
                <Input
                  id="startAt"
                  type="date"
                  value={driverFormData.startAt}
                  onChange={(e) => setDriverFormData({ ...driverFormData, startAt: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endAt">End Date (Optional)</Label>
                <Input
                  id="endAt"
                  type="date"
                  value={driverFormData.endAt}
                  onChange={(e) => setDriverFormData({ ...driverFormData, endAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDriverDialog(false)
                  setEditingDriverAssignment(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingDriverAssignment ? handleUpdateDriverAssignment : handleCreateDriverAssignment}>
                {editingDriverAssignment ? 'Update' : 'Assign Driver'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Zone For Vehicle {editingVehicle?.plateNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zoneId">Zone</Label>
                <Select value={zoneFormData.zoneId} onValueChange={(value) => setZoneFormData({ ...zoneFormData, zoneId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingVehicle ? getAvailableZonesForVehicle(editingVehicle.vehicleId).map(zone => (
                      <SelectItem key={zone.zoneId} value={zone.zoneId.toString()}>
                        {zone.name}
                      </SelectItem>
                    )) : zones.map(zone => (
                      <SelectItem key={zone.zoneId} value={zone.zoneId.toString()}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editingVehicle && getAvailableZonesForVehicle(editingVehicle.vehicleId).length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    All Zones Have Been Assigned To This Vehicle
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={zoneFormData.priority}
                  onChange={(e) => setZoneFormData({ ...zoneFormData, priority: e.target.value })}
                  placeholder="Enter Priority (Default: 100)"
                  min="1"
                  max="1000"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lower Number Means Higher Priority (1 = Highest, 1000 = Lowest)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowZoneDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddVehicleToZone}
                disabled={!zoneFormData.zoneId || (editingVehicle && getAvailableZonesForVehicle(editingVehicle.vehicleId).length === 0)}
              >
                Add Zone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyStaffOnly>
  )
}