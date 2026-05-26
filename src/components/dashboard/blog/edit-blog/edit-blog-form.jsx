"use client";

import { useUpdateBlog } from "@/hooks/queries/blogs";
import { uploadImageAction } from "@/lib/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { BasicInfoSection, FormActions, FormHeader } from "../blog-form";
import { blogFormSchema } from "@/validations";

function getBlogInitialValues(blog) {
  return {
    title: blog.title || "",
    category: blog.category || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    tags: blog.tags?.join(", ") || "",
    featured: blog.featured || false,
    image: blog.image ? { url: blog.image.url, preview: blog.image.url } : null,
  };
}

export default function EditBlogForm({ blog, isAdmin = false }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const updateBlog = useUpdateBlog();

  const form = useForm({
    defaultValues: getBlogInitialValues(blog),
    resolver: zodResolver(blogFormSchema),
    mode: "onTouched",
  });

  const checkAdminAccess = () => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  };

  async function onSubmit(values) {
    if (!checkAdminAccess()) return;

    setIsUploading(true);

    try {
      let imageData = null;
      const image = form.getValues("image");

      if (image?.file) {
        const result = await uploadImageAction(image.file);
        if (result.success) {
          imageData = { url: result.data.url, alt: values.title };
        } else {
          toast.error(result.message || "Image upload failed");
        }
      } else if (image?.url) {
        imageData = { url: image.url, alt: blog.image?.alt || values.title };
      }

      const tags = values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined;

      const payload = {
        title: values.title,
        excerpt: values.excerpt || values.title,
        content: values.content,
        category: values.category,
        tags,
        image: imageData,
        featured: values.featured || false,
      };

      await updateBlog.mutateAsync({ id: blog._id, data: payload });
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error("Update blog error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader title="Edit Blog" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <FormActions
          onCancel={() => router.push("/dashboard/blogs")}
          isPending={updateBlog.isPending || isUploading}
          submitLabel="Update Blog"
        />
      </form>
    </div>
  );
}
