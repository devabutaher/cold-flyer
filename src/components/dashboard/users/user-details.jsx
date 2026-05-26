"use client";

import { useUserQuery } from "@/hooks/queries/users";
import { ArrowLeft, Award, CalendarDays, Lock, Mail, MapPin, Phone, Shield, Star, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function UserDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function UserDetails({ userId }) {
  const { data: user, isLoading, isError, error } = useUserQuery(userId);

  if (isLoading) return <UserDetailsSkeleton />;

  if (isError) {
    return (
      <div className="py-16 text-center">
        <User size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-destructive mb-2">Failed to load user details.</p>
        <p className="text-xs text-muted-foreground mb-4">{error?.message || "An unexpected error occurred."}</p>
        <Button asChild size="sm">
          <Link href="/dashboard/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <User size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">User not found.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  const roleLabel = user.role === "admin" ? "Admin" : user.role === "technician" ? "Technician" : "User";
  const roleClass =
    user.role === "admin"
      ? "bg-primary/10 text-primary"
      : user.role === "technician"
      ? "bg-blue-500/10 text-blue-600"
      : "bg-muted text-muted-foreground";

  const statusLabel = user.isActive ? "Active" : "Inactive";
  const statusClass = user.isActive ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive";

  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
          <Link href="/dashboard/users">
            <ArrowLeft size={16} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">{user.name || "User"}</h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{user.email}</span>
            <span>·</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${roleClass}`}>
              {roleLabel}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <User size={15} className="text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="text-sm font-medium bg-muted">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground shrink-0" />
                  <span>{user.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground shrink-0" />
                  <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-muted-foreground shrink-0" />
                  <span className="capitalize">{user.gender || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground shrink-0" />
                  <span className="capitalize">{user.provider || "Email"}</span>
                </div>
                {user.userId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground shrink-0 w-3.5 flex justify-center text-xs font-semibold">#</span>
                    <span className="font-mono text-xs">{user.userId}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {user.addresses?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={15} className="text-primary" />
                  Saved Addresses ({user.addresses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="divide-y divide-border">
                  {user.addresses.map((addr, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{addr.label || "Address"}</span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xxs font-medium text-green-600">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground space-y-0.5">
                        {addr.fullName && <p>{addr.fullName}</p>}
                        {addr.phone && <p>{addr.phone}</p>}
                        {(addr.district || addr.thana) && (
                          <p>{[addr.district, addr.thana].filter(Boolean).join(", ")}</p>
                        )}
                        {addr.address && <p>{addr.address}</p>}
                        {addr.instructions && (
                          <p className="text-xs italic">Note: {addr.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lock size={15} className="text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={user.isEmailVerified ? "text-green-600" : "text-amber-600"}>
                  {user.isEmailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone Verified</span>
                <span className={user.isPhoneVerified ? "text-green-600" : "text-amber-600"}>
                  {user.isPhoneVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="tabular-nums">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Login Attempts</span>
                <span className="tabular-nums">{user.loginAttempts || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Star size={15} className="text-primary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Orders</span>
                <span className="font-medium tabular-nums">{user.orders?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bookings</span>
                <span className="font-medium tabular-nums">{user.serviceBookings?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wishlist</span>
                <span className="font-medium tabular-nums">{user.wishlist?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Addresses</span>
                <span className="font-medium tabular-nums">{user.addresses?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={15} className="text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={user.isActive ? "text-green-600" : "text-destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="tabular-nums">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="tabular-nums">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"}</span>
              </div>
              {user.technicianProfile && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-700">
                  Has a technician profile linked
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
