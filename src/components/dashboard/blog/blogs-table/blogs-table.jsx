"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { useBlogsQuery, useDeleteBlog } from "@/hooks/queries/blogs";
import { Newspaper } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { buildBlogColumns } from "./blog-columns";

export default function BlogsTable({ isAdmin = false }) {
  const { data: blogs = [], isLoading: loading } = useBlogsQuery({ limit: 100 });
  const deleteBlog = useDeleteBlog();

  const checkAdminAccess = useCallback(() => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  }, [isAdmin]);

  const handleDelete = useCallback(
    async (id) => {
      if (!checkAdminAccess()) return;
      try {
        await deleteBlog.mutateAsync(id);
      } catch {}
    },
    [deleteBlog, checkAdminAccess],
  );

  const columns = useMemo(() => buildBlogColumns({ onDelete: handleDelete }), [handleDelete]);

  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(blogs, "category");

  return (
    <DataTable
      columns={columns}
      data={blogs}
      loading={loading}
      rowCount="blogs"
      defaultSort={[{ id: "createdAt", desc: true }]}
      emptyMessage="No blog posts found. Create your first blog post to get started."
      emptyIcon={<Newspaper size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search blogs..."
          selectedLabel="blogs"
          filters={[
            {
              columnId: "category",
              placeholder: "All Categories",
              allLabel: "All Categories",
              options: categoriesOptions,
            },
          ]}
        />
      )}
    />
  );
}
