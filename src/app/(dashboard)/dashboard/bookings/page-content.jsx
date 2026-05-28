"use client";

import { useAuth } from "@/components/providers";
import BookingsTable from "@/components/dashboard/booking/bookings-table/bookings-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function BookingsPage() {
  const { backendUser } = useAuth();
  const userRole = backendUser?.role;
  const isAdmin = ["admin", "moderator"].includes(userRole);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{isAdmin ? "All Bookings" : "My Bookings"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin ? "Manage all service bookings." : "View your AC service bookings."}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/services">
            <PlusIcon size={14} className="mr-1" />
            Book a Service
          </Link>
        </Button>
      </div>
      <BookingsTable isAdmin={isAdmin} userRole={userRole} />
    </div>
  );
}
