import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Employee {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  designation: string | null;
  salary: number;
  join_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface CreateEmployeeInput {
  email: string;
  full_name: string;
  department: string;
  designation: string;
  salary: number;
  status: string;
}


export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: 'full_name' | 'department' | 'salary' | 'join_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function useEmployees(filters: EmployeeFilters = {}) {
  const { user, role } = useAuth();
  const { search, department, status, sortBy = 'created_at', sortOrder = 'desc', page = 1, pageSize = 10 } = filters;

  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      // Use the RPC function that filters only employees
      const { data, error } = await supabase.rpc('get_employees');
      
      if (error) throw error;
      
      let employees = (data || []) as Employee[];

      // Apply client-side filtering
      if (search) {
        const searchLower = search.toLowerCase();
        employees = employees.filter(e => 
          e.full_name?.toLowerCase().includes(searchLower) ||
          e.email.toLowerCase().includes(searchLower) ||
          e.department?.toLowerCase().includes(searchLower)
        );
      }

      if (department && department !== 'all') {
        employees = employees.filter(e => e.department === department);
      }

      if (status && status !== 'all') {
        employees = employees.filter(e => e.status === status);
      }

      // Sort
      employees.sort((a, b) => {
        let aVal = a[sortBy] || '';
        let bVal = b[sortBy] || '';
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      });

      // Pagination
      const total = employees.length;
      const start = (page - 1) * pageSize;
      const paginatedEmployees = employees.slice(start, start + pageSize);

      return {
        employees: paginatedEmployees,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },
    enabled: !!user && role === 'admin',
  });
}


export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, ...updates }: Partial<Employee> & { userId: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          department: updates.department,
          designation: updates.designation,
          salary: updates.salary,
          status: updates.status,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Delete from profiles (cascade will handle user_roles due to FK)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
