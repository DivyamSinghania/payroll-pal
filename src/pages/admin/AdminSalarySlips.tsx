import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalarySlipForm } from "@/components/dashboard/SalarySlipForm";
import { SalarySlipsTable } from "@/components/dashboard/SalarySlipsTable";
import { useSalarySlips, useDeleteSalarySlip, useUpdateSalarySlip } from "@/hooks/useSalarySlips";
import { Search, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminSalarySlips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: salaryData, isLoading } = useSalarySlips({
    search: searchQuery,
    status: statusFilter,
    month: monthFilter,
    page,
    pageSize: 10,
  });

  const deleteMutation = useDeleteSalarySlip();
  const updateMutation = useUpdateSalarySlip();

  const slips = salaryData?.slips || [];
  const totalPages = salaryData?.totalPages || 1;

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Salary slip deleted successfully");
    } catch (error) {
      toast.error("Failed to delete salary slip");
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'approved' | 'paid') => {
    try {
      await updateMutation.mutateAsync({ id, status });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
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
          <h1 className="text-2xl font-bold text-foreground">Salary Slips</h1>
          <p className="text-muted-foreground">Generate and manage employee salary slips.</p>
        </div>
      </div>

      {/* Create Salary Slip Form */}
      <SalarySlipForm />

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or department..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={monthFilter} onValueChange={(v) => { setMonthFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTHS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {slips.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No salary slips found.
        </div>
      ) : (
        <>
          <SalarySlipsTable 
            slips={slips} 
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            isAdmin={true}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
