import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import type { SalarySlip } from "@/types/payroll";
import { cn } from "@/lib/utils";

interface SalarySlipsTableProps {
  slips: SalarySlip[];
  showEmployee?: boolean;
}

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-primary/10 text-primary border-primary/20",
  paid: "bg-success/10 text-success border-success/20",
};

export function SalarySlipsTable({ slips, showEmployee = true }: SalarySlipsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-scrol">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {showEmployee && <TableHead>Employee</TableHead>}
            <TableHead>Month</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead>Allowances</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slips.map((slip) => {
            console.log(slip);
            return(<TableRow key={slip.id} className="table-row-hover ">
              {showEmployee && (
                
                <TableCell>
                  
                  <div>
                    <p className="font-medium text-foreground">{slip.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{slip.department}</p>
                  </div>
                </TableCell>
              )}
              <TableCell>
                {slip.month} {slip.year}
              </TableCell>
              <TableCell>{formatCurrency(slip.basic_salary)}</TableCell>
              <TableCell className="text-success">+{formatCurrency(slip.allowances)}</TableCell>
              <TableCell className="text-destructive">-{formatCurrency(slip.deductions)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(slip.net_salary)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize", statusStyles[slip.status])}>
                  {slip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>)
  })}
        </TableBody>
      </Table>
    </div>
  );
}
