"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MoreHorizontal, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge, MonoCell } from "@/components/dashboard/table/table-cells";
import Link from "next/link";

const STATUS_MAP = {
  available: { label: "Available", className: "bg-green-500/10 text-green-600" },
  busy: { label: "Busy", className: "bg-amber-500/10 text-amber-600" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
  on_leave: { label: "On Leave", className: "bg-destructive/10 text-destructive" },
};

export function buildWorkerColumns({ onDelete } = {}) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      header: "Worker",
      accessorKey: "user",
      cell: ({ row }) => {
        const w = row.original;
        const user = w.user || {};
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {(user.name || "W").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{user.name || "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Employee ID",
      accessorKey: "employeeId",
      cell: ({ row }) => {
        const w = row.original;
        return <span className="font-mono text-xs">{w.employeeId || "—"}</span>;
      },
    },
    {
      header: "Specialization",
      accessorKey: "specializations",
      cell: ({ row }) => {
        const w = row.original;
        const specs = w.specializations || [];
        return specs.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {specs.slice(0, 2).map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">
                {s}
              </Badge>
            ))}
            {specs.length > 2 && (
              <span className="text-xs text-muted-foreground">+{specs.length - 2} more</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const w = row.original;
        const s = STATUS_MAP[w.status] || { label: w.status, className: "bg-muted text-muted-foreground" };
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${w.status === "available" ? "bg-green-500" : w.status === "busy" ? "bg-amber-500" : "bg-muted-foreground"}`} />
            {s.label}
          </span>
        );
      },
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => {
        const w = row.original;
        return <span className="tabular-nums text-sm">{w.rating?.toFixed(1) || "—"}</span>;
      },
    },
    {
      header: "Salary",
      accessorKey: "salary",
      cell: ({ row }) => {
        const w = row.original;
        return (
          <span className="tabular-nums text-sm">
            {w.salary != null ? `৳${w.salary.toLocaleString()}` : "—"}
          </span>
        );
      },
    },
    {
      header: "Jobs Done",
      accessorKey: "completedJobs",
      cell: ({ row }) => {
        const w = row.original;
        return (
          <span className="tabular-nums text-sm">
            {w.completedJobs != null ? w.completedJobs : "—"}
          </span>
        );
      },
    },
    {
      header: "Service Areas",
      accessorKey: "serviceAreas",
      cell: ({ row }) => {
        const w = row.original;
        const areas = w.serviceAreas || [];
        return (
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {areas.length > 0 ? areas.map((a, i) => <span key={i}>{a}{i < areas.length - 1 ? ", " : ""}</span>) : "—"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const w = row.original;
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={14} />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/workers/${w._id}`} className="flex items-center w-full">
                    <Eye size={14} className="mr-3" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 size={14} className="mr-3" />
                    Remove
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Worker</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this worker profile?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete?.(w._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
}
