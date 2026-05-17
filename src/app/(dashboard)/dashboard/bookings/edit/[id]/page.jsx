import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import { getBookingByIdServer } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function EditBookingPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  const { id } = await params;

  const booking = await getBookingByIdServer(id);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  const EditBookingForm = await import("@/components/dashboard/booking/edit-booking/edit-booking-form").then(
    (mod) => mod.default,
  );

  return <EditBookingForm booking={booking} isAdmin={user.role === "admin"} />;
}
