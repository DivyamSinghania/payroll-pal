import { DollarSign, FileText, Receipt, TrendingUp, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useExpenses } from "@/hooks/useExpenses";
import { useEmployeeDashboardStats, useEmployeeSalaryHistory } from "@/hooks/useDashboardStats";
import { useAuth } from "@/contexts/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data: salaryData, isLoading: slipsLoading } = useSalarySlips({ pageSize: 3 });
  const { data: expensesData, isLoading: expensesLoading } = useExpenses({ pageSize: 3 });
  const { data: stats, isLoading: statsLoading } = useEmployeeDashboardStats();
  const { data: salaryHistory } = useEmployeeSalaryHistory();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const slips = salaryData?.slips || [];
  const expenses = expensesData?.expenses || [];

  // Transform salary history for chart
  const chartData = (salaryHistory || []).reverse().map(item => ({
    month: item.month.slice(0, 3),
    amount: Number(item.net_salary),
  }));

  const mySlips = slips.map(s => ({
    ...s,
    employeeName: userName,
    department: 'Employee',
  }));

  const isLoading = slipsLoading || expensesLoading || statsLoading;

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
        <p className="text-muted-foreground">Welcome back, {userName}! Here's your salary overview.</p>
      </div>

      {/* Stats from real database */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Salary"
          value={`₹${(stats?.currentSalary || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Salary Slips"
          value={(salaryData?.total || 0).toString()}
          icon={FileText}
        />
        <StatCard
          title="Pending Expenses"
          value={(stats?.pendingExpenses || 0).toString()}
          icon={Receipt}
        />
        <StatCard
          title="Approved Expenses"
          value={`₹${((stats?.approvedExpenses || 0) / 1000).toFixed(1)}K`}
          icon={TrendingUp}
        />
      </div>

      {/* Salary Trend Chart with real data */}
      <div className="card-elevated">
        <h3 className="text-lg font-semibold text-foreground mb-6">Salary Trend</h3>
        <div className="h-[250px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salaryGradientEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 45%)" fontSize={12} />
                <YAxis 
                  tickFormatter={(v) => `₹${(v/1000)}K`} 
                  stroke="hsl(0, 0%, 45%)" 
                  fontSize={12} 
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Net Salary']}
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(0, 0%, 90%)',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(168, 76%, 42%)" 
                  strokeWidth={2}
                  fill="url(#salaryGradientEmp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No salary history available yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Salary Slips */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Salary Slips</h2>
        {mySlips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No salary slips yet.</div>
        ) : (
          <SalarySlipsTable slips={mySlips} showEmployee={false} />
        )}
      </div>

      {/* Submit Expense */}
      <ExpenseForm />

      {/* Recent Expenses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No expenses submitted yet.</div>
        ) : (
          <ExpensesTable expenses={expenses} />
        )}
      </div>
    </div>
  );
}
