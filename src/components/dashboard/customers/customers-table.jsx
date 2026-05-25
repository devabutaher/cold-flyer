"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { buildCustomerColumns } from "./customers-columns";
import { CustomerFormDialog } from "./customer-form-dialog";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

const mapRow = (c) => ({
  name: c.name,
  phone: c.phone || "—",
  brand: c.brand || "—",
  model: c.model || "—",
  unit: c.unit || "—",
  service: c.service || "—",
  installDate: c.installDate ? new Date(c.installDate).toLocaleDateString() : "—",
  amount: c.amount || 0,
  status: c.status || "active",
});

const PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Phone", accessorKey: "phone", width: 1.5 },
  { header: "Brand", accessorKey: "brand", width: 1.2 },
  { header: "Model", accessorKey: "model", width: 1.2 },
  { header: "Unit", accessorKey: "unit", width: 1 },
  { header: "Service", accessorKey: "service", width: 1 },
  { header: "Install Date", accessorKey: "installDate", width: 1 },
  { header: "Amount", accessorKey: "amount", width: 0.8 },
  { header: "Status", accessorKey: "status", width: 0.8 },
];

export default function CustomersTable() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const res = await getClient().get("/api/customers");
      return res.data?.data?.customers || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => getClient().delete(`/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Customer deleted.");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => getClient().patch(`/api/customers/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Customer status updated.");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleEdit = useCallback((customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (!confirm("Delete this customer?")) return;
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const handleToggleStatus = useCallback(
    (id) => {
      toggleStatusMutation.mutate(id);
    },
    [toggleStatusMutation],
  );

  const handleInvoice = useCallback((customer) => {
    // Placeholder – can be extended to generate invoice
    toast.info("Invoice generation coming soon.");
  }, []);

  const handleFormSuccess = useCallback(() => {
    setFormOpen(false);
    setEditingCustomer(null);
    queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
  }, [queryClient]);

  const columns = useMemo(
    () =>
      buildCustomerColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
        onInvoice: handleInvoice,
      }),
    [handleEdit, handleDelete, handleToggleStatus, handleInvoice],
  );

  const statusOptions = ["active", "blocked"];

  return (
    <>
      <CustomerFormDialog
        mode={editingCustomer ? "edit" : "create"}
        customer={editingCustomer}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingCustomer(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <DataTable
        columns={columns}
        data={customers}
        loading={isLoading}
        rowCount="customers"
        defaultSort={[]}
        emptyMessage="No customers found."
        emptyIcon={<Users size={40} />}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search customers..."
            selectedLabel="customers"
            filters={[
              {
                columnId: "status",
                placeholder: "All Statuses",
                allLabel: "All Statuses",
                options: statusOptions,
              },
            ]}
            actions={
              <>
                <Button size="sm" className="h-9 gap-1.5" onClick={() => setFormOpen(true)}>
                  <Plus size={14} />
                  Add Customer
                </Button>
                <ExportMenu
                  table={table}
                  filename="customers"
                  mapRow={mapRow}
                  pdfTitle="ColdFlyer — Customers Report"
                  pdfColumns={PDF_COLUMNS}
                />
              </>
            }
          />
        )}
      />
    </>
  );
}
