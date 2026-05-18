"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Cake, VenetianMask, Pencil, X, Check, Camera } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { updateProfileAction } from "@/lib/actions/user";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

function formatDate(dateStr) {
  if (!dateStr) return "Not set";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Not set";
  }
}

function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export function ProfileSection({ user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    dateOfBirth: toDateInputValue(user.dateOfBirth),
    gender: user.gender || "",
  });

  async function handleSave() {
    setSaving(true);
    const payload = {};
    if (form.name !== user.name) payload.name = form.name;
    if (form.phone !== (user.phone || "")) payload.phone = form.phone;
    if (form.dateOfBirth !== toDateInputValue(user.dateOfBirth)) payload.dateOfBirth = form.dateOfBirth || null;
    if (form.gender !== (user.gender || "")) payload.gender = form.gender || null;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      setSaving(false);
      return;
    }

    const result = await updateProfileAction(payload);
    setSaving(false);

    if (result.success) {
      toast.success("Profile updated");
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update profile");
    }
  }

  function handleCancel() {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      dateOfBirth: toDateInputValue(user.dateOfBirth),
      gender: user.gender || "",
    });
    setIsEditing(false);
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="size-3.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Check className="size-3.5" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative group">
            <Avatar size="lg" className="size-20">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Change avatar"
            >
              <Camera className="size-5 text-white" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-4">
            {isEditing ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) => setForm({ ...form, gender: value })}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone || "Not set"}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Cake className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <VenetianMask className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{user.gender || "Not set"}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
