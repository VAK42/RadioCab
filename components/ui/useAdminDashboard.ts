import { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
export interface AdminStats {
  totalCompanies: number;
  totalDrivers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
}
export interface RecentCompany {
  id: number;
  name: string;
  contact: string;
  email: string;
  status: string;
  joinDate: string;
  membershipType?: string;
}
export interface RecentDriver {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  status: string;
  rating?: number;
  totalRides?: number;
}
export interface RecentOrder {
  id: number;
  companyId: number;
  customerAccountId?: number;
  driverAccountId?: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  pickupAddress?: string;
  dropoffAddress?: string;
}
export interface SystemHealth {
  databaseStatus: 'healthy' | 'warning' | 'error';
  apiResponseTime: number;
  activeUsers: number;
  serverLoad: number;
}
export interface PendingApprovals {
  companies: number;
  drivers: number;
  reviews: number;
}
export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);
  const [recentDrivers, setRecentDrivers] = useState<RecentDriver[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        await apiService.testCompanyApi();
      } catch (testError) {
      }
      let companiesResponse;
      try {
        companiesResponse = await apiService.getCompanies({ pageSize: 5 });
      } catch (error) {
        companiesResponse = null;
      }
      let driversResponse;
      try {
        driversResponse = await apiService.getAccounts({ role: 'DRIVER', pageSize: 5 });
      } catch (error) {
        driversResponse = null;
      }
      let ordersResponse;
      try {
        ordersResponse = await apiService.getDrivingOrders({ pageSize: 5 });
      } catch (error) {
        ordersResponse = null;
      }
      const totalCompanies = companiesResponse?.totalCount || companiesResponse?.items?.length || 0;
      const totalDrivers = driversResponse?.totalCount || driversResponse?.items?.length || 0;
      const totalOrders = ordersResponse?.totalCount || ordersResponse?.items?.length || 0;
      const totalRevenue = ordersResponse?.items?.reduce((sum: number, order: any) => {
        return sum + (order.totalAmount || 0);
      }, 0) || 0;
      const statsData = {
        totalCompanies,
        totalDrivers,
        totalOrders,
        totalRevenue,
        activeSubscriptions: totalCompanies,
        pendingApprovals: 0
      };
      setStats(statsData);
      const transformedCompanies: RecentCompany[] = companiesResponse?.items?.map((company: any) => ({
        id: company.companyId,
        name: company.name,
        contact: company.hotline,
        email: company.email,
        status: company.status === 'ACTIVE' ? 'Active' : 'Pending',
        joinDate: new Date(company.createdAt).toLocaleDateString('vi-VN'),
        membershipType: 'Basic'
      })) || [];
      setRecentCompanies(transformedCompanies);
      const transformedDrivers: RecentDriver[] = driversResponse?.items?.map((driver: any) => ({
        id: driver.accountId,
        name: driver.fullName,
        email: driver.email || '',
        phone: driver.phone,
        city: 'TP. Hồ Chí Minh',
        status: driver.status === 'ACTIVE' ? 'Active' : 'Pending',
        rating: 4.5,
        totalRides: 0
      })) || [];
      setRecentDrivers(transformedDrivers);
      const transformedOrders: RecentOrder[] = ordersResponse?.items?.map((order: any) => ({
        id: order.orderId,
        companyId: order.companyId,
        customerAccountId: order.customerAccountId,
        driverAccountId: order.driverAccountId,
        status: order.status.toLowerCase(),
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt,
        pickupAddress: order.pickupAddress,
        dropoffAddress: order.dropoffAddress
      })) || [];
      setRecentOrders(transformedOrders);
      setSystemHealth({
        databaseStatus: 'healthy',
        apiResponseTime: 120,
        activeUsers: totalDrivers + totalCompanies,
        serverLoad: 45
      });
      setPendingApprovals({
        companies: 0,
        drivers: 0,
        reviews: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed To Fetch Data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdminData();
  }, []);
  return {
    stats,
    recentCompanies,
    recentDrivers,
    recentOrders,
    systemHealth,
    pendingApprovals,
    loading,
    error,
    refetch: fetchAdminData
  }
}