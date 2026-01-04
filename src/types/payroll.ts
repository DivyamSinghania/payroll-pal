export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalEmployees: number;
  totalPayroll: number;
  pendingExpenses: number;
  approvedSlips: number;
}
