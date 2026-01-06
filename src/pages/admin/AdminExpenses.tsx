import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenses, useApproveExpense, type ExpenseWithEmployee } from "@/hooks/useExpenses";
import { Search, Filter, Loader2, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CATEGORIES = ['Travel', 'Equipment', 'Software', 'Office Supplies', 'Training', 'Other'];

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function AdminExpenses() {
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

  const approveMutation = useApproveExpense();

  const expenses = (expensesData?.expenses || []) as ExpenseWithEmployee[];
  const totalPages = expensesData?.totalPages || 1;
  const total = expensesData?.total || 0;

  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync({ id, status: 'approved' });
      toast.success("Expense approved");
    } catch (error) {
      toast.error("Failed to approve expense");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await approveMutation.mutateAsync({ id, status: 'rejected' });
      toast.success("Expense rejected");
    } catch (error) {
      toast.error("Failed to reject expense");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expense Approvals</h1>
          <p className="text-muted-foreground">Review and approve employee expense claims.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-semibold text-foreground">{total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pending Claims</p>
          <p className="text-2xl font-semibold text-warning">{pendingCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-semibold text-warning">{formatCurrency(pendingAmount)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Approved Amount</p>
          <p className="text-2xl font-semibold text-success">{formatCurrency(approvedAmount)}</p>
        </div>
      </div>

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

      {/* Table */}
      {expenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No expenses found.
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{expense.employee_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{expense.department || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{expense.title}</p>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{expense.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[expense.status]} variant="outline">
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {expense.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleApprove(expense.id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(expense.id)}
                            disabled={approveMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
  );
}
