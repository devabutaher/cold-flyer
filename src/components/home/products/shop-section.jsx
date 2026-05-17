"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api-client";
import { motion } from "framer-motion";
import { CheckCircle, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import DataCarousel from "./data-carousel";

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden h-full flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 flex flex-col grow space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const tc = useTranslations("common");
  const src = service.image || service.images?.[0]?.url;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-lg border border-border/50 h-full flex flex-col"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mb-6 overflow-hidden rounded-t-lg bg-muted h-48 relative">
        <Link href={`/services/${service.slug}`} className="relative block h-full">
          {src ? (
            <Image
              src={src}
              alt={service.name}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Wrench className="h-12 w-12 text-primary/40" />
            </div>
          )}
        </Link>
      </div>

      <div className="p-4 flex flex-col grow">
        <Link href={`/services/${service.slug}`}>
          <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl hover:text-primary transition-colors">
            {service.name}
          </h3>
        </Link>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base grow">
          {service.shortDescription || service.description}
        </p>
        <div className="mb-6 space-y-3">
          {service.includes?.slice(0, 3).map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <CheckCircle size={18} className="shrink-0 text-primary" strokeWidth={2.5} />
              <span className="text-sm font-medium text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
        <Button className="w-full">{tc("bookNow")}</Button>
      </div>
    </motion.div>
  );
}

export default function ShopSection() {
  const t = useTranslations("home");

  return (
    <div className="space-y-10">
      <DataCarousel
        fetchFn={() => apiGet("/services/featured")}
        title={t("ourBestServices")}
        tag={t("professionalSolutions")}
        catalogLabel={t("viewAllServices")}
        catalogLink="/services"
        renderCard={(service, index) => <ServiceCard service={service} index={index} />}
        renderSkeleton={() => <ServiceCardSkeleton />}
      />

      <DataCarousel
        fetchFn={() => apiGet("/products?productType=unit&limit=10")}
        title={t("premiumAcUnits")}
        tag={t("ourStore")}
        catalogLabel={t("viewFullCatalog")}
        catalogLink="/items?productType=unit"
      />

      <DataCarousel
        fetchFn={() => apiGet("/products?productType=part&limit=10")}
        title={t("precisionAcParts")}
        tag={t("replacements")}
        catalogLabel={t("exploreParts")}
        catalogLink="/items?productType=part"
      />
    </div>
  );
}
