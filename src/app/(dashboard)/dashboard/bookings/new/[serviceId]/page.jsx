import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getServiceByIdServer } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

function getPath(h) {
  return h.get("x-invoke-path") || h.get("next-url") || "";
}

export default async function NewBookingPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = getPath(h);
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const { serviceId } = await params;

  const service = await getServiceByIdServer(serviceId);

  const AddBookingForm = await import("@/components/dashboard/booking/add-booking/add-booking-form").then(
    (mod) => mod.default,
  );

  return <AddBookingForm serviceId={serviceId} serviceName={service?.name || undefined} />;
}
