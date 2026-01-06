import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalEmployees: number;
  totalPayroll: number;
  pendingExpenses: number;
  approvedSlips: number;
}

export function useAdminDashboardStats() {
  const { user, role } = useAuth();

  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [employeeCount, totalPayroll, pendingExpenses, approvedSlips] = await Promise.all([
        supabase.rpc('get_employee_count'),
        supabase.rpc('get_total_payroll'),
        supabase.rpc('get_pending_expenses_count'),
        supabase.rpc('get_approved_slips_count'),
      ]);

      return {
        totalEmployees: Number(employeeCount.data) || 0,
        totalPayroll: Number(totalPayroll.data) || 0,
        pendingExpenses: Number(pendingExpenses.data) || 0,
        approvedSlips: Number(approvedSlips.data) || 0,
      };
    },
    enabled: !!user && role === 'admin',
    staleTime: 30000,
  });
}

export function useEmployeeDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['employee-dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [salarySlipsResult, expensesResult] = await Promise.all([
        supabase
          .from('salary_slips')
          .select('*')
          .eq('employee_id', user.id)
          .order('year', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('expenses')
          .select('*')
          .eq('employee_id', user.id),
      ]);

      const latestSalary = salarySlipsResult.data?.[0];
      const expenses = expensesResult.data || [];

      const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
      const approvedExpenses = expenses.filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        currentSalary: latestSalary?.net_salary || 0,
        pendingExpenses,
        approvedExpenses,
        totalExpenses: expenses.length,
      };
    },
    enabled: !!user,
  });
}

export function useMonthlyPayrollTrend() {
  const { user, role } = useAuth();

  return useQuery({
    queryKey: ['monthly-payroll-trend'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_payroll_trend');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && role === 'admin',
  });
}

export function useMonthlyExpenseTrend() {
  const { user, role } = useAuth();

  return useQuery({
    queryKey: ['monthly-expense-trend'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_expense_trend');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && role === 'admin',
  });
}

export function useEmployeeSalaryHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['employee-salary-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.rpc('get_employee_salary_history', {
        _employee_id: user.id,
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}
