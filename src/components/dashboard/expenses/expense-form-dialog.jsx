"use client";

import {
  AlertDialog,
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
import { SelectWithOther } from "@/components/ui/select-with-other";
import { getClient } from "@/lib/http-client";
import { expenseFormSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
];

const INITIAL_FORM = { item: "", amount: "", date: "", category: "" };

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
  const [dateOpen, setDateOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_FORM,
    resolver: zodResolver(expenseFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      reset(getInitialForm(mode, expense));
    }
  }, [mode, expense, open, reset]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        category: formData.category || undefined,
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
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const onSubmit = (formData) => mutation.mutate(formData);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Controller
                name="item"
                control={control}
                render={({ field, fieldState }) => (
                  <Input id="item" {...field} placeholder="Expense item name" aria-invalid={fieldState.invalid} />
                )}
              />
              {errors.item && <p className="text-xs text-destructive mt-1">{errors.item.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="amount" className="mb-1.5 block">
                Amount (৳) <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <Input id="amount" type="number" {...field} placeholder="0" aria-invalid={fieldState.invalid} />
                )}
              />
              {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="mb-1.5 block">
                Date <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer" role="button" tabIndex={0}>
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                        <Input
                          readOnly
                          value={field.value ? format(new Date(field.value + "T00:00:00"), "PP") : ""}
                          placeholder="Pick a date"
                          className="pl-10 cursor-pointer"
                          aria-invalid={false}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value + "T00:00:00") : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          setDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div className="col-span-2">
              <Label htmlFor="category" className="mb-1.5 block">
                Category
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SelectWithOther
                    options={CATEGORY_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category"
                  />
                )}
              />
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
