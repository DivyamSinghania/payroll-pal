-- Add designation and salary fields to profiles for employee data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS salary numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS join_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create index for employee filtering
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Create a view for employees (profiles with employee role)
CREATE OR REPLACE VIEW public.employees_view AS
SELECT 
    p.id,
    p.user_id,
    p.email,
    p.full_name,
    p.department,
    p.designation,
    p.salary,
    p.join_date,
    p.status,
    p.created_at,
    p.updated_at
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'employee';

-- Function to get employee count (only employees, not admins)
CREATE OR REPLACE FUNCTION public.get_employee_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)
    FROM public.profiles p
    INNER JOIN public.user_roles ur ON p.user_id = ur.user_id
    WHERE ur.role = 'employee'
$$;

-- Function to get total payroll (sum of net_salary from paid salary slips)
CREATE OR REPLACE FUNCTION public.get_total_payroll()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(SUM(net_salary), 0)
    FROM public.salary_slips
    WHERE status = 'paid'
$$;

-- Function to get pending expenses count
CREATE OR REPLACE FUNCTION public.get_pending_expenses_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)
    FROM public.expenses
    WHERE status = 'pending'
$$;

-- Function to get approved salary slips count
CREATE OR REPLACE FUNCTION public.get_approved_slips_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)
    FROM public.salary_slips
    WHERE status IN ('approved', 'paid')
$$;

-- Function to get monthly payroll trend (last 6 months)
CREATE OR REPLACE FUNCTION public.get_monthly_payroll_trend()
RETURNS TABLE(month text, year integer, total numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        ss.month,
        ss.year,
        SUM(ss.net_salary) as total
    FROM public.salary_slips ss
    WHERE ss.status IN ('approved', 'paid')
    GROUP BY ss.month, ss.year
    ORDER BY ss.year DESC, 
        CASE ss.month
            WHEN 'January' THEN 1
            WHEN 'February' THEN 2
            WHEN 'March' THEN 3
            WHEN 'April' THEN 4
            WHEN 'May' THEN 5
            WHEN 'June' THEN 6
            WHEN 'July' THEN 7
            WHEN 'August' THEN 8
            WHEN 'September' THEN 9
            WHEN 'October' THEN 10
            WHEN 'November' THEN 11
            WHEN 'December' THEN 12
        END DESC
    LIMIT 6
$$;

-- Function to get monthly expense trend
CREATE OR REPLACE FUNCTION public.get_monthly_expense_trend()
RETURNS TABLE(month text, year integer, total numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        TO_CHAR(date, 'Month') as month,
        EXTRACT(YEAR FROM date)::integer as year,
        SUM(amount) as total
    FROM public.expenses
    WHERE status = 'approved'
    GROUP BY TO_CHAR(date, 'Month'), EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
    ORDER BY EXTRACT(YEAR FROM date) DESC, EXTRACT(MONTH FROM date) DESC
    LIMIT 6
$$;

-- Function to get employee salary history
CREATE OR REPLACE FUNCTION public.get_employee_salary_history(_employee_id uuid)
RETURNS TABLE(month text, year integer, net_salary numeric, status text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        ss.month,
        ss.year,
        ss.net_salary,
        ss.status
    FROM public.salary_slips ss
    WHERE ss.employee_id = _employee_id
    ORDER BY ss.year DESC, 
        CASE ss.month
            WHEN 'January' THEN 1
            WHEN 'February' THEN 2
            WHEN 'March' THEN 3
            WHEN 'April' THEN 4
            WHEN 'May' THEN 5
            WHEN 'June' THEN 6
            WHEN 'July' THEN 7
            WHEN 'August' THEN 8
            WHEN 'September' THEN 9
            WHEN 'October' THEN 10
            WHEN 'November' THEN 11
            WHEN 'December' THEN 12
        END DESC
    LIMIT 12
$$;

-- Add RLS policy for admins to delete salary slips
CREATE POLICY "Admins can delete salary slips" ON public.salary_slips
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for employees to delete their own expenses
CREATE POLICY "Employees can delete their own expenses" ON public.expenses
FOR DELETE USING (employee_id = auth.uid());

-- Add RLS policy for admins to delete profiles (employees)
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for admins to update profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));