"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreateWorker } from "@/hooks/queries/technicians";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const createWorkerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specializations: z.string().optional().or(z.literal("")),
  salary: z.string().optional().or(z.literal("")),
});

const EMPTY_FORM = { name: "", email: "", phone: "", password: "", specializations: "", salary: "" };

export function AddWorkerSheet({ open, onOpenChange }) {
  const [saving, setSaving] = useState(false);
  const createWorker = useCreateWorker();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FORM,
    resolver: zodResolver(createWorkerSchema),
    mode: "onTouched",
  });

  function resetForm() {
    reset(EMPTY_FORM);
  }

  async function onSubmit(data) {
    setSaving(true);
    try {
      await createWorker.mutateAsync(data);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) resetForm();
      }}
    >
      <SheetContent side="right" open={open} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Worker</SheetTitle>
          <SheetDescription>Create a new worker account with credentials and profile details.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
            {errors?.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input id="email" type="email" {...field} />}
            />
            {errors?.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} />} />
            {errors?.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input id="password" type="password" {...field} />}
            />
            {errors?.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specializations">Specializations</Label>
            <Controller
              name="specializations"
              control={control}
              render={({ field }) => <Input id="specializations" placeholder="e.g. Installation, Repair" {...field} />}
            />
            {errors?.specializations && <p className="text-xs text-destructive">{errors.specializations.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="salary">Salary (BDT)</Label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => <Input id="salary" type="number" placeholder="0" {...field} />}
            />
            {errors?.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? "Saving..." : "Add Worker"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
