import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployees, useUpdateEmployee, useDeleteEmployee, type Employee } from "@/hooks/useEmployees";
import { Search, Plus, Filter, Loader2, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

export default function AdminEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    department: '',
    designation: '',
    salary: 0,
    status: 'active',
  });

  const { data: employeesData, isLoading } = useEmployees({
    search: searchQuery,
    department: departmentFilter,
    status: statusFilter,
    page,
    pageSize: 10,
  });

  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const employees = employeesData?.employees || [];
  const totalPages = employeesData?.totalPages || 1;
  const total = employeesData?.total || 0;

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditForm({
      full_name: employee.full_name || '',
      department: employee.department || '',
      designation: employee.designation || '',
      salary: employee.salary || 0,
      status: employee.status || 'active',
    });
  };
  const [openCreate, setOpenCreate] = useState(false);

  const [createForm, setCreateForm] = useState({
    full_name: "",
    email: "",
    department: "",
    designation: "",
    salary: 0,
    status: "active",
  });
  const { signUp } = useAuth();

const handleCreateEmployee = async () => {
  try {
    const tempPassword = "Temp@1234"; // simple default password

    // 1. Create Auth user
    const { error: authError } = await signUp(
      createForm.email,
      tempPassword,
      createForm.full_name,
      "employee"
    );

    if (authError) throw authError;

    // 2. Update profile with extra fields
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        department: createForm.department,
        designation: createForm.designation,
        salary: createForm.salary,
        status: createForm.status,
      })
      .eq("email", createForm.email);

    if (profileError) throw profileError;

    toast.success("Employee created successfully");

    setOpenCreate(false);
    setCreateForm({
      full_name: "",
      email: "",
      department: "",
      designation: "",
      salary: 0,
      status: "active",
    });

  } catch (err: any) {
    toast.error(err.message || "Failed to create employee");
  }
};



  const handleSaveEdit = async () => {
    if (!editingEmployee) return;
    try {
      await updateMutation.mutateAsync({
        userId: editingEmployee.user_id,
        ...editForm,
      });
      toast.success("Employee updated successfully");
      setEditingEmployee(null);
    } catch (error) {
      toast.error("Failed to update employee");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteMutation.mutateAsync(userId);
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold text-foreground">Employees</h1>
    <p className="text-muted-foreground">Manage your organization's employees (excludes admins).</p>
  </div>

  <Button onClick={() => setOpenCreate(true)}>
    <Plus className="h-4 w-4 mr-2" />
    Add Employee
  </Button>
</div>


      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            {DEPARTMENTS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-2xl font-semibold text-foreground">{total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-semibold text-success">
            {employees.filter(e => e.status === 'active').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-semibold text-muted-foreground">
            {employees.filter(e => e.status === 'inactive').length}
          </p>
        </div>
      </div>

      {/* Table */}
      {employees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No employees found.
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials(employee.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{employee.full_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.department || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.designation || 'N/A'}</TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(employee.salary || 0)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.join_date ? new Date(employee.join_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {employee.full_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(employee.user_id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm(f => ({ ...f, full_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-dept">Department</Label>
              <Select value={editForm.department} onValueChange={(v) => setEditForm(f => ({ ...f, department: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-designation">Designation</Label>
              <Input
                id="edit-designation"
                value={editForm.designation}
                onChange={(e) => setEditForm(f => ({ ...f, designation: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-salary">Salary</Label>
              <Input
                id="edit-salary"
                type="number"
                value={editForm.salary}
                onChange={(e) => setEditForm(f => ({ ...f, salary: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm(f => ({ ...f, status: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEmployee(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Employee Dialog */}
<Dialog open={openCreate} onOpenChange={setOpenCreate}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Employee</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input
          value={createForm.full_name}
          onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={createForm.email}
          onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
        />
      </div>

      <div>
        <Label>Department</Label>
        <Select
          value={createForm.department}
          onValueChange={(v) => setCreateForm({ ...createForm, department: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Designation</Label>
        <Input
          value={createForm.designation}
          onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
        />
      </div>

      <div>
        <Label>Salary</Label>
        <Input
          type="number"
          value={createForm.salary}
          onChange={(e) => setCreateForm({ ...createForm, salary: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={createForm.status}
          onValueChange={(v) => setCreateForm({ ...createForm, status: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
      <Button onClick={handleCreateEmployee}>Create Employee</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
