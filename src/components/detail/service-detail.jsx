"use client";

import ImageCarousel from "@/components/products/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CheckCircle, CircleAlert, Clock, FileText, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import { DetailBackButton } from "./detail-back-button";
import { DetailMetaInfo } from "./detail-meta-info";
import { DetailPrice } from "./detail-price";
import { DetailTabs } from "./detail-tabs";
import { DetailTrustBadges } from "./detail-trust-badges";
import { ServiceReviews } from "@/components/reviews/service-reviews";
import Link from "next/link";

export default function ServiceDetailClient({ service }) {
  const t = useTranslations("common");
  const ts = useTranslations("services");
  if (!service) return null;

  const handleContact = () => {
    window.location.href = "mailto:support@coldflyer.com";
  };

  const images =
    service.images?.length > 0
      ? service.images.map((img, idx) => ({
          url: img.url,
          title: t("productView", { name: service.name, n: idx + 1 }),
        }))
      : [{ url: "", title: service.name }];

  const iconMap = {
    CheckCircle,
    CircleAlert,
    FileText,
    ShieldCheck,
    ThumbsUp,
    Clock,
  };

  const defaultTabsData = [
    { key: "includes", label: t("includes"), icon: CheckCircle, data: service.includes },
    { key: "excludes", label: t("excludes"), icon: CircleAlert, data: service.exclusions, variant: "exclude" },
    { key: "requirements", label: t("requirements"), icon: FileText, data: service.requirements },
    { key: "qualifications", label: t("qualifications"), icon: ShieldCheck, data: service.qualifications },
  ].filter((tab) => tab.data && (Array.isArray(tab.data) ? tab.data.length > 0 : tab.data.trim()));

  const trustBadgesData = [
    { icon: ShieldCheck, text: t("qualityService") },
    { icon: ThumbsUp, text: t("satisfactionGuaranteed") },
    { icon: Clock, text: t("timelyResponse") },
  ];
  const bookingUrl = `/dashboard/bookings/new/${service._id}`;

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/services" label={t("services")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="relative">
          {service.isFeatured && (
            <div className="absolute top-2 left-2 z-20">
              <Badge variant="default" className="bg-primary">
                {t("featured")}
              </Badge>
            </div>
          )}
          <ImageCarousel
            images={images}
            aspectRatio="square"
            imageFit="contain"
            thumbPosition="bottom"
            className="mx-auto max-w-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{service.category}</span>
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {service.serviceType?.replace(/_/g, " ")}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">
              {service.name}
            </h1>

            {service.description && <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>}
          </div>

          <DetailPrice mode="service" basePrice={service.basePrice} priceType={service.priceType} showLabel />

          <div className="flex items-center gap-4 mb-6">
            {service.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">{service.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">{ts("reviewsCount", { count: service.reviewCount || 0 })}</span>
              </div>
            )}
            {service.duration && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>
                  {service.duration.value} {service.duration.unit}
                </span>
              </div>
            )}
          </div>

          {service.bookingCount > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-600">{ts("bookingsCompleted", { count: service.bookingCount })}</span>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1" asChild>
              <Link href={bookingUrl}>{ts("bookNow")}</Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={handleContact}>
              {ts("contactUs")}
            </Button>
          </div>

          <DetailTrustBadges items={trustBadgesData} />

          <DetailMetaInfo
            fields={[
              { label: t("category"), value: service.category },
              ...(service.serviceType
                ? [
                    {
                      label: t("type"),
                      value: service.serviceType.replace(/_/g, " "),
                    },
                  ]
                : []),
            ]}
          />

          <DetailTabs tabs={defaultTabsData} />
        </div>
      </div>

      <div className="mt-10">
        <ServiceReviews serviceId={service._id} />
      </div>
    </div>
  );
}
