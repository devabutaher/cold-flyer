"use client";

import { useAuth } from "@/components/providers";
import ServicesTable from "@/components/dashboard/service/services-table/services-table";

export default function ServicesPage() {
  const { backendUser } = useAuth();
  const isAdmin = backendUser?.role === "admin";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{isAdmin ? "All Services" : "Services"}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isAdmin
            ? "Manage your AC services and maintenance offerings."
            : "Browse available AC repair and maintenance services."}
        </p>
      </div>
      <ServicesTable isAdmin={isAdmin} />
    </div>
  );
}
