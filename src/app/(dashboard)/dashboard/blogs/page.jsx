"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import BlogsTable from "@/components/dashboard/blog/blogs-table/blogs-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">All Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your blog content and articles.</p>
          </div>
          <Button onClick={() => router.push("/dashboard/blogs/add")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Blog
          </Button>
        </div>
        <BlogsTable isAdmin={true} />
      </div>
    </ProtectedRoute>
  );
}
