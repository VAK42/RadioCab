const apiBaseUrl = 'http://localhost:5134/api/v1';
const apiOrigin = apiBaseUrl.replace(/\/api\/v\d+$/, '');
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  account: {
    accountId: number;
    companyId?: number;
    username: string;
    fullName: string;
    phone?: string;
    email?: string;
    role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER';
    status: 'ACTIVE' | 'INACTIVE' | 'NEW' | 'REFUSED' | 'APPROVE';
    createdAt: string;
    updatedAt?: string;
    emailVerifiedAt?: string;
    company?: {
      companyId: number;
      name: string;
      hotline: string;
      email: string;
      address: string;
      taxCode: string;
      status: 'ACTIVE' | 'INACTIVE' | 'NEW' | 'REFUSED' | 'APPROVE';
    };
  };
}
class ApiService {
  private baseUrl: string;
  private accessToken: string | null = null;
  constructor(baseUrl: string = apiBaseUrl) {
    this.baseUrl = baseUrl;
    this.loadTokenFromStorage();
  }
  getFileUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const trimmed = path.replace(/^\/+/, '');
    return `${apiOrigin}/${trimmed}`;
  }
  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('userSession');
      if (session) {
        try {
          const userSession = JSON.parse(session);
          this.accessToken = userSession.accessToken;
        } catch (error) {
        }
      }
    }
  }
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Http Error! Status: ${response.status}`);
    }
    if (response.status === 204) {
      return null as T;
    }
    const text = await response.text();
    if (!text) {
      return null as T;
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      return text as T;
    }
  }
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });
      const result = await this.handleResponse<LoginResponse>(response);
      this.accessToken = result.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSession', JSON.stringify({
          ...result.account,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresAt: result.expiresAt,
          loginAt: new Date().toISOString()
        }));
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
  async logout(): Promise<void> {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userSession');
    }
  }
  async testCompanyApi() {
    return await this.get<any>('/companies/test');
  }
  async getCompanies(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/companies${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getCompany(companyId: number) {
    return await this.get<any>(`/companies/${companyId}`);
  }
  async updateCompany(companyId: number, data: any) {
    return await this.put<any>(`/companies/${companyId}`, data);
  }
  async createCompany(data: { name: string; hotline: string; email: string; address: string; taxCode: string; fax?: string; urlPage?: string; contactAccountId?: number }) {
    return await this.post<any>('/companies', data);
  }
  async getMembershipOrders(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/companies/${params?.companyId}/membership-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createMembershipOrder(companyId: number, data: { payerAccountId: number; membershipId?: number | null; unitPrice: number; unitMonths: number; amount: number; paymentMethod?: string; paymentCode?: string; note?: string }) {
    return await this.post<any>(`/companies/${companyId}/membership-orders`, {
      payerAccountId: data.payerAccountId,
      membershipId: data.membershipId ?? null,
      unitPrice: data.unitPrice,
      unitMonths: data.unitMonths,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentCode: data.paymentCode,
      note: data.note
    });
  }
  async getMemberships(params?: { companyId?: number; isActive?: boolean; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    const endpoint = `/memberships${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createMembership(data: { companyId: number; name: string; code: string; unitPrice: number; description?: string; isActive?: boolean }) {
    return await this.post<any>('/memberships', data);
  }
  async updateMembership(membershipId: number, data: { name?: string; code?: string; unitPrice?: number; description?: string; isActive?: boolean }) {
    return await this.put<any>(`/memberships/${membershipId}`, data);
  }
  async deleteMembership(membershipId: number) {
    return await this.delete<any>(`/memberships/${membershipId}`);
  }
  async activateMembership(membershipId: number) {
    return await this.post<any>(`/memberships/${membershipId}/activate`);
  }
  async deactivateMembership(membershipId: number) {
    return await this.post<any>(`/memberships/${membershipId}/deactivate`);
  }
  async getDrivingOrders(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    const endpoint = `/drivingorders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async cancelDrivingOrder(orderId: number, reason: string) {
    return await this.post<any>(`/drivingorders/${orderId}/cancel`, { reason });
  }
  async getAccounts(params?: { companyId?: number; role?: string; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    if (params?.role) queryParams.append('role', params.role);
    const endpoint = `/accounts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async updateAccount(accountId: number, data: { role?: string; status?: string }) {
    return await this.put<any>(`/accounts/${accountId}`, data);
  }
  async createAccount(data: { fullName: string; username: string; email: string; phone?: string | null; password: string; role: string; companyId?: number }) {
    return await this.post<any>(`/accounts`, data);
  }
  async getDriverSchedules(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    const endpoint = `/vehicles/schedules${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getDriverScheduleTemplates(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    const endpoint = `/vehicles/schedule-templates${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async refreshToken(): Promise<LoginResponse> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot Refresh Token On Server Side');
    }
    const session = localStorage.getItem('userSession');
    if (!session) {
      throw new Error('No Session Found');
    }
    try {
      const userSession = JSON.parse(session);
      const response = await fetch(`${this.baseUrl}/accounts/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken: userSession.refreshToken }),
      });
      const result = await this.handleResponse<LoginResponse>(response);
      this.accessToken = result.accessToken;
      localStorage.setItem('userSession', JSON.stringify({
        ...result.account,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
        loginAt: new Date().toISOString()
      }));
      try {
        const expiresMs = new Date(result.expiresAt).getTime() - Date.now();
        const maxAge = Math.max(60, Math.floor(expiresMs / 1000));
        document.cookie = `authToken=${result.accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
        document.cookie = `userRole=${result.account.role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
      } catch { }
      return result;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<T>(response);
    return result;
  }
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return await this.handleResponse<T>(response);
  }
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return await this.handleResponse<T>(response);
  }
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return await this.handleResponse<T>(response);
  }
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('userSession');
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch (error) {
      return null;
    }
  }
  async getZones(params?: { companyId?: number; provinceId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    if (params?.provinceId) queryParams.append('provinceId', params.provinceId.toString());
    const endpoint = `/vehicles/zones${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createZone(data: any) {
    return await this.post<any>('/vehicles/zones', data);
  }
  async updateZone(zoneId: number, data: any) {
    return await this.put<any>(`/vehicles/zones/${zoneId}`, data);
  }
  async deleteZone(zoneId: number) {
    return await this.delete<any>(`/vehicles/zones/${zoneId}`);
  }
  async getZoneWards(params?: { zoneId?: number; wardId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.zoneId) queryParams.append('zoneId', params.zoneId.toString());
    if (params?.wardId) queryParams.append('wardId', params.wardId.toString());
    const endpoint = `/zone-wards${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async addWardToZone(zoneId: number, wardId: number) {
    return await this.post<any>(`/vehicles/zones/${zoneId}/wards/${wardId}`);
  }
  async removeWardFromZone(zoneId: number, wardId: number) {
    return await this.delete<any>(`/vehicles/zones/${zoneId}/wards/${wardId}`);
  }
  async getProvinces(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/vehicles/provinces${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getWards(params?: { page?: number; pageSize?: number; provinceId?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.provinceId) queryParams.append('provinceId', params.provinceId.toString());
    const endpoint = `/vehicles/wards${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getVehicleSegments(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    const endpoint = `/vehicles/vehicle-segments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createVehicleSegment(segmentData: any) {
    return await this.post<any>('/vehicles/vehicle-segments', segmentData);
  }
  async updateVehicleSegment(segmentData: any) {
    return await this.put<any>(`/vehicles/vehicle-segments/${segmentData.segmentId}`, segmentData);
  }
  async deleteVehicleSegment(segmentId: number) {
    return await this.delete<any>(`/vehicles/vehicle-segments/${segmentId}`);
  }
  async getVehicleModels(params?: { companyId?: number; page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    const endpoint = `/vehicles/vehicle-models${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createVehicleModel(modelData: any) {
    return await this.post<any>('/vehicles/vehicle-models', modelData);
  }
  async updateVehicleModel(modelData: any, payload?: { companyId: number; brand: string; modelName: string; segmentId: number | null; fuelType: string; seatCategory: string; imageUrl: string | null; description: string | null; }) {
    return await this.put<any>(`/vehicles/vehicle-models/${modelData.modelId}`, modelData);
  }
  async deleteVehicleModel(modelId: number) {
    return await this.delete<any>(`/vehicles/vehicle-models/${modelId}`);
  }
  async uploadVehicleModelImage(modelId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${apiBaseUrl}/vehicles/vehicle-models/${modelId}/image`, {
      method: 'POST',
      headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : undefined,
      body: formData,
    });
    return await this.handleResponse<any>(response);
  }
  async getModelPriceProvinces(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/vehicles/model-price-provinces${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createModelPriceProvince(modelPriceProvinceData: any) {
    return await this.post<any>('/vehicles/model-price-provinces', modelPriceProvinceData);
  }
  async updateModelPriceProvince(modelPriceProvinceData: any) {
    return await this.put<any>(`/vehicles/model-price-provinces/${modelPriceProvinceData.modelPriceId}`, modelPriceProvinceData);
  }
  async deleteModelPriceProvince(modelPriceId: number) {
    return await this.delete<any>(`/vehicles/model-price-provinces/${modelPriceId}`);
  }
  async getVehicles(params?: { companyId?: number; page?: number; pageSize?: number; provinceId?: number; zoneId?: number; wardId?: number; driverId?: number; weekday?: number; workDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
    if (params?.provinceId) queryParams.append('provinceId', params.provinceId.toString());
    if (params?.zoneId) queryParams.append('zoneId', params.zoneId.toString());
    if (params?.wardId) queryParams.append('wardId', params.wardId.toString());
    if (params?.driverId) queryParams.append('driverId', params.driverId.toString());
    if (params?.weekday !== undefined) queryParams.append('weekday', params.weekday.toString());
    if (params?.workDate) queryParams.append('workDate', params.workDate);
    const endpoint = `/vehicles${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getVehicleById(vehicleId: number) {
    return await this.get<any>(`/vehicles/${vehicleId}`);
  }
  async createVehicle(vehicleData: any) {
    return await this.post<any>('/vehicles', vehicleData);
  }
  async updateVehicle(vehicleData: any, payload?: { companyId: number; modelId: number; plateNumber: string; vin: string | null; color: string | null; yearManufactured: number; inServiceFrom: string; odometerKm: number; status: string; }) {
    return await this.put<any>(`/vehicles/${vehicleData.vehicleId}`, vehicleData);
  }
  async deleteVehicle(vehicleId: number) {
    return await this.delete<any>(`/vehicles/${vehicleId}`);
  }
  async getDriverVehicleAssignments(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/vehicles/driver-vehicle-assignments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async createDriverVehicleAssignment(assignmentData: any) {
    return await this.post<any>('/vehicles/driver-vehicle-assignments', assignmentData);
  }
  async updateDriverVehicleAssignment(assignmentId: number, assignmentData: any) {
    return await this.put<any>(`/vehicles/driver-vehicle-assignments/${assignmentId}`, assignmentData);
  }
  async deleteDriverVehicleAssignment(assignmentId: number) {
    return await this.delete<any>(`/vehicles/driver-vehicle-assignments/${assignmentId}`);
  }
  async getVehicleInProvinces(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/vehicles/vehicle-in-provinces${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async getVehicleZonePreferences(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    const endpoint = `/vehicles/vehicle-zone-preferences${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.get<any>(endpoint);
  }
  async addVehicleToZone(vehicleId: number, zoneId: number, priority: number = 100) {
    return await this.post<any>(`/vehicles/vehicles/${vehicleId}/zones/${zoneId}?priority=${priority}`);
  }
  async removeVehicleFromZone(vehicleId: number, zoneId: number) {
    return await this.delete<any>(`/vehicles/vehicles/${vehicleId}/zones/${zoneId}`);
  }
  async createDriverScheduleTemplate(data: { driverAccountId: number; weekday: number; startTime: string; endTime: string; startDate?: string | null; endDate?: string | null; vehicleId?: number | null; note?: string | null }) {
    return await this.post<any>(`/vehicles/schedule-templates`, data);
  }
  async updateDriverScheduleTemplate(templateId: number, data: { driverAccountId: number; weekday: number; startTime: string; endTime: string; startDate?: string | null; endDate?: string | null; vehicleId?: number | null; note?: string | null }) {
    return await this.put<any>(`/vehicles/schedule-templates/${templateId}`, data);
  }
  async deleteDriverScheduleTemplate(templateId: number) {
    return await this.delete<any>(`/vehicles/schedule-templates/${templateId}`);
  }
  async createDriverSchedule(data: { driverAccountId: number; workDate: string; startTime: string; endTime: string; vehicleId?: number | null; status?: string; note?: string | null }) {
    return await this.post<any>('/vehicles/schedules', data);
  }
  async updateDriverSchedule(scheduleId: number, data: { driverAccountId: number; workDate: string; startTime: string; endTime: string; vehicleId?: number | null; status?: string; note?: string | null }) {
    return await this.put<any>(`/vehicles/schedules/${scheduleId}`, data);
  }
  async deleteDriverSchedule(scheduleId: number) {
    return await this.delete<any>(`/vehicles/schedules/${scheduleId}`);
  }
  async getAdminStats() {
    return await this.get<any>('/admin/stats');
  }
  async getRecentCompanies(limit: number = 5) {
    return await this.get<any>(`/companies?page=1&pageSize=${limit}`);
  }
  async getRecentDrivers(limit: number = 5) {
    return await this.get<any>(`/accounts?role=DRIVER&page=1&pageSize=${limit}`);
  }
  async getRecentOrders(limit: number = 5) {
    return await this.get<any>(`/drivingorders?page=1&pageSize=${limit}`);
  }
  async getSystemHealth() {
    return await this.get<any>('/health');
  }
  async getPendingApprovals() {
    const companies = await this.get<any>('/companies?page=1&pageSize=100');
    const pendingCompanies = companies.data?.filter((company: any) => company.status === 'APPROVE') || [];
    const drivers = await this.get<any>('/accounts?role=DRIVER&page=1&pageSize=100');
    const pendingDrivers = drivers.data?.filter((driver: any) => driver.status === 'APPROVE') || [];
    return {
      companies: pendingCompanies.length,
      drivers: pendingDrivers.length,
      reviews: 0
    };
  }
}
export const apiService = new ApiService();
export default apiService;