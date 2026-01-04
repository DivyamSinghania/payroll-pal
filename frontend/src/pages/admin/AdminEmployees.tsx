import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeesTable } from "@/components/dashboard/EmployeesTable";
import { mockEmployees } from "@/data/mockData";
import { Search, Plus, Filter } from "lucide-react";

export default function AdminEmployees() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-2xl font-semibold text-foreground">{mockEmployees.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-semibold text-success">
            {mockEmployees.filter(e => e.status === 'active').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-semibold text-muted-foreground">
            {mockEmployees.filter(e => e.status === 'inactive').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <EmployeesTable employees={filteredEmployees} />
    </div>
  );
}
