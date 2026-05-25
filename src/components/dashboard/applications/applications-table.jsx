"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { getClient } from "@/lib/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import ApplicationDetailSheet from "./application-detail-sheet";
import { buildApplicationColumns } from "./applications-columns";
import ApproveApplicationDialog from "./approve-application-dialog";
import RejectApplicationDialog from "./reject-application-dialog";

export default function ApplicationsTable() {
  const queryClient = useQueryClient();
  const [detailApp, setDetailApp] = useState(null);
  const [approveApp, setApproveApp] = useState(null);
  const [rejectApp, setRejectApp] = useState(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const res = await getClient().get("/admin/applications");
      return res.data?.data?.applications || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => getClient().patch(`/admin/applications/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-technicians"] });
      toast.success("Application approved. Technician profile created.");
      setApproveApp(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }) => getClient().patch(`/admin/applications/${id}/reject`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast.success("Application rejected.");
      setRejectApp(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast.success("Application deleted.");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleView = useCallback((app) => setDetailApp(app), []);
  const handleApprove = useCallback((app) => setApproveApp(app), []);
  const handleReject = useCallback((app) => setRejectApp(app), []);
  const handleDelete = useCallback((id) => deleteMutation.mutate(id), [deleteMutation]);

  const columns = useMemo(
    () => buildApplicationColumns({ onView: handleView, onApprove: handleApprove, onReject: handleReject, onDelete: handleDelete }),
    [handleView, handleApprove, handleReject, handleDelete],
  );

  const statusOptions = ["pending", "approved", "rejected"];

  return (
    <>
      <DataTable
        columns={columns}
        data={applications}
        loading={isLoading}
        rowCount="applications"
        defaultSort={[]}
        emptyMessage="No applications found."
        emptyIcon={<FileText size={40} />}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search applicants..."
            selectedLabel="applications"
            filters={[
              {
                columnId: "status",
                placeholder: "All Statuses",
                allLabel: "All Statuses",
                options: statusOptions,
              },
            ]}
          />
        )}
      />

      <ApplicationDetailSheet
        application={detailApp}
        open={!!detailApp}
        onOpenChange={(open) => !open && setDetailApp(null)}
        onApprove={(app) => {
          setDetailApp(null);
          setApproveApp(app);
        }}
        onReject={(app) => {
          setDetailApp(null);
          setRejectApp(app);
        }}
      />

      <ApproveApplicationDialog
        application={approveApp}
        open={!!approveApp}
        onOpenChange={(open) => !open && setApproveApp(null)}
        onConfirm={() => approveMutation.mutate(approveApp._id)}
        loading={approveMutation.isPending}
      />

      <RejectApplicationDialog
        application={rejectApp}
        open={!!rejectApp}
        onOpenChange={(open) => !open && setRejectApp(null)}
        onConfirm={(notes) => rejectMutation.mutate({ id: rejectApp._id, notes })}
        loading={rejectMutation.isPending}
      />
    </>
  );
}
