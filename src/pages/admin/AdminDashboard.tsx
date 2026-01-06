import { Users, DollarSign, FileText, Clock, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { SalaryChart } from "@/components/dashboard/SalaryChart";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useAdminDashboardStats } from "@/hooks/useDashboardStats";

export default function AdminDashboard() {
  const { data: salaryData, isLoading: slipsLoading } = useSalarySlips({ pageSize: 5 });
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();

  const isLoading = slipsLoading || statsLoading;

  const slips = salaryData?.slips || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your payroll overview.</p>
      </div>

      {/* Stats from real database queries */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees.toString() || '0'}
          icon={Users}
        />
        <StatCard
          title="Total Payroll (Paid)"
          value={`₹${((stats?.totalPayroll || 0) / 100000).toFixed(1)}L`}
          icon={DollarSign}
        />
        <StatCard
          title="Approved Slips"
          value={stats?.approvedSlips.toString() || '0'}
          icon={FileText}
        />
        <StatCard
          title="Pending Expenses"
          value={stats?.pendingExpenses.toString() || '0'}
          icon={Clock}
        />
      </div>

      {/* Chart with real data */}
      <SalaryChart />

      {/* Create Salary Slip Form */}
      <SalarySlipForm />

      {/* Salary Slips Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Salary Slips</h2>
        {slips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No salary slips yet.</div>
        ) : (
          <SalarySlipsTable slips={slips} />
        )}
      </div>
    </div>
  );
}
