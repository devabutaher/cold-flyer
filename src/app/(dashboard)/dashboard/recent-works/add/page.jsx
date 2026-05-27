import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Recent Work | ColdFlyer",
  description: "Add a new completed project to your portfolio.",
};

export default async function AddRecentWorkPage() {
  const user = await getCurrentUser();

  if (!user || !["admin", "moderator"].includes(user.role)) {
    redirect("/");
  }

  const isAdmin = user.role === "admin";

  const AddRecentWorkForm =
    await import("@/components/dashboard/recent-works/add-recent-work/add-recent-work-form").then((mod) => mod.default);

  return (
    <div className="flex-1 space-y-6 p-6">
      <AddRecentWorkForm isAdmin={isAdmin} />
    </div>
  );
}
