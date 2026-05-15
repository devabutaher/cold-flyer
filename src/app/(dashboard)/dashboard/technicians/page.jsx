"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { Wrench, Loader2, Star, MapPin } from "lucide-react";

async function fetcher(url) {
  const res = await fetch(url, { credentials: "include" });
  const data = await res.json();
  return data?.data?.technicians || [];
}

const STATUS_MAP = {
  available: { label: "Available", className: "bg-green-500/10 text-green-600" },
  busy: { label: "Busy", className: "bg-amber-500/10 text-amber-600" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
  on_leave: { label: "On Leave", className: "bg-destructive/10 text-destructive" },
};

export default function TechniciansPage() {
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ["admin-technicians"],
    queryFn: () => fetcher("/api/admin/technicians"),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Technicians</h1>
        <p className="text-sm text-muted-foreground">View and manage service technicians</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : technicians.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No technicians found.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Jobs Done</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicians.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Wrench className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.user?.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{t.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{(t.specializations || []).join(", ") || "—"}</span>
                    </TableCell>
                    <TableCell><StatusBadge value={t.status} map={STATUS_MAP} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{t.rating?.toFixed(1) || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm font-medium">{t.completedJobs || 0}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
