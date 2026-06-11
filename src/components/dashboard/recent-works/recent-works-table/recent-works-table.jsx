"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { useDeleteRecentWork, useRecentWorksQuery } from "@/hooks/queries/recentWorks";
import { Briefcase } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { buildRecentWorkColumns } from "./recent-work-columns";
import { RecentWorkRowActions } from "./recent-work-row-actions";

export default function RecentWorksTable({ isAdmin = false }) {
  const { data: recentWorks = [], isLoading: loading, error } = useRecentWorksQuery({ limit: 100 });
  const deleteRecentWork = useDeleteRecentWork();

  const checkAdminAccess = useCallback(() => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  }, [isAdmin]);

  const handleDelete = useCallback(
    async (id) => {
      if (!checkAdminAccess()) return;
      try {
        await deleteRecentWork.mutateAsync(id);
      } catch {}
    },
    [deleteRecentWork, checkAdminAccess],
  );

  const columns = useMemo(
    () => [
      ...buildRecentWorkColumns({ onDelete: handleDelete }),
      {
        id: "actions",
        cell: ({ row }) => <RecentWorkRowActions work={row.original} isAdmin={isAdmin} />,
      },
    ],
    [handleDelete, isAdmin],
  );

  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(recentWorks, "category");
  const featuredOptions = ["true", "false"];

  return (
    <DataTable
      columns={columns}
      data={recentWorks}
        loading={loading}
        error={error}
        rowCount="works"
      defaultSort={[{ id: "createdAt", desc: true }]}
      emptyMessage="No recent works found. Add your first project to get started."
      emptyIcon={<Briefcase size={40} />}
      searchFields={["title", "category", "clientName", "description"]}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search works..."
          selectedLabel="works"
          filters={[
            {
              columnId: "category",
              placeholder: "All Categories",
              allLabel: "All Categories",
              options: categoriesOptions,
            },
            {
              columnId: "featured",
              placeholder: "All Featured",
              allLabel: "All Featured",
              options: featuredOptions,
            },
          ]}
        />
      )}
    />
  );
}
