import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Travel",
  "Meals",
  "Equipment",
  "Software",
  "Office Supplies",
  "Training",
  "Other",
];

export function ExpenseForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Expense submitted",
      description: "Your expense claim has been submitted for approval.",
    });

    setIsLoading(false);
    setFormData({
      title: '',
      description: '',
      amount: '',
      category: '',
      date: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated">
      <h3 className="text-lg font-semibold text-foreground mb-6">Submit New Expense</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Expense Title</Label>
          <Input
            placeholder="e.g., Client lunch meeting"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Amount (₹)</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Provide details about the expense..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Receipt (Optional)</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Submit Expense
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
