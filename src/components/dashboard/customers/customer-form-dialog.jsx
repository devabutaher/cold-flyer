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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema } from "@/validations";

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
  const [dateOpen, setDateOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_FORM,
    resolver: zodResolver(customerFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      reset(getInitialForm(mode, customer));
    }
  }, [mode, customer, open, reset]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
        amount: formData.amount ? Number(formData.amount) : undefined,
        email: formData.email || undefined,
        company: formData.company || undefined,
        address: formData.address || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        unit: formData.unit || undefined,
        installDate: formData.installDate || undefined,
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} placeholder="Customer name" />}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="phone" className="mb-1.5 block">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <Input id="phone" {...field} placeholder="Phone number" />}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="email" className="mb-1.5 block">
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input id="email" type="email" {...field} placeholder="Email address" />}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="company" className="mb-1.5 block">
                Company
              </Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => <Input id="company" {...field} placeholder="Company name" />}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address" className="mb-1.5 block">
                Address
              </Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <Input id="address" {...field} placeholder="Full address" />}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="brand" className="mb-1.5 block">
                Brand
              </Label>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => <Input id="brand" {...field} placeholder="AC brand" />}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="model" className="mb-1.5 block">
                Model
              </Label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => <Input id="model" {...field} placeholder="AC model" />}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="unit" className="mb-1.5 block">
                Unit
              </Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => <Input id="unit" {...field} placeholder="Unit / Qty" />}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="mb-1.5 block">Install Date</Label>
              <Controller
                name="installDate"
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
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="service" className="mb-1.5 block">
                Service <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="service"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.service && <p className="text-xs text-destructive mt-1">{errors.service.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="amount" className="mb-1.5 block">
                Amount
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => <Input id="amount" type="number" {...field} placeholder="0" />}
              />
              {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
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
