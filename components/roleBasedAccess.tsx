"use client";
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, isAuthenticated } from '../lib/auth';
import { User } from '../lib/auth';
interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: Array<'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'>;
  fallbackPath?: string;
  requireAuth?: boolean;
}
export default function RoleBasedAccess({ children, allowedRoles, fallbackPath = '/login', requireAuth = true }: RoleBasedAccessProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  useEffect(() => {
    const checkAccess = () => {
      if (!requireAuth) {
        setIsLoading(false);
        return;
      }
      if (!isAuthenticated()) {
        router.push(fallbackPath);
        return;
      }
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push(fallbackPath);
        return;
      }
      setUser(currentUser);
      if (!allowedRoles.includes(currentUser.role)) {
        switch (currentUser.role) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'MANAGER':
          case 'ACCOUNTANT':
          case 'DISPATCHER':
            router.push('/company');
            break;
          case 'DRIVER':
            router.push('/user/dashboard/driver/profile');
            break;
          case 'CUSTOMER':
            router.push('/booking');
            break;
          default:
            router.push('/user/dashboard');
        }
        return;
      }
      setIsLoading(false);
    };
    checkAccess();
  }, [router, allowedRoles, fallbackPath, requireAuth]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  if (!requireAuth || (user && allowedRoles.includes(user.role))) {
    return <>{children}</>;
  }
  return null;
}
export function AdminOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['ADMIN']}>
      {children}
    </RoleBasedAccess>
  );
}
export function ManagerOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['MANAGER']}>
      {children}
    </RoleBasedAccess>
  );
}
export function DriverOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['DRIVER']}>
      {children}
    </RoleBasedAccess>
  );
}
export function CustomerOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['CUSTOMER']}>
      {children}
    </RoleBasedAccess>
  );
}
export function CompanyStaffOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['MANAGER', 'ACCOUNTANT', 'DISPATCHER']}>
      {children}
    </RoleBasedAccess>
  );
}
export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['ADMIN', 'MANAGER', 'ACCOUNTANT', 'DISPATCHER', 'DRIVER', 'CUSTOMER']}>
      {children}
    </RoleBasedAccess>
  )
}