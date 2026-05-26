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

const SERVICE_OPTIONS = ["Installation", "Repair", "Maintenance", "Gas Fill", "Other"];

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  company: "",
  address: "",
  brand: "",
  model: "",
  unit: "",
  installDate: "",
  service: "",
  amount: "",
};

function getInitialForm(mode, customer) {
  if (mode === "edit" && customer) {
    return {
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      company: customer.company || "",
      address: customer.address || "",
      brand: customer.brand || "",
      model: customer.model || "",
      unit: customer.unit || "",
      installDate: customer.installDate ? customer.installDate.slice(0, 10) : "",
      service: customer.service || "",
      amount: customer.amount?.toString() || "",
    };
  }
  return INITIAL_FORM;
}

export function CustomerFormDialog({ mode = "create", customer, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(mode === "edit" && customer ? {
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        company: customer.company || "",
        address: customer.address || "",
        brand: customer.brand || "",
        model: customer.model || "",
        unit: customer.unit || "",
        installDate: customer.installDate ? customer.installDate.slice(0, 10) : "",
        service: customer.service || "",
        amount: customer.amount?.toString() || "",
      } : INITIAL_FORM);
    }
  }, [mode, customer, open]);

  const set = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        amount: form.amount ? Number(form.amount) : undefined,
      };
      if (mode === "create") {
        const res = await getClient().post("/customers", payload);
        return res.data;
      } else {
        const res = await getClient().patch(`/customers/${customer._id}`, payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Customer created." : "Customer updated.");
      onSuccess?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required.");
      return;
    }
    mutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>{mode === "create" ? "Add Customer" : "Edit Customer"}</AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "create" ? "Fill in the details to add a new customer." : "Update the customer details."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="name" className="mb-1.5 block">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Customer name" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="phone" className="mb-1.5 block">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="email" className="mb-1.5 block">
                Email
              </Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email address" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="company" className="mb-1.5 block">
                Company
              </Label>
              <Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company name" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address" className="mb-1.5 block">
                Address
              </Label>
              <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="brand" className="mb-1.5 block">
                Brand
              </Label>
              <Input id="brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="AC brand" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="model" className="mb-1.5 block">
                Model
              </Label>
              <Input id="model" value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="AC model" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="unit" className="mb-1.5 block">
                Unit
              </Label>
              <Input id="unit" value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="Unit / Qty" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="mb-1.5 block">
                Install Date
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input readOnly value={form.installDate ? format(new Date(form.installDate + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar mode="single" selected={form.installDate ? new Date(form.installDate + "T00:00:00") : undefined} onSelect={(date) => { set("installDate", date ? format(date, "yyyy-MM-dd") : ""); setDateOpen(false); }} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="service" className="mb-1.5 block">
                Service
              </Label>
              <Select value={form.service} onValueChange={(v) => set("service", v)}>
                <SelectTrigger id="service" className="w-full">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="amount" className="mb-1.5 block">
                Amount
              </Label>
              <Input id="amount" type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" />
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
