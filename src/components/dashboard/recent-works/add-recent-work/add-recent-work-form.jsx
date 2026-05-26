"use client";

import { useCreateRecentWork } from "@/hooks/queries/recentWorks";
import { uploadImageAction } from "@/lib/actions/upload";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { BasicInfoSection, FormActions, FormHeader } from "../recent-work-form";
import { recentWorkFormSchema } from "@/validations";

const initialValues = {
  title: "",
  category: "",
  description: "",
  excerpt: "",
  clientName: "",
  completionDate: "",
  tags: "",
  featured: false,
  image: null,
};

export default function AddRecentWorkForm({ isAdmin = false }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const createRecentWork = useCreateRecentWork();

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(recentWorkFormSchema),
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
        description: values.description,
        excerpt: values.excerpt || values.title,
        category: values.category,
        clientName: values.clientName || undefined,
        completionDate: values.completionDate || undefined,
        tags,
        image: imageData,
        featured: values.featured || false,
      };

      await createRecentWork.mutateAsync(payload);
      form.reset(initialValues);
      router.push("/dashboard/recent-works");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    router.push("/dashboard/recent-works");
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader title="Add New Recent Work" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <FormActions
          onCancel={handleCancel}
          isPending={createRecentWork.isPending || isUploading}
          submitLabel="Save Work"
        />
      </form>
    </div>
  );
}
