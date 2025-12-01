export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER';
  password: string;
  phone?: string;
  companyId?: number;
  companyName?: string;
  driverLicense?: string;
  createdAt: string;
}
export const demoAccounts: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@radiocabs.in',
    fullName: 'Quản Trị Viên',
    role: 'ADMIN',
    password: 'Admin@123',
    phone: '0901234567',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin-002',
    username: 'superadmin',
    email: 'superadmin@radiocabs.in',
    fullName: 'Super Admin',
    role: 'ADMIN',
    password: 'SuperAdmin@2024',
    phone: '0901234568',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-001',
    username: 'vinasun',
    email: 'info@vinasun.vn',
    fullName: 'Nguyễn Văn A',
    role: 'MANAGER',
    password: 'Vinasun@123',
    phone: '0902345678',
    companyId: 1,
    companyName: 'Vinasun Taxi',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'company-002',
    username: 'mailinh',
    email: 'contact@mailinh.vn',
    fullName: 'Trần Thị B',
    role: 'MANAGER',
    password: 'MaiLinh@123',
    phone: '0903456789',
    companyId: 2,
    companyName: 'Mai Linh Taxi',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'company-003',
    username: 'saigontaxi',
    email: 'info@saigontaxi.vn',
    fullName: 'Lê Văn C',
    role: 'MANAGER',
    password: 'SaigonTaxi@123',
    phone: '0904567890',
    companyId: 3,
    companyName: 'Saigon Taxi',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'company-004',
    username: 'vinataxigroup',
    email: 'contact@vinataxigroup.vn',
    fullName: 'Phạm Thị D',
    role: 'MANAGER',
    password: 'VinaTaxi@123',
    phone: '0905678901',
    companyId: 4,
    companyName: 'Vina Taxi Group',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'company-005',
    username: 'greentaxi',
    email: 'hello@greentaxi.vn',
    fullName: 'Hoàng Văn E',
    role: 'MANAGER',
    password: 'GreenTaxi@123',
    phone: '0906789012',
    companyId: 5,
    companyName: 'Green Taxi',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'driver-001',
    username: 'driver001',
    email: 'driver001@radiocabs.in',
    fullName: 'Nguyễn Minh F',
    role: 'DRIVER',
    password: 'Driver001@123',
    phone: '0907890123',
    companyId: 1,
    companyName: 'Vinasun Taxi',
    driverLicense: 'B2-123456789',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: 'driver-002',
    username: 'driver002',
    email: 'driver002@radiocabs.in',
    fullName: 'Trần Văn G',
    role: 'DRIVER',
    password: 'Driver002@123',
    phone: '0908901234',
    companyId: 2,
    companyName: 'Mai Linh Taxi',
    driverLicense: 'B2-987654321',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'driver-003',
    username: 'driver003',
    email: 'driver003@radiocabs.in',
    fullName: 'Lê Thị H',
    role: 'DRIVER',
    password: 'Driver003@123',
    phone: '0909012345',
    companyId: 3,
    companyName: 'Saigon Taxi',
    driverLicense: 'B2-555666777',
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'driver-004',
    username: 'driver004',
    email: 'driver004@radiocabs.in',
    fullName: 'Phạm Văn I',
    role: 'DRIVER',
    password: 'Driver004@123',
    phone: '0910123456',
    companyId: 4,
    companyName: 'Vina Taxi Group',
    driverLicense: 'B2-111222333',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'driver-005',
    username: 'driver005',
    email: 'driver005@radiocabs.in',
    fullName: 'Võ Thị K',
    role: 'DRIVER',
    password: 'Driver005@123',
    phone: '0911234567',
    companyId: 5,
    companyName: 'Green Taxi',
    driverLicense: 'B2-444555666',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'driver-006',
    username: 'driver006',
    email: 'driver006@radiocabs.in',
    fullName: 'Đặng Văn L',
    role: 'DRIVER',
    password: 'Driver006@123',
    phone: '0912345678',
    companyId: 1,
    companyName: 'Vinasun Taxi',
    driverLicense: 'B2-777888999',
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    id: 'driver-007',
    username: 'driver007',
    email: 'driver007@radiocabs.in',
    fullName: 'Bùi Thị M',
    role: 'DRIVER',
    password: 'Driver007@123',
    phone: '0913456789',
    companyId: 2,
    companyName: 'Mai Linh Taxi',
    driverLicense: 'B2-123789456',
    createdAt: '2024-02-25T00:00:00Z'
  },
  {
    id: 'accountant-001',
    username: 'accountant001',
    email: 'accountant001@radiocabs.in',
    fullName: 'Nguyễn Thị N',
    role: 'ACCOUNTANT',
    password: 'Accountant001@123',
    phone: '0914567890',
    companyId: 1,
    companyName: 'Vinasun Taxi',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'accountant-002',
    username: 'accountant002',
    email: 'accountant002@radiocabs.in',
    fullName: 'Trần Văn O',
    role: 'ACCOUNTANT',
    password: 'Accountant002@123',
    phone: '0915678901',
    companyId: 2,
    companyName: 'Mai Linh Taxi',
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    id: 'dispatcher-001',
    username: 'dispatcher001',
    email: 'dispatcher001@radiocabs.in',
    fullName: 'Lê Thị P',
    role: 'DISPATCHER',
    password: 'Dispatcher001@123',
    phone: '0916789012',
    companyId: 1,
    companyName: 'Vinasun Taxi',
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    id: 'dispatcher-002',
    username: 'dispatcher002',
    email: 'dispatcher002@radiocabs.in',
    fullName: 'Phạm Văn Q',
    role: 'DISPATCHER',
    password: 'Dispatcher002@123',
    phone: '0917890123',
    companyId: 2,
    companyName: 'Mai Linh Taxi',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'customer-001',
    username: 'customer001',
    email: 'customer001@radiocabs.in',
    fullName: 'Nguyễn Văn R',
    role: 'CUSTOMER',
    password: 'Customer001@123',
    phone: '0918901234',
    createdAt: '2024-03-20T00:00:00Z'
  },
  {
    id: 'customer-002',
    username: 'customer002',
    email: 'customer002@radiocabs.in',
    fullName: 'Trần Thị S',
    role: 'CUSTOMER',
    password: 'Customer002@123',
    phone: '0919012345',
    createdAt: '2024-03-25T00:00:00Z'
  }
];
export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    const apiService = (await import('./api')).apiService;
    const response = await apiService.login({ username, password });
    const resolvedCompanyId = (response.account as any).companyId ?? (response.account as any).company?.companyId ?? (response.account as any).company?.id;
    const user: User = {
      id: response.account.accountId.toString(),
      username: response.account.username,
      email: response.account.email || '',
      fullName: response.account.fullName,
      role: response.account.role,
      password: '',
      phone: response.account.phone,
      companyId: resolvedCompanyId,
      companyName: response.account.company?.name,
      createdAt: response.account.createdAt
    };
    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      companyId: user.companyId,
      companyName: user.companyName,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: response.expiresAt,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem('userSession', JSON.stringify(session));
    try {
      const expiresMs = new Date(response.expiresAt).getTime() - Date.now();
      const maxAge = Math.max(60, Math.floor(expiresMs / 1000));
      document.cookie = `authToken=${response.accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
      document.cookie = `userRole=${response.account.role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    } catch { }
    return user;
  } catch (error) {
    return null;
  }
};
export const logout = async (): Promise<void> => {
  try {
    const apiService = (await import('./api')).apiService;
    await apiService.logout();
  } catch (error) {
  } finally {
    localStorage.removeItem('userSession');
    try {
      document.cookie = 'authToken=; Path=/; Max-Age=0; SameSite=Lax';
      document.cookie = 'userRole=; Path=/; Max-Age=0; SameSite=Lax';
    } catch { }
  }
};
export const getCurrentUser = (): Omit<User, 'password'> | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('userSession');
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
export const hasRole = (role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};
export const isAdmin = (): boolean => hasRole('ADMIN');
export const isManager = (): boolean => hasRole('MANAGER');
export const isDriver = (): boolean => hasRole('DRIVER');
export const isAccountant = (): boolean => hasRole('ACCOUNTANT');
export const isDispatcher = (): boolean => hasRole('DISPATCHER');
export const isCustomer = (): boolean => hasRole('CUSTOMER');
export const isCompany = (): boolean => hasRole('MANAGER');
export const isCoordinator = (): boolean => hasRole('DISPATCHER');