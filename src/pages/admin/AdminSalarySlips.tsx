import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { mockSalarySlips } from "@/data/mockData";
import { Search, Filter } from "lucide-react";

export default function AdminSalarySlips() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSlips = mockSalarySlips.filter(slip =>
    slip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slip.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Salary Slips</h1>
          <p className="text-muted-foreground">Generate and manage employee salary slips.</p>
        </div>
      </div>

      {/* Create Salary Slip Form */}
      <SalarySlipForm />

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or department..."
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

      {/* Table */}
      <SalarySlipsTable slips={filteredSlips} />
    </div>
  );
}
