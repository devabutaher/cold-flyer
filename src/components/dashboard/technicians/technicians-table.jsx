"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { buildTechnicianColumns } from "./technicians-columns";
import { Wrench } from "lucide-react";
import { toast } from "sonner";

async function fetcher(url, options) {
  const res = await fetch(url, { credentials: "include", ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const mapRow = (t) => ({
  name: t.user?.name || "N/A",
  email: t.user?.email || "",
  employeeId: t.employeeId,
  specializations: (t.specializations || []).join(", "),
  status: t.status,
  rating: t.rating,
  completedJobs: t.completedJobs || 0,
});

const PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Email", accessorKey: "email", width: 2 },
  { header: "Employee ID", accessorKey: "employeeId", width: 1.2 },
  { header: "Specialization", accessorKey: "specializations", width: 1.5 },
  { header: "Status", accessorKey: "status", width: 0.8 },
  { header: "Rating", accessorKey: "rating", width: 0.6 },
  { header: "Jobs Done", accessorKey: "completedJobs", width: 0.8 },
];

export default function TechniciansTable() {
  const queryClient = useQueryClient();

  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ["admin-technicians"],
    queryFn: async () => {
      const res = await fetcher("/api/admin/technicians");
      return res?.data?.technicians || [];
    },
  });

  const deleteTechnician = useMutation({
    mutationFn: (id) => fetcher(`/api/admin/technicians/${id}`, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-technicians"] }); toast.success("Technician removed"); },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = async (id) => {
    if (!confirm("Remove this technician profile?")) return;
    deleteTechnician.mutate(id);
  };

  const columns = useMemo(() => buildTechnicianColumns({ onDelete: handleDelete }), []);

  const statusOptions = ["available", "busy", "offline", "on_leave"];

  return (
    <DataTable
      columns={columns}
      data={technicians}
      loading={isLoading}
      rowCount="technicians"
      defaultSort={[{ id: "name", desc: false }]}
      emptyMessage="No technicians found. Create one from the users page."
      emptyIcon={<Wrench size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search technicians..."
          selectedLabel="technicians"
          filters={[
            {
              columnId: "status",
              placeholder: "All Statuses",
              allLabel: "All Statuses",
              options: statusOptions,
            },
          ]}
          actions={
            <ExportMenu
              table={table}
              filename="technicians"
              mapRow={mapRow}
              pdfTitle="ColdFlyer — Technicians Report"
              pdfColumns={PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
