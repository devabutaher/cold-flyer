"use client";

import { useUpdateRecentWork } from "@/hooks/queries/recentWorks";
import { uploadImageAction } from "@/lib/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { BasicInfoSection, FormActions, FormHeader } from "../recent-work-form";
import { recentWorkFormSchema } from "@/validations";

export default function EditRecentWorkForm({ work, isAdmin = false }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const updateRecentWork = useUpdateRecentWork();

  const form = useForm({
    defaultValues: {
      title: work?.title || "",
      category: work?.category || "",
      description: work?.description || "",
      excerpt: work?.excerpt || "",
      clientName: work?.clientName || "",
      completionDate: work?.completionDate ? work.completionDate.split("T")[0] : "",
      tags: work?.tags?.join(", ") || "",
      featured: work?.featured || false,
      image: work?.image ? { url: work.image.url, preview: work.image.url } : null,
    },
    resolver: zodResolver(recentWorkFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (work) {
      form.reset({
        title: work.title || "",
        category: work.category || "",
        description: work.description || "",
        excerpt: work.excerpt || "",
        clientName: work.clientName || "",
        completionDate: work.completionDate ? work.completionDate.split("T")[0] : "",
        tags: work.tags?.join(", ") || "",
        featured: work.featured || false,
        image: work.image ? { url: work.image.url, preview: work.image.url } : null,
      });
    }
  }, [work, form]);

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
      let imageData = work?.image || null;
      const image = form.getValues("image");

      if (image?.file) {
        const result = await uploadImageAction(image.file);
        if (result.success) {
          imageData = { url: result.data.url, alt: values.title };
        } else {
          toast.error(result.message || "Image upload failed");
        }
      } else if (image?.url && image.url !== work?.image?.url) {
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
        description: values.description,
        excerpt: values.excerpt || values.title,
        category: values.category,
        clientName: values.clientName || undefined,
        completionDate: values.completionDate || undefined,
        tags,
        image: imageData,
        featured: values.featured || false,
      };

      await updateRecentWork.mutateAsync({ id: work._id, data: payload });
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
      <FormHeader title="Edit Recent Work" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <FormActions
          onCancel={handleCancel}
          isPending={updateRecentWork.isPending || isUploading}
          submitLabel="Update Work"
        />
      </form>
    </div>
  );
}
