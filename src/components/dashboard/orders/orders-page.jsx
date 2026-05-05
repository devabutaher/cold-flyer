"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/lib/api/orders";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { buildOrderColumns } from "./orders-table/order-columns";

// Fields written to every export format
const mapOrderRow = (o) => ({
  order: o.orderNumber ?? o._id?.slice(-8).toUpperCase(),
  date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—",
  items: o.itemCount ?? 0,
  total: o.total ?? 0,
  status: o.status,
  paymentStatus: o.paymentStatus,
});

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);

  // ── Data fetching ──────────────────────────────────
  // Defined outside useEffect so handleCancel can call it on failure,
  // but NOT wrapped in useCallback to avoid the cascading-setState lint error.
  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await ordersApi.getOrders();
      setOrders(res.data?.orders ?? []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  // Initial load — stable reference: fetchOrders is a plain function, not reactive
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  // ── Handlers ───────────────────────────────────────
  const handlePay = async (orderId) => {
    setPayingOrderId(orderId);
    try {
      const res = await ordersApi.createPaymentLink(orderId);
      if (res.success && res.data?.checkoutUrl) {
        router.push(res.data.checkoutUrl);
      } else {
        toast.success("Payment link created! You can pay later.");
      }
    } catch {
      toast.error("Failed to create payment");
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await ordersApi.cancelOrder(orderId);
      toast.success("Order cancelled");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      toast.error("Failed to cancel order");
      fetchOrders();
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
          <Button asChild size="sm">
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
              },
              {
                columnId: "paymentStatus",
                placeholder: "All Payments",
                allLabel: "All Payments",
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
