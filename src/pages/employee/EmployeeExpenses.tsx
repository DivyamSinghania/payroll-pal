import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { useExpenses } from "@/hooks/useExpenses";
import { Search, Filter, Loader2 } from "lucide-react";
import type { Expense } from "@/types/payroll";

export default function EmployeeExpenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: expensesData = [], isLoading } = useExpenses();

  // Transform database expenses to match the Expense type
  const expenses: Expense[] = expensesData.map(exp => ({
    id: exp.id,
    employee_id: exp.employee_id,
    title: exp.title,
    category: exp.category,
    amount: exp.amount,
    date: exp.date,
    status: exp.status,
    description: exp.description,
    created_at: exp.created_at,
    updated_at: exp.updated_at,
  }));

  const filteredExpenses = expenses.filter(exp =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTotal = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const approvedTotal = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Expenses</h1>
        <p className="text-muted-foreground">Submit and track your expense claims.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Submitted</p>
          <p className="text-2xl font-semibold text-foreground">{expenses.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-semibold text-warning">
            ₹{pendingTotal.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Approved Amount</p>
          <p className="text-2xl font-semibold text-success">
            ₹{approvedTotal.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pending Claims</p>
          <p className="text-2xl font-semibold text-foreground">
            {expenses.filter(e => e.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Submit Expense Form */}
      <ExpenseForm />

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
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

      {/* Expense History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Expense History</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No expenses found. Submit your first expense above.
          </div>
        ) : (
          <ExpensesTable expenses={filteredExpenses} />
        )}
      </div>
    </div>
  );
}
