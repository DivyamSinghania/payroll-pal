import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeesTable } from "@/components/dashboard/EmployeesTable";
import { useProfiles } from "@/hooks/useProfiles";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import type { Employee } from "@/types/payroll";

export default function AdminEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: profiles = [], isLoading } = useProfiles();

  // Convert profiles to employee format for the table
  const employees: Employee[] = profiles.map(profile => ({
    id: profile.id,
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    department: profile.department || 'General',
    designation: 'Employee',
    salary: 0, // Would need to be fetched from salary slips
    joinDate: profile.created_at.split('T')[0],
    status: 'active' as const,
  }));

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-muted-foreground">Manage your organization's employees.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-2xl font-semibold text-foreground">{employees.length}</p>
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
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No employees found.
        </div>
      ) : (
        <EmployeesTable employees={filteredEmployees} />
      )}
    </div>
  );
}
