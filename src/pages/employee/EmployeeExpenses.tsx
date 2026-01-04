import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { mockExpenses } from "@/data/mockData";
import { Search, Filter } from "lucide-react";

export default function EmployeeExpenses() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExpenses = mockExpenses.filter(exp =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTotal = mockExpenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const approvedTotal = mockExpenses
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
          <p className="text-2xl font-semibold text-foreground">{mockExpenses.length}</p>
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
            {mockExpenses.filter(e => e.status === 'pending').length}
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
        <ExpensesTable expenses={filteredExpenses} />
      </div>
    </div>
  );
}
