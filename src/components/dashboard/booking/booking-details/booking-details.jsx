"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

import {
  CompleteBookingDialog,
  ConfirmBookingDialog,
  ScheduleBookingDialog,
  StartServiceDialog,
} from "@/components/dashboard/booking/admin-actions/admin-booking-actions";
import { ReviewDialog } from "@/components/dashboard/booking/review/review-dialog";
import { PriceCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBookingQuery } from "@/hooks/queries/bookings";
import { getClient } from "@/lib/http-client";
import { BookingCancelDialog } from "./booking-cancel-dialog";
import { BookingDetailSkeleton } from "./booking-detail-skeleton";
import { BookingHeader } from "./booking-header";
import { DetailCard } from "./detail-card";

import {
  CalendarDays,
  Camera,
  ClipboardList,
  Clock,
  FileText,
  Hash,
  Home,
  MapPin,
  Package,
  PencilLine,
  Phone,
  Smartphone,
  Star,
  User,
  Wrench,
} from "lucide-react";

const PAYMENT_STATUS_MAP = {
  paid: { label: "Paid", className: "bg-green-500/10 text-green-600" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  partial: { label: "Partial", className: "bg-blue-500/10 text-blue-600" },
};

const SOURCE_LABELS = {
  website: "Website",
  mobile_app: "Mobile App",
  phone: "Phone Call",
  admin: "Admin Panel",
};

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingDetails({ bookingId }) {
  const { data: booking, isLoading, isError, error, refetch } = useBookingQuery(bookingId);
  const { backendUser } = useAuth();
  const userRole = backendUser?.role;
  const canManage = ["admin", "moderator"].includes(userRole);
  const canOperate = ["admin", "moderator", "worker"].includes(userRole);

  const { data: workers = [] } = useQuery({
    queryKey: ["admin-workers"],
    queryFn: async () => {
      const res = await getClient().get("/admin/workers?limit=100");
      return res.data?.data?.workers || [];
    },
    enabled: canManage,
  });

  if (isLoading) return <BookingDetailSkeleton />;

  if (isError) {
    return (
      <div className="py-16 text-center">
        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-destructive mb-2">Failed to load booking details.</p>
        <p className="text-xs text-muted-foreground mb-4">{error?.message || "An unexpected error occurred."}</p>
        <Button asChild size="sm">
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center">
        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">Booking not found.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed", "scheduled", "in_progress"].includes(booking.status);
  const hasItems = booking.items?.length > 0;
  const hasParts = booking.partsUsed?.length > 0;
  const hasCharges = booking.additionalCharges?.length > 0;
  const hasPhotos = booking.afterPhotos?.length > 0;
  const hasReview = booking.status === "completed" && (booking.customerRating || booking.customerReview);

  return (
    <div className="max-w-5xl">
      <BookingHeader booking={booking} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <DetailCard icon={<CalendarDays size={15} className="text-primary" />} title="Schedule">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-muted-foreground shrink-0" />
              <span>{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Not scheduled"}</span>
            </div>
            {booking.scheduledTime?.start && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground shrink-0" />
                <span>
                  {booking.scheduledTime.start} - {booking.scheduledTime.end}
                </span>
              </div>
            )}
            {booking.worker && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-muted-foreground shrink-0" />
                <span>
                  Worker: {booking.worker?.employeeId || booking.worker?._id?.slice(-6).toUpperCase()}
                </span>
              </div>
            )}
            {booking.completedAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={12} className="shrink-0" />
                <span>Completed: {formatDateTime(booking.completedAt)}</span>
              </div>
            )}
          </DetailCard>

          {booking.propertyDetails?.propertyType || booking.propertyDetails?.issues?.length > 0 ? (
            <DetailCard icon={<Home size={15} className="text-primary" />} title="Property Details">
              {booking.propertyDetails?.propertyType && (
                <p>
                  <span className="font-medium">Type:</span> {booking.propertyDetails.propertyType}
                </p>
              )}
              {booking.propertyDetails?.issues?.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Issues:</p>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                    {booking.propertyDetails.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </DetailCard>
          ) : null}

          {(booking.acBrand || booking.acModel || booking.acTon || booking.acGasType || booking.acType) && (
            <DetailCard icon={<Wrench size={15} className="text-primary" />} title="AC Unit">
              {booking.acBrand && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{booking.acBrand}</span>
                </div>
              )}
              {booking.acModel && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span>{booking.acModel}</span>
                </div>
              )}
              {booking.acTon && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ton</span>
                  <span>{booking.acTon}</span>
                </div>
              )}
              {booking.acGasType && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas Type</span>
                  <span>{booking.acGasType}</span>
                </div>
              )}
              {booking.acType && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AC Type</span>
                  <span className="capitalize">{booking.acType}</span>
                </div>
              )}
            </DetailCard>
          )}

          {booking.serviceAddress && (
            <DetailCard icon={<MapPin size={15} className="text-primary" />} title="Service Address">
              {booking.serviceAddress.fullName && (
                <p className="font-medium text-foreground">{booking.serviceAddress.fullName}</p>
              )}
              {booking.serviceAddress.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone size={13} className="text-muted-foreground shrink-0" />
                  {booking.serviceAddress.phone}
                </p>
              )}
              {booking.serviceAddress.address && <p>{booking.serviceAddress.address}</p>}
              {(booking.serviceAddress.thana || booking.serviceAddress.district) && (
                <p>{[booking.serviceAddress.thana, booking.serviceAddress.district].filter(Boolean).join(", ")}</p>
              )}
            </DetailCard>
          )}

          {(hasItems || hasParts || hasCharges) && (
            <DetailCard
              icon={<Package size={15} className="text-primary" />}
              title="Service Items"
              action={
                hasItems && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {booking.items.length} {booking.items.length === 1 ? "item" : "items"}
                  </span>
                )
              }
            >
              {hasItems && (
                <div className="divide-y divide-border">
                  {booking.items.map((item, i) => (
                    <div key={item._id ?? i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <PriceCell price={item.price * item.quantity} />
                    </div>
                  ))}
                </div>
              )}
              {hasParts && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Parts Used
                  </p>
                  <div className="divide-y divide-border">
                    {booking.partsUsed.map((part, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-sm">{part.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {part.quantity}</p>
                        </div>
                        {part.cost > 0 && <PriceCell price={part.cost * part.quantity} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hasCharges && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Additional Charges
                  </p>
                  <div className="divide-y divide-border">
                    {booking.additionalCharges.map((charge, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                        <p className="text-sm">{charge.description}</p>
                        {charge.amount > 0 && <PriceCell price={charge.amount} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DetailCard>
          )}

          {(booking.diagnosis || booking.workDone) && (
            <DetailCard icon={<Wrench size={15} className="text-primary" />} title="Diagnosis & Work Done">
              {booking.diagnosis && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Diagnosis
                  </p>
                  <p className="text-muted-foreground">{booking.diagnosis}</p>
                </div>
              )}
              {booking.workDone && (
                <div className={booking.diagnosis ? "mt-3" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Work Done
                  </p>
                  <p className="text-muted-foreground">{booking.workDone}</p>
                </div>
              )}
            </DetailCard>
          )}

          {hasPhotos && (
            <DetailCard
              icon={<Camera size={15} className="text-primary" />}
              title="After Photos"
              action={
                <span className="text-xs font-normal text-muted-foreground">
                  {booking.afterPhotos.length} {booking.afterPhotos.length === 1 ? "photo" : "photos"}
                </span>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {booking.afterPhotos.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`After photo ${i + 1}`}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                  </a>
                ))}
              </div>
            </DetailCard>
          )}

          {(booking.notes || (booking.internalNotes && canManage)) && (
            <DetailCard icon={<FileText size={15} className="text-primary" />} title="Notes">
              {booking.notes && (
                <div>
                  {booking.internalNotes && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      Customer Notes
                    </p>
                  )}
                  <p className="text-muted-foreground">{booking.notes}</p>
                </div>
              )}
              {booking.internalNotes && canManage && (
                <div className={booking.notes ? "mt-3" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Internal Notes
                  </p>
                  <p className="text-muted-foreground italic">{booking.internalNotes}</p>
                </div>
              )}
            </DetailCard>
          )}

          {booking.warrantyInfo && (
            <DetailCard icon={<Hash size={15} className="text-primary" />} title="Warranty">
              <p className="text-muted-foreground">{booking.warrantyInfo}</p>
            </DetailCard>
          )}

          {hasReview && (
            <DetailCard icon={<Star size={15} className="text-primary" />} title="Customer Review">
              {booking.customerRating && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={star <= booking.customerRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className={star <= booking.customerRating ? "text-yellow-500" : "text-muted-foreground/30"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              )}
              {booking.customerReview && (
                <p className="text-muted-foreground italic">&ldquo;{booking.customerReview}&rdquo;</p>
              )}
            </DetailCard>
          )}
        </div>

        <div className="space-y-5">
          <DetailCard icon={<span className="text-primary font-bold">৳</span>} title="Summary">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceCell price={booking.subtotal} />
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <PriceCell price={-booking.discount} className="text-green-600" />
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <PriceCell price={booking.total} />
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-muted-foreground">Payment</span>
              <StatusBadge value={booking.paymentStatus} map={PAYMENT_STATUS_MAP} />
            </div>
          </DetailCard>

          <DetailCard icon={<User size={15} className="text-primary" />} title="Booking Info">
            {canManage && (booking.user || booking.customerName) && (
              <div className="space-y-1 pb-2 mb-2 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Customer</p>
                {booking.user ? (
                  <>
                    <p className="font-medium">{booking.user.name || "—"}</p>
                    {booking.user.email && <p className="text-xs text-muted-foreground">{booking.user.email}</p>}
                    {booking.user.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Smartphone size={11} /> {booking.user.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-medium">{booking.customerName || "—"}</p>
                    {booking.customerEmail && <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>}
                    {booking.customerPhone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Smartphone size={11} /> {booking.customerPhone}
                      </p>
                    )}
                    <p className="text-xs italic text-muted-foreground mt-1">Guest booking</p>
                  </>
                )}
              </div>
            )}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Source</span>
                <span>{SOURCE_LABELS[booking.source] || booking.source || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDateTime(booking.createdAt)}</span>
              </div>
              {booking.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDateTime(booking.updatedAt)}</span>
                </div>
              )}
            </div>
          </DetailCard>

          <div className="space-y-2">
            {booking.status !== "cancelled" && (
              <>
                {booking.status === "pending" && canManage && (
                  <ConfirmBookingDialog
                    booking={booking}
                    onSuccess={refetch}
                    triggerClassName="w-full"
                    triggerVariant="default"
                  />
                )}
                {booking.status === "confirmed" && canManage && (
                  <ScheduleBookingDialog
                    booking={booking}
                    onSuccess={refetch}
                    workers={workers}
                    triggerClassName="w-full"
                    triggerVariant="default"
                  />
                )}
                {booking.status === "scheduled" && canOperate && (
                  <StartServiceDialog
                    booking={booking}
                    onSuccess={refetch}
                    triggerClassName="w-full"
                    triggerVariant="default"
                  />
                )}
                {booking.status === "in_progress" && canOperate && (
                  <CompleteBookingDialog
                    booking={booking}
                    onSuccess={refetch}
                    triggerClassName="w-full"
                    triggerVariant="default"
                  />
                )}
              </>
            )}
            {booking.status === "completed" && (
              <div className="w-full">
                <ReviewDialog booking={booking} onSuccess={refetch} />
              </div>
            )}
            {canManage && booking.status !== "cancelled" && (
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href={`/dashboard/bookings/edit/${booking._id}`}>
                  <PencilLine size={14} />
                  Edit Booking
                </Link>
              </Button>
            )}
            {canCancel && <BookingCancelDialog booking={booking} />}
          </div>
        </div>
      </div>
    </div>
  );
}
