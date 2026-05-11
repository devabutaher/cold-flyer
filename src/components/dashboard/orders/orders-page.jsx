"use client";

import { Button } from "@/components/ui/button";
import { useOrdersQuery, useCancelOrder } from "@/hooks/queries";
import { apiPost } from "@/lib/api-client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "../table/data-table";
import { ExportMenu } from "../table/export-menu";
import { TableToolbar } from "../table/table-toolbar";
import { buildOrderColumns } from "./orders-table/order-columns";

const mapOrderRow = (o) => ({
  order: o.orderNumber ?? o._id?.slice(-8).toUpperCase(),
  date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—",
  items: o.itemCount ?? 0,
  total: o.total ?? 0,
  status: o.status,
  paymentStatus: o.paymentStatus,
});

export default function OrdersPage({ isAdmin = false }) {
  const router = useRouter();
  const [payingOrderId, setPayingOrderId] = useState(null);
  const {
    data: ordersData = [],
    isLoading: loading,
    refetch,
  } = useOrdersQuery();
  const cancelOrder = useCancelOrder();
  const orders = ordersData ?? [];

  // ── Handlers ───────────────────────────────────────
  const handlePay = async (orderId) => {
    setPayingOrderId(orderId);
    try {
      const res = await apiPost(`/orders/${orderId}/checkout`, {});
      if (res.success && res.data?.checkoutUrl) {
        router.push(res.data.checkoutUrl);
      }
    } catch {
      console.error("Failed to create payment");
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder.mutateAsync({ orderId, reason: "Cancelled by admin" });
      refetch();
    } catch {
      console.error("Failed to cancel order");
    }
  };

  // Columns rebuilt only when payingOrderId changes
  const columns = useMemo(
    () =>
      buildOrderColumns({
        onPay: handlePay,
        onCancel: handleCancel,
        payingOrderId,
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payingOrderId],
  );

  // Extract unique statuses from data
  const statusOptions = [
    ...new Set(orders.map((o) => o.status).filter(Boolean)),
  ].sort();
  const paymentStatusOptions = [
    ...new Set(orders.map((o) => o.paymentStatus).filter(Boolean)),
  ].sort();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track and manage your purchase history.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        rowCount="orders"
        defaultSort={[{ id: "createdAt", desc: true }]}
        emptyMessage="You haven't placed any orders yet."
        emptyIcon={<ShoppingBag size={40} />}
        emptyAction={
          <Button asChild size="sm" animate={false}>
            <Link href="/items">Start Shopping</Link>
          </Button>
        }
        onRowClick={(order) => router.push(`/dashboard/orders/${order._id}`)}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search orders…"
            selectedLabel="orders"
            filters={[
              {
                columnId: "status",
                placeholder: "All Statuses",
                allLabel: "All Statuses",
                options: statusOptions,
              },
              {
                columnId: "paymentStatus",
                placeholder: "All Payments",
                allLabel: "All Payments",
                options: paymentStatusOptions,
              },
            ]}
            actions={
              <ExportMenu
                table={table}
                filename="my-orders"
                mapRow={mapOrderRow}
                pdfTitle="My Orders"
                pdfColumns={[
                  { header: "Order", accessorKey: "order", width: 1.2 },
                  { header: "Date", accessorKey: "date", width: 1 },
                  { header: "Items", accessorKey: "items", width: 0.6 },
                  { header: "Total", accessorKey: "total", width: 0.8 },
                  { header: "Status", accessorKey: "status", width: 1 },
                  { header: "Payment", accessorKey: "paymentStatus", width: 1 },
                ]}
              />
            }
          />
        )}
      />
    </>
  );
}
