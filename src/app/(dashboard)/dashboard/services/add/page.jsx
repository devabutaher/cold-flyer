import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import api from "@/lib/api/master";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await api.getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function AddServicePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const AddServiceForm = await import("@/components/dashboard/service/add-service/add-service-form").then(
    (mod) => mod.default,
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <AddServiceForm isAdmin={user.role === "admin"} />
    </div>
  );
}
