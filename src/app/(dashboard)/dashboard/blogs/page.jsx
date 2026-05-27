import ProtectedRoute from "@/components/auth/protected-routes";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const BlogsTable = dynamic(() => import("@/components/dashboard/blog/blogs-table/blogs-table"));

export default function BlogsPage() {
  return (
    <ProtectedRoute requiredRole={["admin", "moderator"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">All Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your blog content and articles.</p>
          </div>
          <Link
            href="/dashboard/blogs/add"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Blog
          </Link>
        </div>
        <BlogsTable isAdmin={true} />
      </div>
    </ProtectedRoute>
  );
}
