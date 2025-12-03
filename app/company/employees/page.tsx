"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Users, Search, Plus, Edit, Trash2, Eye, User, Mail, Phone, Building2, Filter, X, Calendar, Shield, Clock, Truck, ChevronLeft, ChevronRight, ChevronDown, CalendarDays } from "lucide-react"
import { getCurrentUser } from "../../../lib/auth"
import { useEffect, useState } from "react"
import { apiService } from "../../../lib/api"
import { CompanyStaffOnly } from "../../../components/roleBasedAccess"
import { shiftStatus, getShiftStatusLabel, getShiftStatusColor, type ShiftStatus } from "../../../lib/constants/enums"
export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState("employees")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [employees, setEmployees] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [scheduleTemplates, setScheduleTemplates] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    role: ''
  })
  const [addFormData, setAddFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'DRIVER'
  })
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false)
  const [showEditTemplateDialog, setShowEditTemplateDialog] = useState(false)
  const [selectedDriverForEdit, setSelectedDriverForEdit] = useState<any>(null)
  const [templateFormData, setTemplateFormData] = useState({
    driverId: '',
    schedules: [{
      weekday: 0,
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      vehicleId: '',
      note: ''
    }]
  })
  const [editTemplateFormData, setEditTemplateFormData] = useState({
    driverId: '',
    schedules: [] as any[]
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showScheduleDetailDialog, setShowScheduleDetailDialog] = useState(false)
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false)
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false)
  const [selectedScheduleForEdit, setSelectedScheduleForEdit] = useState<any>(null)
  const [scheduleFormData, setScheduleFormData] = useState<{
    driverAccountId: string;
    workDate: string;
    startTime: string;
    endTime: string;
    vehicleId: string;
    status: ShiftStatus;
    note: string;
  }>({
    driverAccountId: '',
    workDate: '',
    startTime: '',
    endTime: '',
    vehicleId: '',
    status: shiftStatus.planned,
    note: ''
  })
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [filterDriverId, setFilterDriverId] = useState<string>("")
  const [filterPlateNumber, setFilterPlateNumber] = useState<string>("")
  const [filterStartDate, setFilterStartDate] = useState<string>("")
  const [filterEndDate, setFilterEndDate] = useState<string>("")
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([])
  const [showFilterResults, setShowFilterResults] = useState(false)
  const [showGenerateFromTemplateDialog, setShowGenerateFromTemplateDialog] = useState(false)
  const [genMonth, setGenMonth] = useState<string>(String(new Date().getMonth() + 1))
  const [genYear, setGenYear] = useState<string>(String(new Date().getFullYear()))
  const [templateDrivers, setTemplateDrivers] = useState<any[]>([])
  const [selectedDriverIdsForGen, setSelectedDriverIdsForGen] = useState<string[]>([])
  const [generatingFromTemplates, setGeneratingFromTemplates] = useState(false)
  const toHHMMSS = (timeStr: any) => {
    if (!timeStr) return '00:00:00'
    try {
      const s = String(timeStr)
      const parts = s.split(':')
      const hh = parts[0]?.padStart(2, '0') || '00'
      const mm = (parts[1] || '00').padStart(2, '0')
      const ss = (parts[2] || '00').padStart(2, '0')
      return `${hh}:${mm}:${ss}`
    } catch { return '00:00:00' }
  }
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user && user.companyId) {
      fetchEmployees(user.companyId)
    }
  }, [])
  useEffect(() => {
    if (currentUser?.companyId) {
      if (activeTab === "schedules") {
        fetchSchedules(currentUser.companyId)
      } else if (activeTab === "templates") {
        fetchScheduleTemplates(currentUser.companyId)
        fetchVehicles(currentUser.companyId)
      }
    }
  }, [activeTab, currentUser])
  const fetchEmployees = async (companyId: number) => {
    try {
      setLoading(true)
      setError(null)
      const [employeesResponse, driversResponse] = await Promise.all([
        apiService.getAccounts({
          companyId,
          pageSize: 1000
        }),
        apiService.getAccounts({
          companyId,
          role: 'DRIVER',
          pageSize: 1000
        })
      ])
      setEmployees(employeesResponse.items || [])
      setDrivers(driversResponse.items || [])
    } catch (error) {
      setError(`Error Loading Data: ${error}`)
      setEmployees([])
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }
  const fetchSchedules = async (companyId: number) => {
    try {
      const response = await apiService.getDriverSchedules({
        companyId,
        pageSize: 1000
      })
      setSchedules(response.items || [])
    } catch (error) {
      setSchedules([])
    }
  }
  const fetchScheduleTemplates = async (companyId: number) => {
    try {
      const response = await apiService.getDriverScheduleTemplates({
        companyId,
        pageSize: 1000
      })
      setScheduleTemplates(response.items || [])
    } catch (error) {
      setScheduleTemplates([])
    }
  }
  const fetchVehicles = async (companyId: number) => {
    try {
      const response = await apiService.getVehicles({
        companyId,
        pageSize: 1000
      })
      setVehicles(response.items || [])
    } catch (error) {
      setVehicles([])
    }
  }
  const fetchVehiclesForDriver = async (driverId: number) => {
    try {
      setLoadingVehicles(true)
      const vehiclesResponse = await apiService.getVehicles({
        pageSize: 1000,
        companyId: currentUser?.companyId
      })
      const assignedVehicles = vehiclesResponse.items?.filter((vehicle: any) => {
        return vehicle.driverVehicleAssignments?.some((dva: any) =>
          dva.driverAccountId?.toString() === driverId.toString()
        )
      }) || []
      setAvailableVehicles(assignedVehicles)
    } catch (error) {
      setAvailableVehicles([])
    } finally {
      setLoadingVehicles(false)
    }
  }
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || employee.role === selectedRole
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      MANAGER: { label: "Manager", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
      ACCOUNTANT: { label: "Accountant", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      DISPATCHER: { label: "Dispatcher", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      DRIVER: { label: "Driver", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" }
    }
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" }
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }
  const openDetailDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setShowDetailDialog(true)
  }
  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setEditFormData({
      role: employee.role || ''
    })
    setShowEditDialog(true)
  }
  const openAddDialog = () => {
    setAddFormData({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'DRIVER'
    })
    setShowAddDialog(true)
  }
  const handleUpdateRole = async () => {
    try {
      if (!editFormData.role) {
        alert('Please Select A Role')
        return
      }
      await apiService.updateAccount(selectedEmployee.accountId, {
        role: editFormData.role
      })
      alert('Role Updated Successfully!')
      setShowEditDialog(false)
      setEditFormData({ role: '' })
      if (currentUser) {
        fetchEmployees(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Update Role'}`)
    }
  }
  const handleDeactivateEmployee = async (employee: any) => {
    if (!confirm(`Are You Sure You Want To Deactivate ${employee.fullName}'s Account?`)) return
    try {
      await apiService.updateAccount(employee.accountId, {
        status: 'INACTIVE'
      })
      alert('Account Deactivated Successfully!')
      if (currentUser) {
        fetchEmployees(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Deactivate Account'}`)
    }
  }
  const handleAddEmployee = async () => {
    try {
      if (!addFormData.fullName || !addFormData.username || !addFormData.email || !addFormData.password) {
        alert('Please Fill In All Required Fields')
        return
      }
      await apiService.createAccount({
        fullName: addFormData.fullName,
        username: addFormData.username,
        email: addFormData.email,
        phone: addFormData.phone || null,
        password: addFormData.password,
        role: addFormData.role,
        companyId: currentUser?.companyId
      })
      alert('Employee Added Successfully!')
      setShowAddDialog(false)
      setAddFormData({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'DRIVER'
      })
      if (currentUser) {
        fetchEmployees(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Add Employee'}`)
    }
  }
  const handleAddSchedule = () => {
    if (!selectedDate) return
    setScheduleFormData({
      driverAccountId: '',
      workDate: selectedDate.toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      vehicleId: '',
      status: shiftStatus.planned,
      note: ''
    })
    setAvailableVehicles([])
    setShowAddScheduleDialog(true)
  }
  const handleFilterSchedules = () => {
    let filtered = [...schedules]
    if (filterDriverId) {
      filtered = filtered.filter(schedule =>
        schedule.driverAccountId?.toString().includes(filterDriverId) ||
        schedule.driver?.fullName?.toLowerCase().includes(filterDriverId.toLowerCase())
      )
    }
    if (filterPlateNumber) {
      filtered = filtered.filter(schedule =>
        schedule.vehicle?.plateNumber?.toLowerCase().includes(filterPlateNumber.toLowerCase())
      )
    }
    if (filterStartDate) {
      const startDateStr = filterStartDate.split('T')[0]
      filtered = filtered.filter(schedule => {
        const scheduleDateStr = (schedule.workDate || schedule.date).split('T')[0].split(' ')[0]
        return scheduleDateStr >= startDateStr
      })
    }
    if (filterEndDate) {
      const endDateStr = filterEndDate.split('T')[0]
      filtered = filtered.filter(schedule => {
        const scheduleDateStr = (schedule.workDate || schedule.date).split('T')[0].split(' ')[0]
        return scheduleDateStr <= endDateStr
      })
    }
    setFilteredSchedules(filtered)
    setShowFilterResults(true)
  }
  const handleClearFilter = () => {
    setFilterDriverId("")
    setFilterPlateNumber("")
    setFilterStartDate("")
    setFilterEndDate("")
    setFilteredSchedules([])
    setShowFilterResults(false)
  }
  const handleEditSchedule = (schedule: any) => {
    setSelectedScheduleForEdit(schedule)
    setScheduleFormData({
      driverAccountId: schedule.driverAccountId?.toString() || '',
      workDate: schedule.workDate || schedule.date || '',
      startTime: schedule.startTime || '',
      endTime: schedule.endTime || '',
      vehicleId: schedule.vehicleId?.toString() || '',
      status: (schedule.status as ShiftStatus) || shiftStatus.planned,
      note: schedule.note || ''
    })
    if (schedule.driverAccountId) {
      fetchVehiclesForDriver(schedule.driverAccountId)
    }
    setShowEditScheduleDialog(true)
  }
  const handleDeleteSchedule = async (schedule: any) => {
    if (!confirm(`Are You Sure You Want To Delete The Schedule For ${schedule.driver?.fullName} On ${schedule.workDate || schedule.date}?`)) {
      return
    }
    try {
      await apiService.deleteDriverSchedule(schedule.scheduleId)
      alert('Schedule Deleted Successfully!')
      if (currentUser) {
        fetchSchedules(currentUser.companyId)
      }
      setShowScheduleDetailDialog(false)
      setTimeout(() => {
        if (selectedDate) {
          setShowScheduleDetailDialog(true)
        }
      }, 100)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Delete Schedule'}`)
    }
  }
  const handleSaveSchedule = async () => {
    try {
      if (!scheduleFormData.driverAccountId || !scheduleFormData.startTime || !scheduleFormData.endTime) {
        alert('Please Fill In All Required Fields')
        return
      }
      if (scheduleFormData.startTime >= scheduleFormData.endTime) {
        alert('Start Time Must Be Earlier Than End Time')
        return
      }
      const scheduleData = {
        driverAccountId: parseInt(scheduleFormData.driverAccountId),
        workDate: scheduleFormData.workDate,
        startTime: scheduleFormData.startTime,
        endTime: scheduleFormData.endTime,
        vehicleId: scheduleFormData.vehicleId ? parseInt(scheduleFormData.vehicleId) : null,
        status: scheduleFormData.status,
        note: scheduleFormData.note || null
      }
      if (showEditScheduleDialog && selectedScheduleForEdit) {
        await apiService.updateDriverSchedule(selectedScheduleForEdit.scheduleId, scheduleData)
        alert('Schedule Updated Successfully!')
      } else {
        await apiService.createDriverSchedule(scheduleData)
        alert('Schedule Added Successfully!')
      }
      setShowAddScheduleDialog(false)
      setShowEditScheduleDialog(false)
      setScheduleFormData({
        driverAccountId: '',
        workDate: '',
        startTime: '',
        endTime: '',
        vehicleId: '',
        status: shiftStatus.planned,
        note: ''
      })
      if (currentUser) {
        fetchSchedules(currentUser.companyId)
      }
      setShowScheduleDetailDialog(false)
      setTimeout(() => {
        if (selectedDate) {
          setShowScheduleDetailDialog(true)
        }
      }, 100)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Save Schedule'}`)
    }
  }
  const handleAddTemplate = async () => {
    try {
      if (!templateFormData.driverId || templateFormData.schedules.length === 0) {
        alert('Please Select A Driver And Add At Least One Shift')
        return
      }
      for (const schedule of templateFormData.schedules) {
        if (!schedule.startTime || !schedule.endTime) {
          alert('Please Fill In Start And End Times For All Shifts')
          return
        }
        if (schedule.startDate && schedule.endDate) {
          const startDate = new Date(schedule.startDate)
          const endDate = new Date(schedule.endDate)
          if (startDate > endDate) {
            alert('Start Date Must Be Earlier Than Or Equal To End Date')
            return
          }
        }
        if (schedule.startTime >= schedule.endTime) {
          alert('Start Time Must Be Earlier Than End Time')
          return
        }
      }
      const promises = templateFormData.schedules.map(schedule =>
        apiService.createDriverScheduleTemplate({
          driverAccountId: parseInt(templateFormData.driverId),
          weekday: schedule.weekday,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          startDate: schedule.startDate || null,
          endDate: schedule.endDate || null,
          vehicleId: schedule.vehicleId ? parseInt(schedule.vehicleId) : null,
          note: schedule.note || null
        })
      )
      await Promise.all(promises)
      alert('Template Added Successfully!')
      setShowAddTemplateDialog(false)
      setTemplateFormData({
        driverId: '',
        schedules: [{
          weekday: 0,
          startTime: '',
          endTime: '',
          startDate: '',
          endDate: '',
          vehicleId: '',
          note: ''
        }]
      })
      if (currentUser) {
        fetchScheduleTemplates(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Add Template'}`)
    }
  }
  const openEditTemplateDialog = (driver: any) => {
    setSelectedDriverForEdit(driver)
    const driverTemplates = scheduleTemplates.filter(template =>
      template.driver?.accountId === driver.accountId
    )
    const schedules = driverTemplates.map(template => ({
      templateId: template.templateId,
      weekday: template.weekday,
      startTime: template.startTime,
      endTime: template.endTime,
      startDate: template.startDate || '',
      endDate: template.endDate || '',
      vehicleId: template.vehicleId?.toString() || '',
      note: template.note || ''
    }))
    setEditTemplateFormData({
      driverId: driver.accountId.toString(),
      schedules: schedules
    })
    setShowEditTemplateDialog(true)
  }
  const handleDeleteTemplateSchedule = async (index: number) => {
    const schedule = editTemplateFormData.schedules[index]
    if (schedule.templateId) {
      if (!confirm('Are You Sure You Want To Delete This Shift?')) {
        return
      }
      try {
        await apiService.deleteDriverScheduleTemplate(schedule.templateId)
        const newSchedules = editTemplateFormData.schedules.filter((_, i) => i !== index)
        setEditTemplateFormData({
          ...editTemplateFormData,
          schedules: newSchedules
        })
        alert('Shift Deleted Successfully!')
        if (currentUser) {
          fetchScheduleTemplates(currentUser.companyId)
        }
      } catch (error: any) {
        alert(`Error: ${error.message || 'Unable To Delete Shift'}`)
      }
    } else {
      const newSchedules = editTemplateFormData.schedules.filter((_, i) => i !== index)
      setEditTemplateFormData({
        ...editTemplateFormData,
        schedules: newSchedules
      })
    }
  }
  const handleUpdateSingleSchedule = async (index: number) => {
    try {
      const schedule = editTemplateFormData.schedules[index]
      if (!schedule.startTime || !schedule.endTime) {
        alert('Please Fill In Start And End Times')
        return
      }
      if (schedule.startDate && schedule.endDate) {
        const startDate = new Date(schedule.startDate)
        const endDate = new Date(schedule.endDate)
        if (startDate > endDate) {
          alert('Start Date Must Be Earlier Than Or Equal To End Date')
          return
        }
      }
      if (schedule.startTime >= schedule.endTime) {
        alert('Start Time Must Be Earlier Than End Time')
        return
      }
      const scheduleData = {
        driverAccountId: parseInt(editTemplateFormData.driverId),
        weekday: schedule.weekday,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        startDate: schedule.startDate || null,
        endDate: schedule.endDate || null,
        vehicleId: schedule.vehicleId ? parseInt(schedule.vehicleId) : null,
        note: schedule.note || null
      }
      if (schedule.templateId) {
        await apiService.updateDriverScheduleTemplate(schedule.templateId, scheduleData)
        alert('Shift Updated Successfully!')
      } else {
        await apiService.createDriverScheduleTemplate(scheduleData)
        alert('Shift Added Successfully!')
      }
      if (currentUser) {
        fetchScheduleTemplates(currentUser.companyId)
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Unable To Update Shift'}`)
    }
  }
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }
  const getSchedulesForDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    return schedules.filter(schedule => {
      const scheduleDateValue = schedule.date || schedule.workDate
      if (!scheduleDateValue) return false
      try {
        let scheduleDateStr = scheduleDateValue
        if (typeof scheduleDateValue === 'string') {
          scheduleDateStr = scheduleDateValue.split('T')[0].split(' ')[0]
        } else {
          const d = new Date(scheduleDateValue)
          scheduleDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        }
        const matches = scheduleDateStr === dateStr
        return matches
      } catch (error) {
        return false
      }
    })
  }
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowScheduleDetailDialog(true)
  }
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  const getWeekdayName = (weekday: number) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekdays[weekday]
  }
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return (
    <CompanyStaffOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <Users className="w-8 h-8" />
              Employee Management
            </h1>
            <p className="text-gray-600 dark:text-yellow-200 mt-2">
              Manage Employee Information And Work Schedules
            </p>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab("employees")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${activeTab === "employees"
                ? "bg-yellow-500 text-black font-semibold shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Employee Management
            </button>
            <button
              onClick={() => setActiveTab("schedules")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${activeTab === "schedules"
                ? "bg-yellow-500 text-black font-semibold shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Work Schedule
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${activeTab === "templates"
                ? "bg-yellow-500 text-black font-semibold shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Work Schedule Template
            </button>
          </nav>
        </div>
        {activeTab === "employees" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Employee List
                </h2>
                <p className="text-gray-600 dark:text-yellow-200 mt-1">
                  Manage Employee Information And Roles
                </p>
              </div>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={openAddDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
            <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search Employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-48">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter By Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                        <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                        <SelectItem value="DRIVER">Driver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-48">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter By Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-yellow-300">
                    {filteredEmployees.length} Employees
                  </div>
                </div>
              </CardContent>
            </Card>
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-yellow-200">Loading Employee Data...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-red-500 mb-4">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Data Loading Error</p>
                    <p className="text-sm mt-2">{error}</p>
                  </div>
                  <Button
                    onClick={() => currentUser?.companyId && fetchEmployees(currentUser.companyId)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : employees.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-yellow-200">No Employees Yet</p>
                  <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Employee
                  </Button>
                </CardContent>
              </Card>
            ) : filteredEmployees.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-yellow-200">No Employees Found</p>
                  <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-4">
                    Clear Filter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.accountId} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                            {employee.fullName || 'No Name'}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-yellow-300">
                            {employee.username || 'No Username'}
                          </CardDescription>
                        </div>
                        {getRoleBadge(employee.role)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <Mail className="w-4 h-4 mr-2" />
                          {employee.email || 'No Email'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <Phone className="w-4 h-4 mr-2" />
                          {employee.phone || 'No Phone Number'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <Building2 className="w-4 h-4 mr-2" />
                          ID: {employee.accountId}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                          <Building2 className="w-4 h-4 mr-2" />
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${employee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>Status: {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openDetailDialog(employee)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditDialog(employee)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeactivateEmployee(employee)}
                          disabled={employee.status === 'INACTIVE'}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {employee.status === 'INACTIVE' ? 'Deactivated' : 'Deactivate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === "schedules" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Work Schedule
                </h2>
                <p className="text-gray-600 dark:text-yellow-200 mt-1">
                  View Driver Work Schedules By Day
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      if (!currentUser?.companyId) return
                      const resp = await apiService.getDriverScheduleTemplates({ companyId: currentUser.companyId, page: 1, pageSize: 1000 })
                      const items = (resp as any).items || resp || []
                      const uniqueDrivers: Record<string, any> = {}
                      items.forEach((t: any) => {
                        const d = t.driver || { accountId: t.driverAccountId, fullName: t.driverName }
                        if (d?.accountId && !uniqueDrivers[d.accountId]) uniqueDrivers[d.accountId] = d
                      })
                      setTemplateDrivers(Object.values(uniqueDrivers))
                      setSelectedDriverIdsForGen([])
                      setShowGenerateFromTemplateDialog(true)
                    } catch (e) {
                      setTemplateDrivers([])
                      setShowGenerateFromTemplateDialog(true)
                    }
                  }}
                >
                  Add Schedule Automatically From Template
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-yellow-300">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-20"></div>
                    }
                    const daySchedules = getSchedulesForDate(day)
                    const isToday = day.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
                    return (
                      <div
                        key={index}
                        className={`
                        h-20 p-1 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                        ${isToday ? 'bg-blue-100 dark:bg-blue-900' : ''}
                        ${isSelected ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
                      `}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className="flex flex-col h-full">
                          <div className={`
                          text-sm font-medium mb-1
                          ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-yellow-400'}
                        `}>
                            {day.getDate()}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            {daySchedules.length > 0 && (
                              <div className="space-y-1">
                                {daySchedules.slice(0, 2).map((schedule: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1 py-0.5 rounded truncate"
                                  >
                                    {schedule.driver?.fullName}: {schedule.startTime}
                                  </div>
                                ))}
                                {daySchedules.length > 2 && (
                                  <div className="text-xs text-gray-500 dark:text-yellow-300">
                                    +{daySchedules.length - 2} More Shifts
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 relative min-w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search By Driver (ID Or Name)..."
                      value={filterDriverId}
                      onChange={(e) => setFilterDriverId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-48">
                    <Input
                      placeholder="License Plate"
                      value={filterPlateNumber}
                      onChange={(e) => setFilterPlateNumber(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      type="date"
                      placeholder="From Date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      type="date"
                      placeholder="To Date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleFilterSchedules} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button onClick={handleClearFilter} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20">
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  {showFilterResults && (
                    <div className="text-sm text-gray-600 dark:text-yellow-300">
                      {filteredSchedules.length} Schedules
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {showFilterResults && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Results ({filteredSchedules.length} Schedules)
                  </CardTitle>
                  <CardDescription>
                    List Of Schedules Filtered By Selected Criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                        No Schedules Found
                      </h3>
                      <p className="text-gray-600 dark:text-yellow-200">
                        No Schedules Match The Filter Criteria
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Driver
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Work Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Start Time
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              End Time
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Vehicle
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-yellow-400">
                              Note
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSchedules.map((schedule) => (
                            <tr key={schedule.scheduleId} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-yellow-400">
                                    {schedule.driver?.fullName || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-yellow-300">
                                    ID: {schedule.driverAccountId}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-yellow-400">
                                {schedule.workDate || schedule.date || 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-yellow-400">
                                {schedule.startTime || 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-yellow-400">
                                {schedule.endTime || 'N/A'}
                              </td>
                              <td className="py-3 px-4">
                                {schedule.vehicle ? (
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-yellow-400">
                                      {schedule.vehicle.plateNumber}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-yellow-300">
                                      {schedule.vehicle.model} - {schedule.vehicle.brand}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 dark:text-yellow-300">No Vehicle Assigned</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftStatusColor(schedule.status)}`}>
                                  {getShiftStatusLabel(schedule.status)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-yellow-400">
                                {schedule.note || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
        {activeTab === "templates" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Work Schedule Template
                </h2>
                <p className="text-gray-600 dark:text-yellow-200 mt-1">
                  Manage Recurring Work Schedule Templates
                </p>
              </div>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => setShowAddTemplateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </div>
            {scheduleTemplates.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                    No Templates Yet
                  </h3>
                  <p className="text-gray-600 dark:text-yellow-200">
                    No Work Schedule Templates Have Been Created
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search By Driver Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Badge variant="outline" className="text-gray-600 dark:text-yellow-300">
                    {scheduleTemplates.length} Template{scheduleTemplates.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-yellow-300 border-r">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Driver
                            </div>
                          </th>
                          {[0, 1, 2, 3, 4, 5, 6].map((weekday) => (
                            <th key={weekday} className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-yellow-300 border-r last:border-r-0">
                              <div className="flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {getWeekdayName(weekday)}
                              </div>
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-yellow-300">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {(() => {
                          const driverTemplates = scheduleTemplates.reduce((acc: any, template: any) => {
                            const driverId = template.driver?.accountId || 'unknown';
                            if (!acc[driverId]) {
                              acc[driverId] = {
                                driver: template.driver,
                                templates: []
                              };
                            }
                            acc[driverId].templates.push(template);
                            return acc;
                          }, {});
                          const filteredDrivers = Object.values(driverTemplates).filter((driverData: any) =>
                            driverData.driver?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
                          );
                          return filteredDrivers.map((driverData: any) => (
                            <tr key={driverData.driver?.accountId || 'unknown'} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-4 py-3 border-r">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-yellow-400">
                                      {driverData.driver?.fullName || 'Driver'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-yellow-300">
                                      {driverData.templates.length} Shifts
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
                                const dayTemplates = driverData.templates.filter((t: any) => t.weekday === weekday);
                                return (
                                  <td key={weekday} className="px-4 py-3 text-center border-r last:border-r-0">
                                    {dayTemplates.length > 0 ? (
                                      <div className="space-y-1">
                                        {dayTemplates.map((template: any, index: number) => (
                                          <div key={template.templateId} className="text-xs">
                                            <div className={`px-2 py-1 rounded ${template.isActive
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                              }`}>
                                              <div className="font-medium">{template.startTime} - {template.endTime}</div>
                                              {template.vehicle && (
                                                <div className="text-xs opacity-75">{template.vehicle.plateNumber}</div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-gray-400 dark:text-gray-600 text-sm">-</div>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditTemplateDialog(driverData.driver)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-6 h-6" />
                Employee Details
              </DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-yellow-400">
                      {selectedEmployee.fullName || 'No Name'}
                    </h3>
                    <p className="text-gray-600 dark:text-yellow-300">
                      {selectedEmployee.username || 'No Username'}
                    </p>
                    <div className="mt-2">
                      {getRoleBadge(selectedEmployee.role)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Full Name</Label>
                      <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.fullName || 'No Information'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Username</Label>
                      <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.username || 'No Information'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.email || 'No Information'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.phone || 'No Information'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Work Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Role</Label>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        {getRoleBadge(selectedEmployee.role)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Status</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedEmployee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-gray-900 dark:text-yellow-100">
                          {selectedEmployee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Account ID</Label>
                      <p className="text-gray-900 dark:text-yellow-100 font-mono">{selectedEmployee.accountId}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Company ID</Label>
                      <p className="text-gray-900 dark:text-yellow-100 font-mono">{selectedEmployee.companyId || 'No Information'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Time Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Created Date</Label>
                      <p className="text-gray-900 dark:text-yellow-100">
                        {selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt).toLocaleString('en-US') : 'No Information'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Last Updated</Label>
                      <p className="text-gray-900 dark:text-yellow-100">
                        {selectedEmployee.updatedAt ? new Date(selectedEmployee.updatedAt).toLocaleString('en-US') : 'No Information'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Email Verified</Label>
                      <p className="text-gray-900 dark:text-yellow-100">
                        {selectedEmployee.emailVerifiedAt ? new Date(selectedEmployee.emailVerifiedAt).toLocaleString('en-US') : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedEmployee.company && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Company Name</Label>
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.company.name || 'No Information'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Hotline</Label>
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.company.hotline || 'No Information'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Company Email</Label>
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.company.email || 'No Information'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Tax Code</Label>
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.company.taxCode || 'No Information'}</p>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-yellow-300">Address</Label>
                        <p className="text-gray-900 dark:text-yellow-100">{selectedEmployee.company.address || 'No Information'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={showGenerateFromTemplateDialog} onOpenChange={setShowGenerateFromTemplateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Schedules From Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Month</Label>
                  <Select value={genMonth} onValueChange={setGenMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input value={genYear} onChange={(e) => setGenYear(e.target.value)} placeholder="2025" />
                </div>
              </div>
              <div>
                <Label>Select Drivers With Templates</Label>
                <div className="max-h-64 overflow-auto mt-2 border rounded p-2 space-y-1">
                  {templateDrivers.length === 0 ? (
                    <div className="text-sm text-gray-500">No Templates Available</div>
                  ) : (
                    templateDrivers.map((d: any) => (
                      <label key={d.accountId} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedDriverIdsForGen.includes(String(d.accountId))}
                          onChange={(e) => {
                            const id = String(d.accountId)
                            setSelectedDriverIdsForGen(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id))
                          }}
                        />
                        <span>{d.fullName} (ID: {d.accountId})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button
                  disabled={generatingFromTemplates || selectedDriverIdsForGen.length === 0}
                  onClick={async () => {
                    try {
                      setGeneratingFromTemplates(true)
                      const resp = await apiService.getDriverScheduleTemplates({ companyId: currentUser?.companyId, page: 1, pageSize: 1000 })
                      const allTemplates = (resp as any).items || resp || []
                      const map: Record<string, any[]> = {}
                      allTemplates.forEach((t: any) => {
                        const did = String((t.driver?.accountId) || t.driverAccountId || '')
                        if (!did) return
                        if (!map[did]) map[did] = []
                        map[did].push(t)
                      })
                      const month = parseInt(genMonth)
                      const year = parseInt(genYear)
                      const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
                      const daysInMonth = new Date(year, month, 0).getDate()
                      const inRange = (dDate: Date, start?: any, end?: any) => {
                        const d = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate())
                        if (start) {
                          const s0 = new Date(start)
                          const s = new Date(s0.getFullYear(), s0.getMonth(), s0.getDate())
                          if (d < s) return false
                        }
                        if (end) {
                          const e0 = new Date(end)
                          const e = new Date(e0.getFullYear(), e0.getMonth(), e0.getDate())
                          if (d > e) return false
                        }
                        return true
                      }
                      const allCreates: Promise<any>[] = []
                      let planned = 0
                      for (const driverId of selectedDriverIdsForGen) {
                        const templates = map[driverId] || []
                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(year, month - 1, day)
                          const weekday = date.getDay()
                          const ymd = `${year}-${pad(month)}-${pad(day)}`
                          templates
                            .filter((t: any) => Number(t.weekday) === weekday)
                            .forEach((t: any) => {
                              if (!inRange(date, t.startDate, t.endDate)) return
                              planned++
                              allCreates.push(
                                apiService.createDriverSchedule({
                                  driverAccountId: Number(driverId),
                                  workDate: ymd,
                                  startTime: toHHMMSS(t.startTime),
                                  endTime: toHHMMSS(t.endTime),
                                  vehicleId: t.vehicleId || null,
                                  status: 'planned',
                                  note: 'Auto from template'
                                })
                              )
                            })
                        }
                      }
                      const results = await Promise.allSettled(allCreates)
                      const ok = results.filter(r => r.status === 'fulfilled').length
                      const fail = results.length - ok
                      if (planned === 0) {
                        alert('No Matching Shifts Found In Templates For The Selected Month')
                      } else if (ok === 0) {
                        alert('Failed To Generate Schedules. Please Check Time/Format.')
                      } else {
                        alert(`Generated ${ok}/${planned} Shifts From Templates${fail > 0 ? ` (${fail} Failed)` : ''}`)
                      }
                      setShowGenerateFromTemplateDialog(false)
                      setCurrentDate(new Date(year, month - 1, 1))
                      if (currentUser?.companyId) fetchSchedules(currentUser.companyId)
                    } catch (e: any) {
                      alert(`Error Generating Schedules: ${e?.message || 'Unknown Error'}`)
                    } finally {
                      setGeneratingFromTemplates(false)
                    }
                  }}
                >
                  {generatingFromTemplates ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Employee Role
              </DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <p className="text-sm text-gray-600 dark:text-yellow-300 mt-1">
                    {selectedEmployee?.fullName} ({selectedEmployee?.email})
                  </p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                      <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                      <SelectItem value="DRIVER">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateRole} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Save
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Employee
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Enter Full Name"
                    value={addFormData.fullName}
                    onChange={(e) => setAddFormData({ ...addFormData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Username *</Label>
                  <Input
                    placeholder="Enter Username"
                    value={addFormData.username}
                    onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter Phone Number"
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={addFormData.role} onValueChange={(value) => setAddFormData({ ...addFormData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                      <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                      <SelectItem value="DRIVER">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  disabled={!addFormData.fullName || !addFormData.username || !addFormData.email || !addFormData.password}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Add Employee
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showAddTemplateDialog} onOpenChange={setShowAddTemplateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Add Work Schedule Template
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template-driver">Select Driver *</Label>
                <Select
                  value={templateFormData.driverId}
                  onValueChange={(value) => {
                    const cleared = templateFormData.schedules.map(s => ({ ...s, vehicleId: '' }))
                    setTemplateFormData({ ...templateFormData, driverId: value, schedules: cleared })
                    const driverIdNum = parseInt(value)
                    if (!Number.isNaN(driverIdNum)) {
                      fetchVehiclesForDriver(driverIdNum)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver: any) => (
                      <SelectItem key={driver.accountId} value={driver.accountId.toString()}>
                        {driver.fullName} ({driver.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Work Schedules</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTemplateFormData({
                      ...templateFormData,
                      schedules: [...templateFormData.schedules, {
                        weekday: 0,
                        startTime: '',
                        endTime: '',
                        startDate: '',
                        endDate: '',
                        vehicleId: '',
                        note: ''
                      }]
                    })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Shift
                  </Button>
                </div>
                {templateFormData.schedules.map((schedule, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Weekday *</Label>
                        <Select
                          value={schedule.weekday.toString()}
                          onValueChange={(value) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].weekday = parseInt(value)
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Weekday" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Sunday</SelectItem>
                            <SelectItem value="1">Monday</SelectItem>
                            <SelectItem value="2">Tuesday</SelectItem>
                            <SelectItem value="3">Wednesday</SelectItem>
                            <SelectItem value="4">Thursday</SelectItem>
                            <SelectItem value="5">Friday</SelectItem>
                            <SelectItem value="6">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time *</Label>
                        <Input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].startTime = e.target.value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time *</Label>
                        <Input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].endTime = e.target.value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={schedule.startDate}
                          onChange={(e) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].startDate = e.target.value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={schedule.endDate}
                          onChange={(e) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].endDate = e.target.value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Vehicle</Label>
                        <Select
                          value={schedule.vehicleId}
                          onValueChange={(value) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].vehicleId = value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {(templateFormData.driverId ? availableVehicles : []).map((vehicle: any) => (
                              <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                                {vehicle.plateNumber} - {vehicle.model?.brand} {vehicle.model?.modelName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {templateFormData.driverId && !loadingVehicles && availableVehicles.length === 0 && (
                          <p className="text-xs text-gray-500 dark:text-yellow-300/70">Driver Has No Assigned Vehicles.</p>
                        )}
                        {!templateFormData.driverId && (
                          <p className="text-xs text-gray-500 dark:text-yellow-300/70">Please Select Driver First.</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <Label>Note</Label>
                        <Input
                          value={schedule.note}
                          onChange={(e) => {
                            const newSchedules = [...templateFormData.schedules]
                            newSchedules[index].note = e.target.value
                            setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                          }}
                          placeholder="Enter Note (Optional)"
                        />
                      </div>
                      {templateFormData.schedules.length > 1 && (
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              const newSchedules = templateFormData.schedules.filter((_, i) => i !== index)
                              setTemplateFormData({ ...templateFormData, schedules: newSchedules })
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove Shift
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTemplateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTemplate}
                  disabled={!templateFormData.driverId || templateFormData.schedules.length === 0}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Add Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditTemplateDialog} onOpenChange={setShowEditTemplateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Edit Work Schedule Template - {selectedDriverForEdit?.fullName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Driver</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-yellow-400">
                        {selectedDriverForEdit?.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-yellow-300">
                        {selectedDriverForEdit?.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Work Schedules</Label>
                </div>
                {editTemplateFormData.schedules.map((schedule, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Weekday *</Label>
                        <Select
                          value={schedule.weekday.toString()}
                          onValueChange={(value) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].weekday = parseInt(value)
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Weekday" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Sunday</SelectItem>
                            <SelectItem value="1">Monday</SelectItem>
                            <SelectItem value="2">Tuesday</SelectItem>
                            <SelectItem value="3">Wednesday</SelectItem>
                            <SelectItem value="4">Thursday</SelectItem>
                            <SelectItem value="5">Friday</SelectItem>
                            <SelectItem value="6">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time *</Label>
                        <Input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].startTime = e.target.value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time *</Label>
                        <Input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].endTime = e.target.value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={schedule.startDate}
                          onChange={(e) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].startDate = e.target.value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={schedule.endDate}
                          onChange={(e) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].endDate = e.target.value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        />
                      </div>
                      <div className="space-y-2 overflow-hidden">
                        <Label>Vehicle</Label>
                        <Select
                          value={schedule.vehicleId}
                          onValueChange={(value) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].vehicleId = value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((vehicle: any) => (
                              <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                                {vehicle.plateNumber} - {vehicle.model?.brand} {vehicle.model?.modelName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <Label>Note</Label>
                        <Input
                          value={schedule.note}
                          onChange={(e) => {
                            const newSchedules = [...editTemplateFormData.schedules]
                            newSchedules[index].note = e.target.value
                            setEditTemplateFormData({ ...editTemplateFormData, schedules: newSchedules })
                          }}
                          placeholder="Enter Note (Optional)"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateSingleSchedule(index)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteTemplateSchedule(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditTemplateDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showScheduleDetailDialog} onOpenChange={setShowScheduleDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6" />
                  Work Schedule For {selectedDate ? formatDate(selectedDate) : ''}
                </DialogTitle>
                <Button
                  onClick={handleAddSchedule}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Schedule
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDate && getSchedulesForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                    No Work Schedules
                  </h3>
                  <p className="text-gray-600 dark:text-yellow-200">
                    No Drivers Have Schedules For This Day
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                  {selectedDate && getSchedulesForDate(selectedDate).map((schedule: any) => (
                    <Card key={schedule.scheduleId} className="hover:shadow-lg transition-shadow overflow-auto w-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                                {schedule.driver?.fullName || 'Driver'}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-yellow-300">
                                {schedule.driver?.email || ''}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getShiftStatusColor(schedule.status as ShiftStatus)}>
                            {getShiftStatusLabel(schedule.status as ShiftStatus)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                            <Clock className="w-4 h-4 mr-2" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.vehicle && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                              <Truck className="w-4 h-4 mr-2" />
                              {schedule.vehicle.plateNumber}
                            </div>
                          )}
                          {schedule.note && (
                            <div className="text-sm text-gray-600 dark:text-yellow-300">
                              <p className="font-medium">Note:</p>
                              <p>{schedule.note}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSchedule(schedule)}
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSchedule(schedule)}
                            className="flex-1 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Schedule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-driver">Driver *</Label>
                <Select
                  value={scheduleFormData.driverAccountId}
                  onValueChange={(value) => {
                    setScheduleFormData({ ...scheduleFormData, driverAccountId: value, vehicleId: '' })
                    if (value) {
                      fetchVehiclesForDriver(parseInt(value))
                    } else {
                      setAvailableVehicles([])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver: any) => (
                      <SelectItem key={driver.accountId} value={driver.accountId.toString()}>
                        {driver.fullName} ({driver.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Work Date *</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleFormData.workDate}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, workDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-start">Start Time *</Label>
                <Input
                  id="schedule-start"
                  type="time"
                  value={scheduleFormData.startTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-end">End Time *</Label>
                <Input
                  id="schedule-end"
                  type="time"
                  value={scheduleFormData.endTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, endTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-vehicle">Vehicle</Label>
                {loadingVehicles ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    Loading Vehicles...
                  </div>
                ) : (
                  <Select
                    value={scheduleFormData.vehicleId}
                    onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, vehicleId: value })}
                    disabled={!scheduleFormData.driverAccountId || availableVehicles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !scheduleFormData.driverAccountId
                          ? "Please Select Driver First"
                          : availableVehicles.length === 0
                            ? "Driver Has No Assigned Vehicles"
                            : "Select Vehicle (Optional)"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle: any) => (
                        <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                          {vehicle.plateNumber} - {vehicle.model?.brand} {vehicle.model?.modelName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {scheduleFormData.driverAccountId && availableVehicles.length === 0 && !loadingVehicles && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    This Driver Has No Assigned Vehicles. Please Contact Manager.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-status">Status</Label>
                <Select
                  value={scheduleFormData.status}
                  onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, status: value as ShiftStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={shiftStatus.planned}>{getShiftStatusLabel(shiftStatus.planned)}</SelectItem>
                    <SelectItem value={shiftStatus.on}>{getShiftStatusLabel(shiftStatus.on)}</SelectItem>
                    <SelectItem value={shiftStatus.off}>{getShiftStatusLabel(shiftStatus.off)}</SelectItem>
                    <SelectItem value={shiftStatus.cancelled}>{getShiftStatusLabel(shiftStatus.cancelled)}</SelectItem>
                    <SelectItem value={shiftStatus.completed}>{getShiftStatusLabel(shiftStatus.completed)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-note">Note</Label>
                <Input
                  id="schedule-note"
                  value={scheduleFormData.note}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, note: e.target.value })}
                  placeholder="Enter Note (Optional)"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddScheduleDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSchedule}
                  disabled={!scheduleFormData.driverAccountId || !scheduleFormData.startTime || !scheduleFormData.endTime}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Add Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditScheduleDialog} onOpenChange={setShowEditScheduleDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Schedule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedScheduleForEdit && (
                <div className="space-y-2">
                  <Label>Driver</Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-yellow-400">
                          {selectedScheduleForEdit.driver?.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-yellow-300">
                          {selectedScheduleForEdit.driver?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-date">Work Date *</Label>
                <Input
                  id="edit-schedule-date"
                  type="date"
                  value={scheduleFormData.workDate}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, workDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-start">Start Time *</Label>
                <Input
                  id="edit-schedule-start"
                  type="time"
                  value={scheduleFormData.startTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-end">End Time *</Label>
                <Input
                  id="edit-schedule-end"
                  type="time"
                  value={scheduleFormData.endTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, endTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-vehicle">Vehicle</Label>
                {loadingVehicles ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    Loading Vehicles...
                  </div>
                ) : (
                  <Select
                    value={scheduleFormData.vehicleId}
                    onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, vehicleId: value })}
                    disabled={availableVehicles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        availableVehicles.length === 0
                          ? "Driver Has No Assigned Vehicles"
                          : "Select Vehicle (Optional)"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle: any) => (
                        <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                          {vehicle.plateNumber} - {vehicle.model?.brand} {vehicle.model?.modelName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {availableVehicles.length === 0 && !loadingVehicles && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    This Driver Has No Assigned Vehicles. Please Contact Manager.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-status">Status</Label>
                <Select
                  value={scheduleFormData.status}
                  onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, status: value as ShiftStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={shiftStatus.planned}>{getShiftStatusLabel(shiftStatus.planned)}</SelectItem>
                    <SelectItem value={shiftStatus.on}>{getShiftStatusLabel(shiftStatus.on)}</SelectItem>
                    <SelectItem value={shiftStatus.off}>{getShiftStatusLabel(shiftStatus.off)}</SelectItem>
                    <SelectItem value={shiftStatus.cancelled}>{getShiftStatusLabel(shiftStatus.cancelled)}</SelectItem>
                    <SelectItem value={shiftStatus.completed}>{getShiftStatusLabel(shiftStatus.completed)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-note">Note</Label>
                <Input
                  id="edit-schedule-note"
                  value={scheduleFormData.note}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, note: e.target.value })}
                  placeholder="Enter Note (Optional)"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditScheduleDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSchedule}
                  disabled={!scheduleFormData.driverAccountId || !scheduleFormData.startTime || !scheduleFormData.endTime}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyStaffOnly >
  )
}