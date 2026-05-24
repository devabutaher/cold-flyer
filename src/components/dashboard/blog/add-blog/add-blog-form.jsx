"use client";

import { useCreateBlog } from "@/hooks/queries/blogs";
import { uploadImageAction } from "@/lib/actions/upload";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { BasicInfoSection, FormActions, FormHeader } from "../blog-form";

const blogFormSchema = z.object({
  title: z.string().min(1, "Blog title is required"),
  category: z.string().min(1, "Category is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  image: z.any().optional(),
});

const initialValues = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  tags: "",
  featured: false,
  image: null,
};

export default function AddBlogForm({ isAdmin = false }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const createBlog = useCreateBlog();

  const form = useForm({
    defaultValues: initialValues,
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
        imageData = { url: image.url, alt: values.title };
      }

      const tags = values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined;

      const payload = {
        title: values.title,
        slug: generateSlug(values.title),
        excerpt: values.excerpt || values.title,
        content: values.content,
        category: values.category,
        tags,
        image: imageData,
        featured: values.featured || false,
      };

      await createBlog.mutateAsync(payload);
      form.reset(initialValues);
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    router.push("/dashboard/blogs");
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader title="Add New Blog" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <FormActions onCancel={handleCancel} isPending={createBlog.isPending || isUploading} submitLabel="Save Blog" />
      </form>
    </div>
  );
}
