import { Users, DollarSign, FileText, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { SalaryChart } from "@/components/dashboard/SalaryChart";
import { mockSalarySlips } from "@/data/mockData";

export default function AdminDashboard() {
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
          value="24"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Monthly Payroll"
          value="₹33.5L"
          icon={DollarSign}
          trend={{ value: 4.5, isPositive: true }}
        />
        <StatCard
          title="Salary Slips Generated"
          value="96"
          icon={FileText}
        />
        <StatCard
          title="Pending Approvals"
          value="5"
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
        <SalarySlipsTable slips={mockSalarySlips} />
      </div>
    </div>
  );
}
