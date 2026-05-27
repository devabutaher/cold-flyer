import { getServiceByIdServer } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

export default async function PublicBookingPage({ params }) {
  const { serviceId } = await params;

  const service = await getServiceByIdServer(serviceId);

  const AddBookingForm = await import("@/components/dashboard/booking/add-booking/add-booking-form").then(
    (mod) => mod.default,
  );

  return (
    <div className="container py-8">
      <AddBookingForm serviceId={serviceId} serviceName={service?.name || undefined} guestMode={true} />
    </div>
  );
}
