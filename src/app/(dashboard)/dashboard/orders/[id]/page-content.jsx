"use client";

import { useParams } from "next/navigation";
import { OrderDetails } from "@/components/dashboard/orders/order-details";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;

  return <OrderDetails orderId={orderId} />;
}
