"use client";

import { useCreateService } from "@/hooks/use-service-mutation";
import { uploadImages } from "@/lib/image-upload";
import { serviceFormSchema } from "@/lib/schema/service-schemas";
import { generateSlug, parseListInput } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  ServiceBasicInfoSection,
  ServiceFormActions,
  ServiceFormHeader,
  ServicePricingSection,
} from "../service-form";
import { ServiceDetailsSection } from "./details-section";

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

export default function AddServiceForm() {
  const [isUploading, setIsUploading] = useState(false);
  const createService = useCreateService();

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(serviceFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

  async function onSubmit(values) {
    setIsUploading(true);

    try {
      const images = form.getValues("images") || [];
      const uploadedImages = await uploadImages(images);

      const includes = parseListInput(values.includes);
      const exclusions = parseListInput(values.exclusions);
      const requirements = parseListInput(values.requirements);
      const qualifications = parseListInput(values.qualifications);

      const payload = {
        name: values.name,
        slug: generateSlug(values.name),
        description:
          values.description || `${values.name} - Professional service`,
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
      toast.success(`"${values.name}" added successfully!`);
      form.reset(initialValues);
    } catch (error) {
      toast.error(error.message || "Failed to add service");
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
        <ServiceFormActions
          onReset={handleReset}
          isPending={createService.isPending || isUploading}
        />
      </form>
    </div>
  );
}
