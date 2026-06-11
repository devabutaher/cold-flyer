"use client";

import { useAuth } from "@/components/providers";
import { AdminOverview } from "./admin-overview";
import { ModeratorOverview } from "./moderator-overview";
import { WorkerOverview } from "./worker-overview";
import { CustomerOverview } from "./customer-overview";

export default function DashboardHome() {
  const { backendUser } = useAuth();
  const role = backendUser?.role;

  switch (role) {
    case "admin":
      return <AdminOverview />;
    case "moderator":
      return <ModeratorOverview />;
    case "worker":
      return <WorkerOverview />;
    case "customer":
      return <CustomerOverview />;
    default:
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
          </div>
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Use the sidebar to navigate to your available sections.</p>
          </div>
        </div>
      );
  }
}
