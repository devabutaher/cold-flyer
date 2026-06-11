"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreateUser } from "@/hooks/queries/users";
import { createUserSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const ROLE_OPTIONS = ["customer", "admin", "moderator", "worker"];
const EMPTY_FORM = { name: "", email: "", phone: "", password: "", role: "customer" };

export function AddUserSheet({ open, onOpenChange }) {
  const [saving, setSaving] = useState(false);
  const createUser = useCreateUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FORM,
    resolver: zodResolver(createUserSchema),
    mode: "onTouched",
  });

  function resetForm() {
    reset(EMPTY_FORM);
  }

  async function onSubmit(data) {
    setSaving(true);
    try {
      await createUser.mutateAsync(data);
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
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Create a new user account with a role and credentials.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => <Input id="name" {...field} aria-invalid={fieldState.invalid} />}
            />
            {errors?.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => <Input id="email" type="email" {...field} aria-invalid={fieldState.invalid} />}
            />
            {errors?.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} />} />
            {errors?.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => <Input id="password" type="password" {...field} aria-invalid={fieldState.invalid} />}
            />
            {errors?.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors?.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? "Saving..." : "Add User"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
