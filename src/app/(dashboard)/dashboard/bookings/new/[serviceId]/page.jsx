import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import { getServiceByIdServer } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function NewBookingPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  const { serviceId } = await params;

  const service = await getServiceByIdServer(serviceId);

  const AddBookingForm = await import("@/components/dashboard/booking/add-booking/add-booking-form").then(
    (mod) => mod.default,
  );

  return (
    <div className="container mx-auto py-8">
      <AddBookingForm serviceId={serviceId} serviceName={service?.name || undefined} />
    </div>
  );
}
