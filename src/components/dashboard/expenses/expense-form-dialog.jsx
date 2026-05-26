"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClient } from "@/lib/http-client";
import { CalendarIcon, Loader2 } from "lucide-react";
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

function getInitialForm(mode, expense) {
  if (mode === "edit" && expense) {
    return {
      item: expense.item || "",
      amount: expense.amount?.toString() || "",
      date: expense.date ? expense.date.slice(0, 10) : "",
      category: expense.category || "",
    };
  }
  return INITIAL_FORM;
}

export function ExpenseFormDialog({ mode = "create", expense, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(mode === "edit" && expense ? {
        item: expense.item || "",
        amount: expense.amount?.toString() || "",
        date: expense.date ? expense.date.slice(0, 10) : "",
        category: expense.category || "",
      } : INITIAL_FORM);
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
        const res = await getClient().post("/expenses", payload);
        return res.data;
      } else {
        const res = await getClient().patch(`/expenses/${expense._id}`, payload);
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
      <AlertDialogContent>
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
              <Label className="mb-1.5 block">
                Date <span className="text-destructive">*</span>
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input readOnly value={form.date ? format(new Date(form.date + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" required />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar mode="single" selected={form.date ? new Date(form.date + "T00:00:00") : undefined} onSelect={(date) => { set("date", date ? format(date, "yyyy-MM-dd") : ""); setDateOpen(false); }} />
                </PopoverContent>
              </Popover>
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
