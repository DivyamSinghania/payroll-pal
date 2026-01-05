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
  employee_id: string;
  employeeName?: string;
  department?: string;
  month: string;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  employee_id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  created_at: string;
  updated_at: string;
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
