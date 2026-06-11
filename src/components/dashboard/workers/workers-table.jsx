"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { AddWorkerSheet } from "./add-worker-sheet";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function WorkersTable() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: workers = [], isLoading, error } = useQuery({
    queryKey: ["admin-workers"],
    queryFn: async () => {
      const res = await getClient().get("/admin/workers");
      return res.data?.data?.workers || [];
    },
  });

  const deleteWorker = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/workers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workers"] });
      setDeleteTarget(null);
    },
  });

  const handleDelete = useCallback((id) => {
    setDeleteTarget(id);
  }, []);

  useEffect(() => {
    if (deleteTarget) deleteWorker.mutate(deleteTarget);
  }, [deleteTarget, deleteWorker]);

  const columns = useMemo(() => {
    const { buildWorkerColumns } = require("./workers-columns");
    return buildWorkerColumns({ onDelete: handleDelete });
  }, [handleDelete]);

  const filterOptions = useMemo(() => {
    const all = workers.flatMap((w) => w.specializations || []);
    return [...new Set(all)].map((s) => ({ label: s, value: s }));
  }, [workers]);

  return (
    <div className="space-y-4">
      <TableToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        filterOptions={filterOptions}
        filterColumn="specializations"
        filterPlaceholder="Filter by specialization"
        searchPlaceholder="Search workers..."
      >
        <AddWorkerSheet
          trigger={
            <Button size="sm">
              <UserPlus size={14} className="mr-1.5" />
              Add Worker
            </Button>
          }
        />
      </TableToolbar>

      <DataTable
        columns={columns}
        data={workers}
        isLoading={isLoading}
        error={error}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {deleteWorker.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-card p-6 text-center shadow-lg">
            <p className="text-sm font-medium">Removing worker profile…</p>
          </div>
        </div>
      )}
    </div>
  );
}
