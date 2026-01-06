import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Expense {
  id: string;
  employee_id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithEmployee extends Expense {
  employee_name?: string;
  department?: string;
}

export interface ExpenseFilters {
  search?: string;
  status?: string;
  category?: string;
  employeeId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'created_at' | 'date' | 'amount' | 'status' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  const { user, role } = useAuth();
  const { search, status, category, employeeId, dateFrom, dateTo, sortBy = 'created_at', sortOrder = 'desc', page = 1, pageSize = 10 } = filters;

  return useQuery({
    queryKey: ['expenses', filters, user?.id, role],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*');

      // For employees, only show their own expenses
      if (role === 'employee' && user) {
        query = query.eq('employee_id', user.id);
      }

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      if (dateFrom) {
        query = query.gte('date', dateFrom);
      }

      if (dateTo) {
        query = query.lte('date', dateTo);
      }

      const { data, error } = await query.order(sortBy, { ascending: sortOrder === 'asc' });

      if (error) throw error;

      let expenses = (data || []) as Expense[];

      // For admin, enrich with employee data
      if (role === 'admin' && expenses.length > 0) {
        const employeeIds = [...new Set(expenses.map(e => e.employee_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, department')
          .in('user_id', employeeIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

        expenses = expenses.map(expense => ({
          ...expense,
          employee_name: profileMap.get(expense.employee_id)?.full_name || 'Unknown',
          department: profileMap.get(expense.employee_id)?.department || 'N/A',
        })) as ExpenseWithEmployee[];
      }

      // Client-side search
      if (search) {
        const searchLower = search.toLowerCase();
        expenses = expenses.filter(e =>
          e.title.toLowerCase().includes(searchLower) ||
          e.category.toLowerCase().includes(searchLower) ||
          e.description?.toLowerCase().includes(searchLower) ||
          (role === 'admin' && (e as ExpenseWithEmployee).employee_name?.toLowerCase().includes(searchLower))
        );
      }

      // Pagination
      const total = expenses.length;
      const start = (page - 1) * pageSize;
      const paginatedExpenses = expenses.slice(start, start + pageSize);

      return {
        expenses: paginatedExpenses,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },
    enabled: !!user,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'employee_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          employee_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee-dashboard-stats'] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-expense-trend'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee-dashboard-stats'] });
    },
  });
}

export function useApproveExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-expense-trend'] });
    },
  });
}
