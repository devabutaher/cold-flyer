"use client";

import { useCreateService, useUpdateService } from "@/hooks/queries";
import { uploadImageAction } from "@/lib/actions/products";
import { serviceFormSchema } from "@/lib/schemas";
import { generateSlug, parseListInput } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ServiceBasicInfoSection,
  ServiceFormActions,
  ServiceFormHeader,
  ServicePricingSection,
  ServiceDetailsSection,
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

function normalizeServiceType(type) {
  if (!type) return "";
  const normalized = type.replace(/_/g, " ").toLowerCase().trim();
  const validTypes = [
    "installation",
    "preventative care",
    "efficiency tuning",
    "rapid response",
    "repair",
    "consultation",
    "emergency",
    "inspection",
  ];
  if (validTypes.includes(normalized)) {
    return normalized;
  }
  return type;
}

function getInitialValues(service) {
  if (!service) {
    return {
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
  }

  return {
    name: service.name || "",
    category: service.category || "",
    serviceType: normalizeServiceType(service.serviceType),
    priceType: service.priceType || "fixed",
    description: service.description || "",
    basePrice: service.basePrice != null ? String(service.basePrice) : "",
    includes: Array.isArray(service.includes) ? service.includes.join("\n") : "",
    exclusions: Array.isArray(service.exclusions) ? service.exclusions.join("\n") : "",
    requirements: Array.isArray(service.requirements) ? service.requirements.join("\n") : "",
    qualifications: Array.isArray(service.qualifications) ? service.qualifications.join("\n") : "",
    images: service.images || [],
  };
}

export default function EditServiceForm({ service, isAdmin = false }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const updateService = useUpdateService();

  const form = useForm({
    defaultValues: getInitialValues(service),
    resolver: zodResolver(serviceFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

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
      const images = form.getValues("images") || [];
      const uploadedImages = await Promise.all(
        images.map((img) => img.file ? uploadImageAction(img, "images") : img),
      );

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

      await updateService.mutateAsync({ id: service._id, data: payload });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ServiceFormHeader completedSections={completedSections} title="Edit Service" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ServiceBasicInfoSection control={form.control} />
        <ServicePricingSection control={form.control} />
        <ServiceDetailsSection control={form.control} />
        <ServiceFormActions
          onCancel={() => router.push("/dashboard/services")}
          isPending={updateService.isPending || isUploading}
          isEditing={true}
          showReset={false}
        />
      </form>
    </div>
  );
}