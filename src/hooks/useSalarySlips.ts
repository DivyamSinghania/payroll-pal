import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SalarySlip {
  id: string;
  employee_id: string;
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

export interface SalarySlipWithEmployee extends SalarySlip {
  employee_name?: string;
  department?: string;
}

export interface SalarySlipFilters {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  employeeId?: string;
  sortBy?: 'created_at' | 'month' | 'year' | 'net_salary' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function useSalarySlips(filters: SalarySlipFilters = {}) {
  const { user, role } = useAuth();
  const { search, status, month, year, employeeId, sortBy = 'created_at', sortOrder = 'desc', page = 1, pageSize = 10 } = filters;

  return useQuery({
    queryKey: ['salary-slips', filters, user?.id, role],
    queryFn: async () => {
      let query = supabase
        .from('salary_slips')
        .select('*');

      // For employees, only show their own slips
      if (role === 'employee' && user) {
        query = query.eq('employee_id', user.id);
      }

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (month && month !== 'all') {
        query = query.eq('month', month);
      }

      if (year) {
        query = query.eq('year', year);
      }

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query.order(sortBy, { ascending: sortOrder === 'asc' });

      if (error) throw error;

      let slips = (data || []) as SalarySlip[];

      // For admin, enrich with employee data
      if (role === 'admin' && slips.length > 0) {
        const employeeIds = [...new Set(slips.map(s => s.employee_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, department')
          .in('user_id', employeeIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

        slips = slips.map(slip => ({
          ...slip,
          employee_name: profileMap.get(slip.employee_id)?.full_name || 'Unknown',
          department: profileMap.get(slip.employee_id)?.department || 'N/A',
        })) as SalarySlipWithEmployee[];
      }

      // Client-side search
      if (search && role === 'admin') {
        const searchLower = search.toLowerCase();
        slips = (slips as SalarySlipWithEmployee[]).filter(s =>
          s.employee_name?.toLowerCase().includes(searchLower) ||
          s.department?.toLowerCase().includes(searchLower) ||
          s.month.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const total = slips.length;
      const start = (page - 1) * pageSize;
      const paginatedSlips = slips.slice(start, start + pageSize);

      return {
        slips: paginatedSlips,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },
    enabled: !!user,
  });
}

export function useCreateSalarySlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slip: Omit<SalarySlip, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('salary_slips')
        .insert(slip)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-slips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-payroll-trend'] });
    },
  });
}

export function useUpdateSalarySlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SalarySlip> & { id: string }) => {
      const { data, error } = await supabase
        .from('salary_slips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-slips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-payroll-trend'] });
    },
  });
}

export function useDeleteSalarySlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('salary_slips')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-slips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-payroll-trend'] });
    },
  });
}
