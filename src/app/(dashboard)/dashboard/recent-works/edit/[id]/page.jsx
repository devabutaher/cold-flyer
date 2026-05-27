import EditRecentWorkForm from "@/components/dashboard/recent-works/edit-recent-work/edit-recent-work-form";
import { getRecentWorkBySlugServer } from "@/lib/actions/recentWorks";
import { getCurrentUser } from "@/lib/auth-server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
    const work = await getRecentWorkBySlugServer(id);
    return {
      title: work ? `Edit ${work.title} | ColdFlyer` : "Edit Recent Work | ColdFlyer",
    };
  } catch {
    return { title: "Edit Recent Work | ColdFlyer" };
  }
}

export default async function EditRecentWorkPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user || !["admin", "moderator"].includes(user.role)) {
    redirect("/");
  }

  const { id: slugOrId } = await params;

  let work = null;
  try {
    work = await getRecentWorkBySlugServer(slugOrId);
  } catch (error) {
    console.error("Failed to fetch recent work:", error);
  }

  if (!work) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Recent work not found</p>
      </div>
    );
  }

  return <EditRecentWorkForm work={work} isAdmin={user.role === "admin"} />;
}
