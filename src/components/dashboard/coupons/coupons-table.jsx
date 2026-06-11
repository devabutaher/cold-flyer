"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Percent, PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { buildCouponColumns } from "./coupons-columns";
import { CouponFormDialog } from "./coupon-form-dialog";

const mapRow = (c) => ({
  code: c.code,
  discount: c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`,
  type: c.discountType,
  usage: `${c.usedCount || 0}${c.maxUsage ? ` / ${c.maxUsage}` : ""}`,
  validFrom: c.validFrom ? new Date(c.validFrom).toLocaleDateString() : "—",
  validUntil: c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "—",
  status: c.isActive ? "Active" : "Inactive",
});

const PDF_COLUMNS = [
  { header: "Code", accessorKey: "code", width: 1.5 },
  { header: "Discount", accessorKey: "discount", width: 1 },
  { header: "Type", accessorKey: "type", width: 1 },
  { header: "Usage", accessorKey: "usage", width: 1 },
  { header: "Valid From", accessorKey: "validFrom", width: 1.2 },
  { header: "Valid Until", accessorKey: "validUntil", width: 1.2 },
  { header: "Status", accessorKey: "status", width: 0.8 },
];

export default function CouponsTable() {
  const queryClient = useQueryClient();
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { data: coupons = [], isLoading, error } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await getClient().get("/admin/coupons");
      return res.data?.data?.coupons || res.data?.coupons || [];
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Delete this coupon?")) return;
      deleteCoupon.mutate(id);
    },
    [deleteCoupon],
  );

  const columns = useMemo(
    () => buildCouponColumns({ onDelete: handleDelete, onEdit: setEditingCoupon }),
    [handleDelete],
  );

  const typeOptions = ["percentage", "fixed", "free_shipping"];
  const statusOptions = ["true", "false"];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount coupons</p>
        </div>
        <CouponFormDialog
          mode="create"
          trigger={
            <Button size="sm">
              <PlusIcon size={14} className="mr-1" /> Add Coupon
            </Button>
          }
        />
      </div>

      {editingCoupon && (
        <CouponFormDialog
          key={editingCoupon._id}
          mode="edit"
          coupon={editingCoupon}
          open={!!editingCoupon}
          onOpenChange={(open) => !open && setEditingCoupon(null)}
          onSuccess={() => setEditingCoupon(null)}
        />
      )}

      <DataTable
        columns={columns}
        data={coupons}
        loading={isLoading}
        error={error}
        rowCount="coupons"
        defaultSort={[]}
        emptyMessage="No coupons yet. Create your first coupon."
        emptyIcon={<Percent size={40} />}
        searchFields={["code", "discountValue", "discountType", "minOrderAmount", "maxUsage"]}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search coupons..."
            selectedLabel="coupons"
            filters={[
              { columnId: "discountType", placeholder: "All Types", allLabel: "All Types", options: typeOptions },
              { columnId: "isActive", placeholder: "All Statuses", allLabel: "All Statuses", options: statusOptions },
            ]}
            actions={
              <ExportMenu
                table={table}
                filename="coupons"
                mapRow={mapRow}
                pdfTitle="ColdFlyer — Coupons Report"
                pdfColumns={PDF_COLUMNS}
              />
            }
          />
        )}
      />
    </>
  );
}
