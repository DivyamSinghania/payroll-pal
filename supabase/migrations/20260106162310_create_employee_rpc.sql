create or replace function create_employee(
  p_email text,
  p_full_name text,
  p_department text,
  p_designation text,
  p_salary numeric,
  p_status text
)
returns void
language plpgsql
security definer
as $$
declare
  new_user_id uuid;
begin
  insert into auth.users (email)
  values (p_email)
  returning id into new_user_id;

  insert into public.profiles (
    user_id, email, full_name, department, designation, salary, status, role
  )
  values (
    new_user_id, p_email, p_full_name, p_department, p_designation, p_salary, p_status, 'employee'
  );
end;
$$;

grant execute on function create_employee to authenticated;
