import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Download, Loader2 } from "lucide-react";

export default function EmployeeSalarySlips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data: salaryData, isLoading } = useSalarySlips({
    search: searchQuery,
    page,
    pageSize: 10,
  });

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const slips = salaryData?.slips || [];
  const total = salaryData?.total || 0;
  const totalPages = salaryData?.totalPages || 1;

  // Add employee name to slips for display
  const mySlips = slips.map(s => ({
    ...s,
    employeeName: userName,
    department: 'Employee',
  }));

  const totalEarnings = slips.reduce((sum, s) => sum + s.net_salary, 0);

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
          <h1 className="text-2xl font-bold text-foreground">My Salary Slips</h1>
          <p className="text-muted-foreground">View and download your salary slips.</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Slips</p>
          <p className="text-2xl font-semibold text-foreground">{total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-2xl font-semibold text-primary">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Average Monthly</p>
          <p className="text-2xl font-semibold text-foreground">
            ₹{total > 0 ? Math.round(totalEarnings / total).toLocaleString('en-IN') : 0}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by month or year..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      {mySlips.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No salary slips found.
        </div>
      ) : (
        <>
          <SalarySlipsTable slips={mySlips} showEmployee={false} />
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
    </div>
  );
}
