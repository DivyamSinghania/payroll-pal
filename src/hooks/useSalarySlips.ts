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

export function useSalarySlips() {
  const { user, role } = useAuth();

  return useQuery({
    queryKey: ['salary-slips', user?.id, role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_slips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SalarySlip[];
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
    },
  });
}
