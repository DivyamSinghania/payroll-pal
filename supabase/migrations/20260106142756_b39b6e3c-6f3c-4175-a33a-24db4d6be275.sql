-- Drop the security definer view and replace with a function
DROP VIEW IF EXISTS public.employees_view;

-- Create a function to get employees (only those with employee role)
CREATE OR REPLACE FUNCTION public.get_employees()
RETURNS TABLE(
    id uuid,
    user_id uuid,
    email text,
    full_name text,
    department text,
    designation text,
    salary numeric,
    join_date date,
    status text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
    WHERE ur.role = 'employee'
$$;