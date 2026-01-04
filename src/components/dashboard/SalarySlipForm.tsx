import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const employees = [
  { id: "1", name: "John Doe", department: "Engineering" },
  { id: "2", name: "Jane Smith", department: "Design" },
  { id: "3", name: "Mike Johnson", department: "Marketing" },
  { id: "4", name: "Sarah Williams", department: "HR" },
];

export function SalarySlipForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    basicSalary: '',
    allowances: '',
    deductions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Salary slip created",
      description: "The salary slip has been generated successfully.",
    });

    setIsLoading(false);
    setFormData({
      employeeId: '',
      month: '',
      year: new Date().getFullYear().toString(),
      basicSalary: '',
      allowances: '',
      deductions: '',
    });
  };

  const netSalary = Number(formData.basicSalary || 0) + 
                   Number(formData.allowances || 0) - 
                   Number(formData.deductions || 0);

  return (
    <form onSubmit={handleSubmit} className="card-elevated">
      <h3 className="text-lg font-semibold text-foreground mb-6">Create Salary Slip</h3>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Employee</Label>
          <Select
            value={formData.employeeId}
            onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Month</Label>
          <Select
            value={formData.month}
            onValueChange={(value) => setFormData({ ...formData, month: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Year</Label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            min="2020"
            max="2030"
          />
        </div>

        <div className="space-y-2">
          <Label>Basic Salary (₹)</Label>
          <Input
            type="number"
            placeholder="Enter basic salary"
            value={formData.basicSalary}
            onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Allowances (₹)</Label>
          <Input
            type="number"
            placeholder="Enter allowances"
            value={formData.allowances}
            onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Deductions (₹)</Label>
          <Input
            type="number"
            placeholder="Enter deductions"
            value={formData.deductions}
            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
        <div>
          <p className="text-sm text-muted-foreground">Net Salary</p>
          <p className="text-2xl font-semibold text-foreground">
            ₹{netSalary.toLocaleString('en-IN')}
          </p>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Slip
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
