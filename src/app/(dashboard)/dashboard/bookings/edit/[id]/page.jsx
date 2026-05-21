import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
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

function getPath(h) {
  return h.get("x-invoke-path") || h.get("next-url") || "";
}

export default async function EditBookingPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = getPath(h);
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user) {
    const h = await headers();
    const p = getPath(h);
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  if (user.role !== "admin") {
    redirect("/");
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
