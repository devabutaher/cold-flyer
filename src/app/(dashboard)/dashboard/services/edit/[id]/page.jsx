import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import EditServiceForm from "@/components/dashboard/service/edit-service/edit-service-form";
import { getServiceBySlugServer } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const service = await getServiceBySlugServer(id);
    return {
      title: service?.name ? `Edit ${service.name} | ColdFlyer` : "Edit Service | ColdFlyer",
    };
  } catch {
    return { title: "Edit Service | ColdFlyer" };
  }
}

export default async function EditServicePage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const { id } = await params;

  let service = null;
  try {
    service = await getServiceBySlugServer(id);
  } catch (error) {
    console.error("Failed to fetch service:", error);
  }

  if (!service) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">Service not found</p>
      </div>
    );
  }

  return <EditServiceForm service={service} isAdmin={user.role === "admin"} />;
}
