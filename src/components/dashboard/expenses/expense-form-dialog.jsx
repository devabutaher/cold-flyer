"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClient } from "@/lib/http-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "utilities", label: "Utilities" },
  { value: "salary", label: "Salary" },
  { value: "rent", label: "Rent" },
  { value: "maintenance", label: "Maintenance" },
  { value: "transport", label: "Transport" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "marketing", label: "Marketing" },
  { value: "food", label: "Food" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM = {
  item: "",
  amount: "",
  date: "",
  category: "",
};

export function ExpenseFormDialog({ mode = "create", expense, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (mode === "edit" && expense) {
      setForm({
        item: expense.item || "",
        amount: expense.amount?.toString() || "",
        date: expense.date ? expense.date.slice(0, 10) : "",
        category: expense.category || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [mode, expense, open]);

  const set = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        amount: form.amount ? Number(form.amount) : 0,
      };
      if (mode === "create") {
        const res = await getClient().post("/api/expenses", payload);
        return res.data;
      } else {
        const res = await getClient().patch(`/api/expenses/${expense._id}`, payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Expense created." : "Expense updated.");
      onSuccess?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.item || !form.amount || !form.date) {
      toast.error("Item, amount, and date are required.");
      return;
    }
    mutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>{mode === "create" ? "Add Expense" : "Edit Expense"}</AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "create" ? "Record a new expense entry." : "Update the expense details."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="item" className="mb-1.5 block">
                Item <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item"
                value={form.item}
                onChange={(e) => set("item", e.target.value)}
                placeholder="Expense item name"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="amount" className="mb-1.5 block">
                Amount (৳) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="date" className="mb-1.5 block">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="category" className="mb-1.5 block">
                Category
              </Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={mutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 size={14} className="mr-1.5 animate-spin" />}
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
