import { DollarSign, FileText, Receipt, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { mockSalarySlips, mockExpenses } from "@/data/mockData";
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
  // Filter for current employee's data
  const mySlips = mockSalarySlips.filter(s => s.employeeId === "1").slice(0, 3);
  const myExpenses = mockExpenses.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John! Here's your salary overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Salary"
          value="₹82,000"
          icon={DollarSign}
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatCard
          title="Total Salary Slips"
          value="12"
          icon={FileText}
        />
        <StatCard
          title="Pending Expenses"
          value="2"
          icon={Receipt}
        />
        <StatCard
          title="YTD Earnings"
          value="₹9.84L"
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
        <SalarySlipsTable slips={mySlips} showEmployee={false} />
      </div>

      {/* Submit Expense */}
      <ExpenseForm />

      {/* Recent Expenses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
        <ExpensesTable expenses={myExpenses} />
      </div>
    </div>
  );
}
