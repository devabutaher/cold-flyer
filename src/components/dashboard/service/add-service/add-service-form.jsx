"use client";

import { useCreateService } from "@/hooks/queries/services";
import { uploadImageAction } from "@/lib/actions/products";
import { serviceFormSchema } from "@/lib/schemas";
import { generateSlug, parseListInput } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  ServiceBasicInfoSection,
  ServiceDetailsSection,
  ServiceFormActions,
  ServiceFormHeader,
  ServicePricingSection,
} from "../service-form";

function useCompletedSections(control) {
  const [name, basePrice, category] = useWatch({
    control,
    name: ["name", "basePrice", "category"],
  });

  let count = 0;
  if (name) count++;
  if (basePrice) count++;
  if (category) count++;
  return count;
}

const initialValues = {
  name: "",
  category: "",
  serviceType: "",
  priceType: "fixed",
  description: "",
  basePrice: "",
  includes: "",
  exclusions: "",
  requirements: "",
  qualifications: "",
  images: [],
};

export default function AddServiceForm({ isAdmin = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const createService = useCreateService();

  const checkAdminAccess = () => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  };

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(serviceFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

  async function onSubmit(values) {
    if (!checkAdminAccess()) return;

    setIsUploading(true);

    try {
      const images = form.getValues("images") || [];
      const uploadedImages = await Promise.all(images.map((img) => uploadImageAction(img, "images")));

      const includes = parseListInput(values.includes);
      const exclusions = parseListInput(values.exclusions);
      const requirements = parseListInput(values.requirements);
      const qualifications = parseListInput(values.qualifications);

      const payload = {
        name: values.name,
        slug: generateSlug(values.name),
        description: values.description || `${values.name} - Professional service`,
        category: values.category,
        serviceType: values.serviceType,
        priceType: values.priceType || "fixed",
        basePrice: Number(values.basePrice),
        includes: includes.length > 0 ? includes : undefined,
        exclusions: exclusions.length > 0 ? exclusions : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        qualifications: qualifications.length > 0 ? qualifications : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      };

      await createService.mutateAsync(payload);
      form.reset(initialValues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  function handleReset() {
    form.reset(initialValues);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ServiceFormHeader completedSections={completedSections} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ServiceBasicInfoSection control={form.control} />
        <ServicePricingSection control={form.control} />
        <ServiceDetailsSection control={form.control} />
        <ServiceFormActions onReset={handleReset} isPending={createService.isPending || isUploading} />
      </form>
    </div>
  );
}
