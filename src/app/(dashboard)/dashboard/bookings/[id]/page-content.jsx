"use client";

import { useParams } from "next/navigation";
import { BookingDetails } from "@/components/dashboard/booking/booking-details";

export default function BookingDetailPage() {
  return <BookingDetails bookingId={useParams().id} />;
}
