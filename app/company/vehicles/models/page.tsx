"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Switch } from "../../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Plus, Edit, Trash2, Search, Car, MapPin, Filter, X, Eye } from "lucide-react"
import { CompanyStaffOnly } from "../../../../components/roleBasedAccess"
import { getCurrentUser } from "../../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../../lib/api"
export default function VehicleModelsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [models, setModels] = useState<any[]>([])
  const [filteredModels, setFilteredModels] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [zones, setZones] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [modelPriceProvinces, setModelPriceProvinces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showingProvinces, setShowingProvinces] = useState<number | null>(null)
  const [showingWards, setShowingWards] = useState<number | null>(null)
  const [showingDetails, setShowingDetails] = useState<number | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPriceDialog, setShowPriceDialog] = useState(false)
  const [showEditPriceDialog, setShowEditPriceDialog] = useState(false)
  const [editingModel, setEditingModel] = useState<any>(null)
  const [editingPrice, setEditingPrice] = useState<any>(null)
  const [formData, setFormData] = useState({
    brand: '',
    modelName: '',
    segmentId: '',
    fuelType: 'GASOLINE',
    seatCategory: 'SEDAN_5',
    imageUrl: '',
    description: '',
    isActive: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [priceFormData, setPriceFormData] = useState({
    provinceId: '',
    openingFare: '',
    rateFirst20Km: '',
    rateOver20Km: '',
    trafficAddPerKm: '',
    rainAddPerTrip: '',
    intercityRatePerKm: '',
    timeStart: '',
    timeEnd: '',
    dateStart: '',
    dateEnd: '',
    note: '',
    parentId: ''
  })
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.companyId) {
      setCurrentUser(user)
      fetchVehicleModels(user.companyId)
    } else {
      alert('Please Login To View Vehicle Data')
    }
  }, [])
  const fetchVehicleModels = async (companyId: number) => {
    try {
      setLoading(true)
      const [modelsResponse, segmentsResponse, provincesResponse, zonesResponse, wardsResponse, modelPriceProvincesResponse] = await Promise.all([
        apiService.getVehicleModels({ companyId, pageSize: 1000 }),
        apiService.getVehicleSegments({ companyId, pageSize: 1000 }),
        apiService.getProvinces({ pageSize: 100 }),
        apiService.getZones({ companyId, pageSize: 1000 }),
        apiService.getWards({ pageSize: 1000 }),
        apiService.getModelPriceProvinces({ pageSize: 1000 })
      ])
      const items = (modelsResponse.items || []).map((m: any) => ({
        ...m,
        imageUrl: m.imageUrl && !String(m.imageUrl).startsWith('http') ? apiService.getFileUrl(`uploads/models/${m.imageUrl}`) : m.imageUrl
      }))
      setModels(items)
      setFilteredModels(items)
      setSegments(segmentsResponse.items || [])
      setProvinces(provincesResponse.items || [])
      setZones(zonesResponse.items || [])
      setWards(wardsResponse.items || [])
      setModelPriceProvinces(modelPriceProvincesResponse.items || [])
    } catch (error) {
      alert(`Error Loading Data: ${error}`)
      setModels([])
      setFilteredModels([])
      setProvinces([])
      setZones([])
      setWards([])
      setModelPriceProvinces([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    let filtered = models
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(model =>
        model.brand?.toLowerCase().includes(query) ||
        model.modelName?.toLowerCase().includes(query) ||
        model.description?.toLowerCase().includes(query) ||
        model.segment?.name?.toLowerCase().includes(query)
      )
    }
    if (selectedProvince !== "all") {
      filtered = filtered.filter(model => {
        const modelProvinces = getProvincesForModel(model.modelId)
        return modelProvinces.some(province =>
          province.provinceId.toString() === selectedProvince
        )
      })
    }
    setFilteredModels(filtered)
  }, [searchQuery, selectedProvince, models, modelPriceProvinces])
  const getProvincesForModel = (modelId: number) => {
    const modelPriceProvincesForModel = modelPriceProvinces.filter(mpp => mpp.modelId === modelId)
    const uniqueProvinces = modelPriceProvincesForModel
      .map(mpp => mpp.provinceId)
      .filter((provinceId, index, array) => array.indexOf(provinceId) === index)
      .map(provinceId => {
        const province = provinces.find(p => p.provinceId === provinceId)
        return province
      })
      .filter(province => province !== undefined)
    return uniqueProvinces
  }
  const getProvinceCountForModel = (modelId: number) => {
    return getProvincesForModel(modelId).length
  }
  const getWardsForModel = (modelId: number) => {
    const modelProvinces = getProvincesForModel(modelId)
    const modelZones = zones.filter(zone =>
      modelProvinces.some(province => province.provinceId === zone.provinceId)
    )
    const modelWards = wards.filter(ward =>
      modelZones.some(zone =>
        zone.zoneWards?.some((zw: any) => zw.wardId === ward.wardId)
      )
    )
    return modelWards
  }
  const getWardCountForModel = (modelId: number) => {
    return getWardsForModel(modelId).length
  }
  const toggleProvinces = (modelId: number) => {
    setShowingProvinces(showingProvinces === modelId ? null : modelId)
    setShowingWards(null)
  }
  const toggleWards = (modelId: number) => {
    setShowingWards(showingWards === modelId ? null : modelId)
    setShowingProvinces(null)
  }
  const toggleDetails = (modelId: number) => {
    setShowingDetails(showingDetails === modelId ? null : modelId)
    setShowingProvinces(null)
    setShowingWards(null)
  }
  const getModelPriceProvincesForModel = (modelId: number) => {
    const allModelPriceProvinces = modelPriceProvinces.filter(mpp => mpp.modelId === modelId)
    const parents = allModelPriceProvinces.filter(mpp => !mpp.parentId)
    const children = allModelPriceProvinces.filter(mpp => mpp.parentId)
    const result = []
    for (const parent of parents) {
      result.push(parent)
      const childRecords = children.filter(child => child.parentId === parent.modelPriceId)
      result.push(...childRecords)
    }
    return result
  }
  const handleDelete = async (modelId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Model?')) return
    try {
      await apiService.deleteVehicleModel(modelId)
      alert('Delete Model Successfully!')
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Delete Model'}`)
    }
  }
  const openCreateModelDialog = () => {
    setFormData({
      brand: '',
      modelName: '',
      segmentId: '',
      fuelType: 'GASOLINE',
      seatCategory: 'SEDAN_5',
      imageUrl: '',
      description: '',
      isActive: true
    })
    setImageFile(null)
    setShowCreateDialog(true)
  }
  const openEditModelDialog = (model: any) => {
    setEditingModel(model)
    setFormData({
      brand: model.brand || '',
      modelName: model.modelName || '',
      segmentId: model.segmentId?.toString() || '',
      fuelType: model.fuelType || 'GASOLINE',
      seatCategory: model.seatCategory || 'SEDAN_5',
      imageUrl: model.imageUrl || '',
      description: model.description || '',
      isActive: model.isActive
    })
    setImageFile(null)
    setShowEditDialog(true)
  }
  const openPriceDialog = (model: any) => {
    setEditingModel(model)
    setPriceFormData({
      provinceId: '',
      openingFare: '',
      rateFirst20Km: '',
      rateOver20Km: '',
      trafficAddPerKm: '',
      rainAddPerTrip: '',
      intercityRatePerKm: '',
      timeStart: '',
      timeEnd: '',
      dateStart: new Date().toISOString().split('T')[0],
      dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      note: '',
      parentId: ''
    })
    setShowPriceDialog(true)
  }
  const handleCreateModel = async () => {
    try {
      const modelData = {
        ...formData,
        companyId: currentUser.companyId,
        segmentId: parseInt(formData.segmentId)
      }
      const created = await apiService.createVehicleModel(modelData)
      const newId = created.modelId || created.ModelId || created.data?.modelId
      if (imageFile && newId) {
        await apiService.uploadVehicleModelImage(newId, imageFile)
      }
      alert('Create Model Successfully!')
      setShowCreateDialog(false)
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Create Model'}`)
    }
  }
  const handleEditModel = async () => {
    try {
      const modelData = {
        ...formData,
        modelId: editingModel.modelId,
        companyId: currentUser.companyId,
        segmentId: parseInt(formData.segmentId)
      }
      await apiService.updateVehicleModel(modelData)
      if (imageFile && editingModel?.modelId) {
        await apiService.uploadVehicleModelImage(editingModel.modelId, imageFile)
      }
      alert('Update Model Successfully!')
      setShowEditDialog(false)
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Update Model'}`)
    }
  }
  const handleCreatePrice = async () => {
    try {
      const priceData = {
        companyId: currentUser.companyId,
        modelId: editingModel.modelId,
        provinceId: parseInt(priceFormData.provinceId),
        openingFare: parseFloat(priceFormData.openingFare),
        rateFirst20Km: parseFloat(priceFormData.rateFirst20Km),
        rateOver20Km: parseFloat(priceFormData.rateOver20Km),
        trafficAddPerKm: parseFloat(priceFormData.trafficAddPerKm) || 0,
        rainAddPerTrip: parseFloat(priceFormData.rainAddPerTrip) || 0,
        intercityRatePerKm: parseFloat(priceFormData.intercityRatePerKm) || 0,
        timeStart: priceFormData.timeStart || null,
        timeEnd: priceFormData.timeEnd || null,
        dateStart: priceFormData.dateStart,
        dateEnd: priceFormData.dateEnd,
        parentId: priceFormData.parentId ? parseInt(priceFormData.parentId) : null,
        note: priceFormData.note || null
      }
      await apiService.createModelPriceProvince(priceData)
      alert('Create Price Successfully!')
      setShowPriceDialog(false)
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Create Price'}`)
    }
  }
  const openEditPriceDialog = (price: any) => {
    setEditingPrice(price)
    setPriceFormData({
      provinceId: price.provinceId.toString(),
      openingFare: price.openingFare?.toString() || '',
      rateFirst20Km: price.rateFirst20Km?.toString() || '',
      rateOver20Km: price.rateOver20Km?.toString() || '',
      trafficAddPerKm: price.trafficAddPerKm?.toString() || '',
      rainAddPerTrip: price.rainAddPerTrip?.toString() || '',
      intercityRatePerKm: price.intercityRatePerKm?.toString() || '',
      timeStart: price.timeStart || '',
      timeEnd: price.timeEnd || '',
      dateStart: price.dateStart || '',
      dateEnd: price.dateEnd || '',
      note: price.note || '',
      parentId: price.parentId?.toString() || ''
    })
    setShowEditPriceDialog(true)
  }
  const handleEditPrice = async () => {
    try {
      const priceData = {
        modelPriceId: editingPrice.modelPriceId,
        provinceId: parseInt(priceFormData.provinceId),
        openingFare: parseFloat(priceFormData.openingFare),
        rateFirst20Km: parseFloat(priceFormData.rateFirst20Km),
        rateOver20Km: parseFloat(priceFormData.rateOver20Km),
        trafficAddPerKm: parseFloat(priceFormData.trafficAddPerKm) || 0,
        rainAddPerTrip: parseFloat(priceFormData.rainAddPerTrip) || 0,
        intercityRatePerKm: parseFloat(priceFormData.intercityRatePerKm) || 0,
        timeStart: priceFormData.timeStart || null,
        timeEnd: priceFormData.timeEnd || null,
        dateStart: priceFormData.dateStart,
        dateEnd: priceFormData.dateEnd,
        parentId: priceFormData.parentId ? parseInt(priceFormData.parentId) : null,
        note: priceFormData.note || null
      }
      await apiService.updateModelPriceProvince(priceData)
      alert('Update Price Successfully!')
      setShowEditPriceDialog(false)
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Update Price'}`)
    }
  }
  const handleDeletePrice = async (priceId: number) => {
    if (!confirm('Are You Sure You Want To Delete This Price?')) return
    try {
      await apiService.deleteModelPriceProvince(priceId)
      alert('Delete Price Successfully!')
      if (currentUser) {
        fetchVehicleModels(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Cannot Delete Price'}`)
    }
  }
  return (
    <CompanyStaffOnly>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
              Vehicle Models
            </h1>
            <p className="text-sm text-gray-600 dark:text-yellow-200 mt-1">
              Manage Company Vehicle Models
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateModelDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Model
          </Button>
        </div>
        {!loading && models.length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/90 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search By Brand, Model Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <div className="text-sm text-gray-600 dark:text-yellow-300">
                  {filteredModels.length} / {models.length} Models
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
                      onChange={(e) => setSelectedProvince(e.target.value)}
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProvince("all")
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear Filter
                    </Button>
                  </div>
                </div>
              )}
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
        ) : models.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Models Found</p>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={openCreateModelDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Model
              </Button>
            </CardContent>
          </Card>
        ) : filteredModels.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-yellow-200">No Models Found</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-4">
                Clear Filter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map(model => (
              <Card key={model.modelId} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                          {model.brand} {model.modelName}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-yellow-200">
                          {model.segment?.name || 'No Segment'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={model.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {model.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                  {model.imageUrl && (
                    <img
                      src={model.imageUrl}
                      alt={`${model.brand} ${model.modelName}`}
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
                  <div className={`image-fallback w-full h-full items-center justify-center ${model.imageUrl ? 'hidden' : 'flex'}`}>
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-yellow-200">
                      <span className="font-medium">Fuel Type:</span>
                      <Badge variant="outline">{model.fuelType}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-yellow-200">
                      <span className="font-medium">Vehicle Type:</span>
                      <Badge variant="outline">{model.seatCategory}</Badge>
                    </div>
                    {model.description && (
                      <p className="text-sm text-gray-600 dark:text-yellow-200">
                        {model.description}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toggleProvinces(model.modelId)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Provinces ({getProvinceCountForModel(model.modelId)})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toggleWards(model.modelId)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Ward ({getWardCountForModel(model.modelId)})
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleDetails(model.modelId)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Show Details
                    </Button>
                    {showingProvinces === model.modelId && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          Operating Provinces:
                        </h5>
                        {getProvincesForModel(model.modelId).length === 0 ? (
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            No Provinces Configured
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {getProvincesForModel(model.modelId).map((province: any) => (
                              <div key={province.provinceId} className="flex items-center justify-between text-sm">
                                <span className="text-blue-900 dark:text-blue-300">
                                  {province.name || 'N/A'}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Has Price
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {showingWards === model.modelId && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <h5 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                          Operating Wards:
                        </h5>
                        {getWardsForModel(model.modelId).length === 0 ? (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            No Wards Configured
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {getWardsForModel(model.modelId).map((ward: any) => (
                              <div key={ward.wardId} className="flex items-center justify-between text-sm">
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
                    {showingDetails === model.modelId && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <h5 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                          Price Details By Province:
                        </h5>
                        {getModelPriceProvincesForModel(model.modelId).length === 0 ? (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            No Price Configuration
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {getModelPriceProvincesForModel(model.modelId).map((mpp: any, index: number) => {
                              const isChild = mpp.parentId !== null
                              const province = provinces.find(p => p.provinceId === mpp.provinceId)
                              return (
                                <div key={mpp.modelPriceId} className={`p-3 rounded-lg border ${isChild ? 'ml-4 bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-600' : 'bg-white dark:bg-green-900/50 border-green-400 dark:border-green-500'}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {isChild && <span className="text-xs text-green-600 dark:text-green-400">└─</span>}
                                      <span className={`font-medium ${isChild ? 'text-green-800 dark:text-green-200' : 'text-green-900 dark:text-green-100'}`}>
                                        {province?.name || 'N/A'}
                                      </span>
                                      {isChild && (
                                        <Badge variant="outline" className="text-xs bg-green-200 dark:bg-green-700">
                                          Child
                                        </Badge>
                                      )}
                                      <Badge variant="outline" className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200">
                                        ID: {mpp.modelPriceId}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-green-700 dark:text-green-300">
                                      {mpp.dateStart} - {mpp.dateEnd}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-green-700 dark:text-green-300">Opening Fare:</span>
                                      <div className="font-medium text-green-900 dark:text-green-100">
                                        {mpp.openingFare?.toLocaleString()}đ
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-green-700 dark:text-green-300">First 20km:</span>
                                      <div className="font-medium text-green-900 dark:text-green-100">
                                        {mpp.rateFirst20Km?.toLocaleString()}đ/km
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-green-700 dark:text-green-300">After 20km:</span>
                                      <div className="font-medium text-green-900 dark:text-green-100">
                                        {mpp.rateOver20Km?.toLocaleString()}đ/km
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-green-700 dark:text-green-300">Intercity:</span>
                                      <div className="font-medium text-green-900 dark:text-green-100">
                                        {mpp.intercityRatePerKm?.toLocaleString()}đ/km
                                      </div>
                                    </div>
                                  </div>
                                  {mpp.timeStart && mpp.timeEnd && (
                                    <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                                      Time: {mpp.timeStart} - {mpp.timeEnd}
                                    </div>
                                  )}
                                  {mpp.note && (
                                    <div className="mt-2 text-xs text-green-700 dark:text-green-300 italic">
                                      Note: {mpp.note}
                                    </div>
                                  )}
                                  <div className="mt-3 flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditPriceDialog(mpp)}
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleDeletePrice(mpp.modelPriceId)}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModelDialog(model)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openPriceDialog(model)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Price
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(model.modelId)}
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
              <DialogTitle>Create New Vehicle Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Enter Brand"
                />
              </div>
              <div>
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="Enter Model Name"
                />
              </div>
              <div>
                <Label htmlFor="segmentId">Segment</Label>
                <Select value={formData.segmentId || "none"} onValueChange={(value) => setFormData({ ...formData, segmentId: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Segment</SelectItem>
                    {segments.filter(s => s.isActive).map(segment => (
                      <SelectItem key={segment.segmentId} value={segment.segmentId.toString()}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GASOLINE">Gasoline</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="EV">Electric</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seatCategory">Vehicle Type</Label>
                <Select value={formData.seatCategory} onValueChange={(value) => setFormData({ ...formData, seatCategory: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HATCHBACK_5">Hatchback 5 Seats</SelectItem>
                    <SelectItem value="SEDAN_5">Sedan 5 Seats</SelectItem>
                    <SelectItem value="SUV_5">SUV 5 Seats</SelectItem>
                    <SelectItem value="SUV_7">SUV 7 Seats</SelectItem>
                    <SelectItem value="MPV_7">MPV 7 Seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageFile">Model Image</Label>
                <Input id="imageFile" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
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
              <Button onClick={handleCreateModel}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vehicle Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editBrand">Brand</Label>
                <Input
                  id="editBrand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Enter Brand"
                />
              </div>
              <div>
                <Label htmlFor="editModelName">Model Name</Label>
                <Input
                  id="editModelName"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="Enter Model Name"
                />
              </div>
              <div>
                <Label htmlFor="editSegmentId">Segment</Label>
                <Select value={formData.segmentId || "none"} onValueChange={(value) => setFormData({ ...formData, segmentId: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Segment</SelectItem>
                    {segments.filter(s => s.isActive).map(segment => (
                      <SelectItem key={segment.segmentId} value={segment.segmentId.toString()}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editFuelType">Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GASOLINE">Gasoline</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="EV">Electric</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editSeatCategory">Vehicle Type</Label>
                <Select value={formData.seatCategory} onValueChange={(value) => setFormData({ ...formData, seatCategory: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HATCHBACK_5">Hatchback 5 Seats</SelectItem>
                    <SelectItem value="SEDAN_5">Sedan 5 Seats</SelectItem>
                    <SelectItem value="SUV_5">SUV 5 Seats</SelectItem>
                    <SelectItem value="SUV_7">SUV 7 Seats</SelectItem>
                    <SelectItem value="MPV_7">MPV 7 Seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editImageFile">Model Image</Label>
                <Input id="editImageFile" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
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
              <Button onClick={handleEditModel}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Price For {editingModel?.brand} {editingModel?.modelName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="provinceId">Province</Label>
                <Select value={priceFormData.provinceId} onValueChange={(value) => setPriceFormData({ ...priceFormData, provinceId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province.provinceId} value={province.provinceId.toString()}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="openingFare">Opening Fare</Label>
                <Input
                  id="openingFare"
                  type="number"
                  value={priceFormData.openingFare}
                  onChange={(e) => setPriceFormData({ ...priceFormData, openingFare: e.target.value })}
                  placeholder="Enter Opening Fare"
                />
              </div>
              <div>
                <Label htmlFor="rateFirst20Km">Price/km (0-20km)</Label>
                <Input
                  id="rateFirst20Km"
                  type="number"
                  value={priceFormData.rateFirst20Km}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rateFirst20Km: e.target.value })}
                  placeholder="Enter Price/km For First 20km"
                />
              </div>
              <div>
                <Label htmlFor="rateOver20Km">Price/km (Over 20km)</Label>
                <Input
                  id="rateOver20Km"
                  type="number"
                  value={priceFormData.rateOver20Km}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rateOver20Km: e.target.value })}
                  placeholder="Enter Price/km For Over 20km"
                />
              </div>
              <div>
                <Label htmlFor="trafficAddPerKm">Traffic Surcharge/km</Label>
                <Input
                  id="trafficAddPerKm"
                  type="number"
                  value={priceFormData.trafficAddPerKm}
                  onChange={(e) => setPriceFormData({ ...priceFormData, trafficAddPerKm: e.target.value })}
                  placeholder="Enter Traffic Surcharge/km"
                />
              </div>
              <div>
                <Label htmlFor="rainAddPerTrip">Rain Surcharge/Trip</Label>
                <Input
                  id="rainAddPerTrip"
                  type="number"
                  value={priceFormData.rainAddPerTrip}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rainAddPerTrip: e.target.value })}
                  placeholder="Enter Rain Surcharge"
                />
              </div>
              <div>
                <Label htmlFor="intercityRatePerKm">Intercity Price/km</Label>
                <Input
                  id="intercityRatePerKm"
                  type="number"
                  value={priceFormData.intercityRatePerKm}
                  onChange={(e) => setPriceFormData({ ...priceFormData, intercityRatePerKm: e.target.value })}
                  placeholder="Enter Intercity Price/km"
                />
              </div>
              <div>
                <Label htmlFor="dateStart">Start Date</Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={priceFormData.dateStart}
                  onChange={(e) => setPriceFormData({ ...priceFormData, dateStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dateEnd">End Date</Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={priceFormData.dateEnd}
                  onChange={(e) => setPriceFormData({ ...priceFormData, dateEnd: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="parentId">Parent Record (Optional)</Label>
                <Select value={priceFormData.parentId || "none"} onValueChange={(value) => setPriceFormData({ ...priceFormData, parentId: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent Record" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent Record</SelectItem>
                    {modelPriceProvinces
                      .filter(mpp => mpp.companyId === currentUser?.companyId && mpp.modelId === editingModel?.modelId)
                      .map(mpp => (
                        <SelectItem key={mpp.modelPriceId} value={mpp.modelPriceId.toString()}>
                          ID: {mpp.modelPriceId} - {mpp.province?.name} - {mpp.openingFare}đ
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={priceFormData.note}
                  onChange={(e) => setPriceFormData({ ...priceFormData, note: e.target.value })}
                  placeholder="Enter Note"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPriceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePrice}>
                Add Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditPriceDialog} onOpenChange={setShowEditPriceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Price {editingPrice?.province?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editProvinceId">Province</Label>
                <Select value={priceFormData.provinceId} onValueChange={(value) => setPriceFormData({ ...priceFormData, provinceId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province.provinceId} value={province.provinceId.toString()}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editOpeningFare">Opening Fare</Label>
                <Input
                  id="editOpeningFare"
                  type="number"
                  value={priceFormData.openingFare}
                  onChange={(e) => setPriceFormData({ ...priceFormData, openingFare: e.target.value })}
                  placeholder="Enter Opening Fare"
                />
              </div>
              <div>
                <Label htmlFor="editRateFirst20Km">Price/km (0-20km)</Label>
                <Input
                  id="editRateFirst20Km"
                  type="number"
                  value={priceFormData.rateFirst20Km}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rateFirst20Km: e.target.value })}
                  placeholder="Enter Price/km For First 20km"
                />
              </div>
              <div>
                <Label htmlFor="editRateOver20Km">Price/km (Over 20km)</Label>
                <Input
                  id="editRateOver20Km"
                  type="number"
                  value={priceFormData.rateOver20Km}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rateOver20Km: e.target.value })}
                  placeholder="Enter Price/km For Over 20km"
                />
              </div>
              <div>
                <Label htmlFor="editTrafficAddPerKm">Traffic Surcharge/km</Label>
                <Input
                  id="editTrafficAddPerKm"
                  type="number"
                  value={priceFormData.trafficAddPerKm}
                  onChange={(e) => setPriceFormData({ ...priceFormData, trafficAddPerKm: e.target.value })}
                  placeholder="Enter Traffic Surcharge/km"
                />
              </div>
              <div>
                <Label htmlFor="editRainAddPerTrip">Rain Surcharge/Trip</Label>
                <Input
                  id="editRainAddPerTrip"
                  type="number"
                  value={priceFormData.rainAddPerTrip}
                  onChange={(e) => setPriceFormData({ ...priceFormData, rainAddPerTrip: e.target.value })}
                  placeholder="Enter Rain Surcharge"
                />
              </div>
              <div>
                <Label htmlFor="editIntercityRatePerKm">Intercity Price/km</Label>
                <Input
                  id="editIntercityRatePerKm"
                  type="number"
                  value={priceFormData.intercityRatePerKm}
                  onChange={(e) => setPriceFormData({ ...priceFormData, intercityRatePerKm: e.target.value })}
                  placeholder="Enter Intercity Price/km"
                />
              </div>
              <div>
                <Label htmlFor="editDateStart">Start Date</Label>
                <Input
                  id="editDateStart"
                  type="date"
                  value={priceFormData.dateStart}
                  onChange={(e) => setPriceFormData({ ...priceFormData, dateStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editDateEnd">End Date</Label>
                <Input
                  id="editDateEnd"
                  type="date"
                  value={priceFormData.dateEnd}
                  onChange={(e) => setPriceFormData({ ...priceFormData, dateEnd: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editParentId">Parent Record (Optional)</Label>
                <Select value={priceFormData.parentId || "none"} onValueChange={(value) => setPriceFormData({ ...priceFormData, parentId: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent Record" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent Record</SelectItem>
                    {modelPriceProvinces
                      .filter(mpp => mpp.companyId === currentUser?.companyId && mpp.modelId === editingPrice?.modelId && mpp.modelPriceId !== editingPrice?.modelPriceId)
                      .map(mpp => (
                        <SelectItem key={mpp.modelPriceId} value={mpp.modelPriceId.toString()}>
                          ID: {mpp.modelPriceId} - {mpp.province?.name} - {mpp.openingFare}đ
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editNote">Note</Label>
                <Textarea
                  id="editNote"
                  value={priceFormData.note}
                  onChange={(e) => setPriceFormData({ ...priceFormData, note: e.target.value })}
                  placeholder="Enter Note"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditPriceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPrice}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyStaffOnly>
  )
}