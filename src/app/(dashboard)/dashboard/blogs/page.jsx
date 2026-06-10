import ProtectedRoute from "@/components/auth/protected-routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

export const metadata = { title: "Blogs" };

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
          <Button asChild>
            <Link href="/dashboard/blogs/add">
              <Plus className="h-4 w-4" />
              New Blog
            </Link>
          </Button>
        </div>
        <BlogsTable isAdmin={true} />
      </div>
    </ProtectedRoute>
  );
}
