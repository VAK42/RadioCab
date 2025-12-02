export interface Company {
  companyId: number;
  companyCode: string;
  name: string;
  contactPerson: string;
  designation: string;
  addressLine: string;
  cityId: number;
  mobile: string;
  telephone: string | null;
  faxNumber: string | null;
  email: string;
  membershipTypeId: number;
  ownerUserId: number;
  status: 'active' | 'inactive' | 'suspended' | 'draft' | 'deleted' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}
export interface Driver {
  driverId: number;
  driverCode: string;
  name: string;
  contactPerson: string;
  addressLine: string;
  cityId: number;
  mobile: string;
  telephone: string | null;
  email: string;
  experienceYears: number;
  description: string | null;
  ownerUserId: number;
  status: 'active' | 'inactive' | 'suspended' | 'draft' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  phone?: string;
  avatarUrl?: string;
  licenseNumber?: string;
  licenseType?: string;
  licenseExpiry?: Date;
  vehicleType?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  rating?: number;
  totalRides?: number;
  totalDistance?: number;
  isAvailable?: boolean;
  languages?: string[];
  specialties?: string[];
}
export interface Subscription {
  subscriptionId?: number;
  userId: number;
  planId: number;
  plan: string;
  amount: string;
  currency: string;
  nextPayment: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface Payment {
  paymentId: number;
  userId: number;
  subscriptionId?: number;
  amount: number;
  currency: string;
  methodId: number;
  statusId: number;
  txnRef?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface CompanyDashboardData {
  company: Company;
  stats: {
    profileViews: number;
    totalLeads: number;
    totalReviews: number;
    averageRating: number;
  };
  subscription: {
    plan: string;
    nextPayment: string;
    amount: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired';
  };
  recentActivity: Activity[];
}
export interface DriverDashboardData {
  driver: Driver;
  stats: {
    profileViews: number;
    totalApplications: number;
    totalReviews: number;
    averageRating: number;
    totalRides: number;
  };
  subscription: {
    plan: string;
    nextPayment: string;
    amount: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired';
  };
  recentActivity: Activity[];
}
export interface Activity {
  id: number;
  type: 'lead' | 'payment' | 'review' | 'application';
  title: string;
  description: string;
  time: string;
  status: 'new' | 'success' | 'pending' | 'failed';
}
export interface City {
  cityId: number;
  name: string;
  stateId: number;
  countryId: number;
  status: 'active' | 'inactive';
  code?: string;
}
export interface State {
  stateId: number;
  name: string;
  countryId: number;
  status: 'active' | 'inactive';
}
export interface Country {
  countryId: number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
}
export interface MembershipType {
  membershipTypeId: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  status: 'active' | 'inactive';
  code?: string;
}
export interface Plan {
  planId: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationMonths: number;
  features: string[];
  status: 'active' | 'inactive';
}
export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'creditCard' | 'debitCard' | 'bankTransfer' | 'paypal' | 'cash';