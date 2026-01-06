import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { useExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import { Search, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = ['Travel', 'Equipment', 'Software', 'Office Supplies', 'Training', 'Other'];

export default function EmployeeExpenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: expensesData, isLoading } = useExpenses({
    search: searchQuery,
    status: statusFilter,
    category: categoryFilter,
    page,
    pageSize: 10,
  });

  const deleteMutation = useDeleteExpense();

  const expenses = expensesData?.expenses || [];
  const totalPages = expensesData?.totalPages || 1;
  const total = expensesData?.total || 0;

  const pendingTotal = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const approvedTotal = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

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
          <p className="text-2xl font-semibold text-foreground">{total}</p>
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
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expense History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Expense History</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No expenses found. Submit your first expense above.
          </div>
        ) : (
          <>
            <ExpensesTable expenses={expenses} onDelete={handleDelete} />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
