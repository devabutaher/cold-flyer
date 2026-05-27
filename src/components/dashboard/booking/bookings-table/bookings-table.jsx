"use client";

import { useMemo, useCallback } from "react";
import { DataTable } from "@/components/dashboard/table/data-table";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { buildBookingColumns } from "./booking-columns";
import { useBookingsQuery, useCancelBooking } from "@/hooks/queries/bookings";
import { ClipboardList } from "lucide-react";

const mapBookingRow = (b) => ({
  bookingNumber: b.bookingNumber,
  service: b.service?.name,
  customer: b.user?.name,
  technician: b.technician?.user?.name || b.technician?.employeeId || "—",
  scheduledDate: b.scheduledDate,
  total: b.total,
  status: b.status,
  paymentStatus: b.paymentStatus,
});

const BOOKING_PDF_COLUMNS = [
  { header: "Booking #", accessorKey: "bookingNumber", width: 1.5 },
  { header: "Service", accessorKey: "service", width: 2 },
  { header: "Customer", accessorKey: "customer", width: 1.5 },
  { header: "Technician", accessorKey: "technician", width: 1.5 },
  { header: "Date", accessorKey: "scheduledDate", width: 1.2 },
  { header: "Total (৳)", accessorKey: "total", width: 0.8 },
  { header: "Status", accessorKey: "status", width: 1 },
  { header: "Payment", accessorKey: "paymentStatus", width: 1 },
];

export default function BookingsTable({ isAdmin = false, userRole }) {
  const { data: bookings = [], isLoading: loading } = useBookingsQuery();
  const cancelBooking = useCancelBooking();

  const handleCancel = useCallback(
    async (id, reason) => {
      try {
        await cancelBooking.mutateAsync({ bookingId: id, reason: reason || "Customer request" });
      } catch {}
    },
    [cancelBooking],
  );

  const columns = useMemo(
    () => buildBookingColumns({ onCancel: handleCancel, isAdmin, userRole }),
    [handleCancel, isAdmin, userRole],
  );

  const paymentStatusOptions = useMemo(() => {
    const values = [...new Set(bookings.map((b) => b.paymentStatus).filter(Boolean))];
    return values.sort();
  }, [bookings]);

  return (
    <DataTable
      columns={columns}
      data={bookings}
      loading={loading}
      rowCount="bookings"
      defaultSort={[]}
      emptyMessage="No bookings found. Browse services to book one."
      emptyIcon={<ClipboardList size={40} />}
      searchFields={[
        "bookingNumber",
        "service.name",
        "user.name",
        "user.email",
        "user.phone",
        "technician.user.name",
        "technician.employeeId",
        "status",
        "paymentStatus",
      ]}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search bookings..."
          selectedLabel="bookings"
          filters={[
            {
              columnId: "status",
              placeholder: "All Statuses",
              allLabel: "All Statuses",
              options: ["pending", "confirmed", "scheduled", "in_progress", "completed", "cancelled"],
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
              filename="service-bookings"
              mapRow={mapBookingRow}
              pdfTitle="ColdFlyer — Service Bookings Report"
              pdfColumns={BOOKING_PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
