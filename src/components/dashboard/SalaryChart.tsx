import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jul', salary: 2850000 },
  { month: 'Aug', salary: 2920000 },
  { month: 'Sep', salary: 2890000 },
  { month: 'Oct', salary: 3100000 },
  { month: 'Nov', salary: 3200000 },
  { month: 'Dec', salary: 3350000 },
];

export function SalaryChart() {
  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  return (
    <div className="card-elevated">
      <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Payroll Trend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(0, 0%, 45%)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="hsl(0, 0%, 45%)"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Total Payroll']}
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(0, 0%, 90%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px -4px hsl(0 0% 0% / 0.12)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="salary" 
              stroke="hsl(168, 76%, 42%)" 
              strokeWidth={2}
              fill="url(#salaryGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
