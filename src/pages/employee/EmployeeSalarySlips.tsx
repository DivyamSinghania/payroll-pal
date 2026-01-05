import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { mockSalarySlips } from "@/data/mockData";
import { Search, Download } from "lucide-react";

export default function EmployeeSalarySlips() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter for current employee's slips
  const mySlips = mockSalarySlips.filter(s => s.employeeId === "1");
  
  const filteredSlips = mySlips.filter(slip =>
    slip.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slip.year.toString().includes(searchQuery)
  );

  const totalEarnings = mySlips.reduce((sum, s) => sum + s.netSalary, 0);

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
          <p className="text-2xl font-semibold text-foreground">{mySlips.length}</p>
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
            ₹{Math.round(totalEarnings / mySlips.length).toLocaleString('en-IN')}
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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <SalarySlipsTable slips={filteredSlips} showEmployee={false} />
    </div>
  );
}
