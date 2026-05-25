import { getCurrentUser } from "@/lib/auth-server";
import { Briefcase, Plus } from "lucide-react";

export const metadata = {
  title: "Recent Works | ColdFlyer",
  description: "Manage your portfolio of completed projects.",
};

export default async function RecentWorksPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  const { default: RecentWorksTable } =
    await import("@/components/dashboard/recent-works/recent-works-table/recent-works-table");

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Recent Works</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage your portfolio of completed projects.</p>
        </div>
        {isAdmin && (
          <div>
            <a
              href="/dashboard/recent-works/add"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Work
            </a>
          </div>
        )}
      </div>
      <RecentWorksTable isAdmin={isAdmin} />
    </div>
  );
}
