export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  TRAINER = 'trainer'
}

export enum MemberStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

export enum PaymentType {
  SUBSCRIPTION = 'Subscription',
  RENEWAL = 'Renewal',
  FEE = 'Fee',
  MERCHANDISE = 'Merchandise'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  endDate?: string;
  createdBy: string;
  status: MemberStatus;
  email?: string;
  lastPaymentAmount?: number;
  lastPaymentType?: PaymentType;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  amount: number;
  type: PaymentType;
  status: 'completed' | 'pending' | 'failed';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}