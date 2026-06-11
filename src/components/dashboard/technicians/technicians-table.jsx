"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { Button } from "@/components/ui/button";
import { buildTechnicianColumns } from "./technicians-columns";
import { AddWorkerSheet } from "./add-worker-sheet";
import { getClient } from "@/lib/http-client";
import { Wrench, Plus } from "lucide-react";
import { toast } from "sonner";

const mapRow = (t) => ({
  name: t.user?.name || "N/A",
  email: t.user?.email || "",
  employeeId: t.employeeId,
  specializations: (t.specializations || []).join(", "),
  serviceAreas: (t.serviceAreas || []).map((a) => a.zone).join(", ") || "—",
  status: t.status,
  rating: t.rating,
  completedJobs: t.completedJobs || 0,
  salary: t.salary || 0,
});

const PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Email", accessorKey: "email", width: 2 },
  { header: "Employee ID", accessorKey: "employeeId", width: 1.2 },
  { header: "Specialization", accessorKey: "specializations", width: 1.5 },
  { header: "Service Areas", accessorKey: "serviceAreas", width: 1.5 },
  { header: "Status", accessorKey: "status", width: 0.8 },
  { header: "Rating", accessorKey: "rating", width: 0.6 },
  { header: "Jobs Done", accessorKey: "completedJobs", width: 0.8 },
  { header: "Salary", accessorKey: "salary", width: 0.8 },
];

export default function TechniciansTable() {
  const queryClient = useQueryClient();
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ["admin-technicians"],
    queryFn: async () => {
      const res = await getClient().get("/admin/technicians");
      return res.data?.data?.technicians || [];
    },
  });

  const deleteTechnician = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/technicians/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-technicians"] });
      toast.success("Worker removed");
      setDeleteTarget(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message);
      setDeleteTarget(null);
    },
  });

  const handleDelete = useCallback(async (id) => {
    setDeleteTarget(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) deleteTechnician.mutate(deleteTarget);
  }, [deleteTarget, deleteTechnician]);

  const columns = useMemo(() => buildTechnicianColumns({ onDelete: handleDelete }), [handleDelete]);

  const statusOptions = ["available", "busy", "offline", "on_leave"];
  const specializationOptions = useMemo(() => {
    const all = technicians.flatMap((t) => t.specializations || []);
    return [...new Set(all)].sort();
  }, [technicians]);

  return (
    <>
      <DataTable
        columns={columns}
        data={technicians}
        loading={isLoading}
        rowCount="workers"
        defaultSort={[]}
        emptyMessage="No workers found."
        emptyIcon={<Wrench size={40} />}
        searchFields={["user.name", "user.email", "employeeId", "specializations", "serviceAreas", "status"]}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search workers..."
            selectedLabel="workers"
            filters={[
              {
                columnId: "status",
                placeholder: "All Statuses",
                allLabel: "All Statuses",
                options: statusOptions,
              },
              {
                columnId: "specializations",
                placeholder: "All Specializations",
                allLabel: "All Specializations",
                options: specializationOptions,
              },
            ]}
            actions={
              <>
                <Button onClick={() => setAddSheetOpen(true)}>
                  <Plus className="mr-1 size-4" />
                  Add Worker
                </Button>
                <ExportMenu
                  table={table}
                  filename="workers"
                  mapRow={mapRow}
                  pdfTitle="ColdFlyer — Workers Report"
                  pdfColumns={PDF_COLUMNS}
                />
              </>
            }
          />
        )}
      />
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this worker?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the worker profile. The linked user account will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleConfirmDelete}
              disabled={deleteTechnician.isPending}
            >
              {deleteTechnician.isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AddWorkerSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
    </>
  );
}
