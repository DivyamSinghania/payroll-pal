import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useProfiles } from "@/hooks/useProfiles";
import { Search, Filter, Loader2 } from "lucide-react";

export default function AdminSalarySlips() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: salarySlips = [], isLoading: slipsLoading } = useSalarySlips();
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();

  const isLoading = slipsLoading || profilesLoading;

  // Map slips with profile info
  const slipsWithInfo = salarySlips.map(slip => {
    const profile = profiles.find(p => p.user_id === slip.employee_id);
    return {
      ...slip,
      employeeName: profile?.full_name || profile?.email || 'Unknown',
      department: profile?.department || 'N/A',
    };
  });

  const filteredSlips = slipsWithInfo.filter(slip =>
    (slip.employeeName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (slip.department?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
      {filteredSlips.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No salary slips found.
        </div>
      ) : (
        <SalarySlipsTable slips={filteredSlips} />
      )}
    </div>
  );
}
