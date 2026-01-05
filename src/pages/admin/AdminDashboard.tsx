import { Users, DollarSign, FileText, Clock, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { SalaryChart } from "@/components/dashboard/SalaryChart";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useProfiles } from "@/hooks/useProfiles";
import { useExpenses } from "@/hooks/useExpenses";

export default function AdminDashboard() {
  const { data: salarySlips = [], isLoading: slipsLoading } = useSalarySlips();
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();

  const isLoading = slipsLoading || profilesLoading || expensesLoading;

  // Map slips with profile info
  const slipsWithInfo = salarySlips.slice(0, 5).map(slip => {
    const profile = profiles.find(p => p.user_id === slip.employee_id);
    return {
      ...slip,
      employeeName: profile?.full_name || profile?.email || 'Unknown',
      department: profile?.department || 'N/A',
    };
  });

  const totalPayroll = salarySlips.reduce((sum, s) => sum + s.net_salary, 0);
  const pendingApprovals = salarySlips.filter(s => s.status === 'pending').length + 
                           expenses.filter(e => e.status === 'pending').length;

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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={profiles.length.toString()}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Monthly Payroll"
          value={`₹${(totalPayroll / 100000).toFixed(1)}L`}
          icon={DollarSign}
          trend={{ value: 4.5, isPositive: true }}
        />
        <StatCard
          title="Salary Slips Generated"
          value={salarySlips.length.toString()}
          icon={FileText}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals.toString()}
          icon={Clock}
        />
      </div>

      {/* Chart */}
      <SalaryChart />

      {/* Create Salary Slip Form */}
      <SalarySlipForm />

      {/* Salary Slips Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Salary Slips</h2>
        {slipsWithInfo.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No salary slips yet.</div>
        ) : (
          <SalarySlipsTable slips={slipsWithInfo} />
        )}
      </div>
    </div>
  );
}
