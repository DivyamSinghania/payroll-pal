import { DollarSign, FileText, Receipt, TrendingUp, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { useSalarySlips } from "@/hooks/useSalarySlips";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/contexts/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salaryData = [
  { month: 'Jul', amount: 78000 },
  { month: 'Aug', amount: 80000 },
  { month: 'Sep', amount: 79000 },
  { month: 'Oct', amount: 82000 },
  { month: 'Nov', amount: 82000 },
  { month: 'Dec', amount: 82000 },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data: salarySlips = [], isLoading: slipsLoading } = useSalarySlips();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const mySlips = salarySlips.slice(0, 3).map(s => ({
    ...s,
    employeeName: userName,
    department: 'Employee',
  }));
  
  const myExpenses = expenses.slice(0, 3).map(e => ({
    id: e.id,
    employee_id: e.employee_id,
    title: e.title,
    category: e.category,
    amount: e.amount,
    date: e.date,
    status: e.status as 'pending' | 'approved' | 'rejected',
    description: e.description,
    created_at: e.created_at,
    updated_at: e.updated_at,
  }));

  const currentSalary = salarySlips[0]?.net_salary || 0;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const totalEarnings = salarySlips.reduce((sum, s) => sum + s.net_salary, 0);

  const isLoading = slipsLoading || expensesLoading;

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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Salary"
          value={`₹${currentSalary.toLocaleString('en-IN')}`}
          icon={DollarSign}
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatCard
          title="Total Salary Slips"
          value={salarySlips.length.toString()}
          icon={FileText}
        />
        <StatCard
          title="Pending Expenses"
          value={pendingExpenses.toString()}
          icon={Receipt}
        />
        <StatCard
          title="YTD Earnings"
          value={`₹${(totalEarnings / 100000).toFixed(2)}L`}
          icon={TrendingUp}
        />
      </div>

      {/* Salary Trend Chart */}
      <div className="card-elevated">
        <h3 className="text-lg font-semibold text-foreground mb-6">Salary Trend</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salaryData}>
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
        {myExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No expenses submitted yet.</div>
        ) : (
          <ExpensesTable expenses={myExpenses} />
        )}
      </div>
    </div>
  );
}
