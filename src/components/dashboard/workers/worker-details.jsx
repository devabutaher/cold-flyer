"use client";

import { useWorkerQuery } from "@/hooks/queries/workers";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Car,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  Toolbox,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/table/table-cells";

const STATUS_MAP = {
  available: { label: "Available", className: "bg-green-500/10 text-green-600" },
  busy: { label: "Busy", className: "bg-amber-500/10 text-amber-600" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
  on_leave: { label: "On Leave", className: "bg-destructive/10 text-destructive" },
};

export function WorkerDetailsSkeleton() {
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

export function WorkerDetails({ workerId }) {
  const { data: worker, isLoading, isError, error } = useWorkerQuery(workerId);

  if (isLoading) return <WorkerDetailsSkeleton />;

  if (isError) {
    return (
      <div className="py-16 text-center">
        <Wrench size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-destructive mb-2">Failed to load worker details.</p>
        <p className="text-xs text-muted-foreground mb-4">{error?.message || "An unexpected error occurred."}</p>
        <Button asChild size="sm">
          <Link href="/dashboard/workers">Back to Workers</Link>
        </Button>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="py-16 text-center">
        <User size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">Worker not found.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/workers">Back to Workers</Link>
        </Button>
      </div>
    );
  }

  const user = worker.user || {};
  const statusLabel = STATUS_MAP[worker.status]?.label || worker.status;
  const statusClass = STATUS_MAP[worker.status]?.className || "";

  return (
    <div className="max-w-5xl">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
          <Link href="/dashboard/workers">
            <ArrowLeft size={16} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">{user.name || "Worker"}</h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{worker.employeeId}</span>
            <span>·</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
            >
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
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-muted-foreground shrink-0" />
                <span>{user.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground shrink-0" />
                <span>{user.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-muted-foreground shrink-0" />
                <span>Hired {worker.hireDate ? new Date(worker.hireDate).toLocaleDateString() : "—"}</span>
              </div>
              {worker.salary != null && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground shrink-0 w-3.5 flex justify-center">৳</span>
                  <span>Salary: ৳{worker.salary.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(worker.specializations?.length > 0 || worker.skills?.length > 0) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Award size={15} className="text-primary" />
                  Specializations & Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-3">
                {worker.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {worker.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {worker.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {worker.skills.map((s, i) => (
                      <span key={i} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {s.skill}
                        {s.level ? ` (${s.level})` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {worker.serviceAreas?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={15} className="text-primary" />
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="divide-y divide-border">
                  {worker.serviceAreas.map((area, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                      <span>{area.zone}</span>
                      {area.additionalFee > 0 && (
                        <span className="text-xs text-muted-foreground">+৳{area.additionalFee}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {worker.certifications?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Award size={15} className="text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="divide-y divide-border">
                  {worker.certifications.map((cert, i) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0">
                      <p className="font-medium">{cert.name}</p>
                      {cert.issuedBy && <p className="text-xs text-muted-foreground">{cert.issuedBy}</p>}
                      {(cert.issuedAt || cert.expiresAt) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cert.issuedAt ? `Issued: ${new Date(cert.issuedAt).toLocaleDateString()}` : ""}
                          {cert.issuedAt && cert.expiresAt ? " · " : ""}
                          {cert.expiresAt ? `Expires: ${new Date(cert.expiresAt).toLocaleDateString()}` : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Star size={15} className="text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium tabular-nums">
                  {worker.rating?.toFixed(1) || "—"} <span className="text-muted-foreground">/ 5</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium tabular-nums">{worker.reviewCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Jobs</span>
                <span className="font-medium tabular-nums">{worker.totalJobs || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium tabular-nums">{worker.completedJobs || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Response</span>
                <span className="font-medium tabular-nums">
                  {worker.averageResponseTime || 0} <span className="text-muted-foreground">min</span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={15} className="text-primary" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              {worker.availability ? (
                <div className="divide-y divide-border">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                    const slot = worker.availability[day];
                    return (
                      <div key={day} className="flex items-center justify-between py-1 first:pt-0 last:pb-0">
                        <span className="capitalize text-muted-foreground">{day.slice(0, 3)}</span>
                        <span className="text-xs tabular-nums">
                          {slot?.start && slot?.end ? `${slot.start} - ${slot.end}` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">Not set</p>
              )}
            </CardContent>
          </Card>

          {worker.vehicle?.make && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Car size={15} className="text-primary" />
                  Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-1">
                {worker.vehicle.type && <p className="text-muted-foreground">{worker.vehicle.type}</p>}
                <p className="font-medium">
                  {[worker.vehicle.make, worker.vehicle.model, worker.vehicle.year]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                {worker.vehicle.licensePlate && (
                  <p className="font-mono text-xs text-muted-foreground">{worker.vehicle.licensePlate}</p>
                )}
              </CardContent>
            </Card>
          )}

          {worker.tools?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Toolbox size={15} className="text-primary" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  {worker.tools.map((tool, i) => (
                    <span key={i} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
