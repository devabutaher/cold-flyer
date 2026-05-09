"use client";

import ImageCarousel from "@/components/products/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useService } from "@/hooks/use-service";
import {
  CheckCircle,
  CircleAlert,
  Clock,
  FileText,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { DetailBackButton } from "./detail-back-button";
import { DetailMetaInfo } from "./detail-meta-info";
import { DetailPrice } from "./detail-price";
import { DetailSkeleton } from "./detail-skeleton";
import { DetailTabs } from "./detail-tabs";
import { DetailTrustBadges } from "./detail-trust-badges";

export default function ServiceDetail({ serviceSlug }) {
  const { service, loading, error } = useService(serviceSlug);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !service) {
    return (
      <div className="bg-background min-h-screen pb-10 flex items-center justify-center">
        <div className="text-destructive">Failed to load service</div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (service) {
      toast.success(`${service.name} - Booking initiated`);
    }
  };

  const handleContact = () => {
    if (service) {
      toast.info(`Contacting about ${service.name}`);
    }
  };

  const images =
    service.images?.length > 0
      ? service.images.map((img, idx) => ({
          url: img.url,
          title: `${service.name} — view ${idx + 1}`,
        }))
      : [{ url: "", title: service.name }];

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/services" label="Services" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="relative">
          {service.isFeatured && (
            <div className="absolute top-2 left-2 z-20">
              <Badge variant="default" className="bg-primary">
                Featured
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
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {service.category}
            </span>
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {service.serviceType?.replace(/_/g, " ")}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">
              {service.name}
            </h1>

            {service.description && (
              <p className="text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>
            )}
          </div>

          <DetailPrice
            mode="service"
            basePrice={service.basePrice}
            priceType={service.priceType}
            showLabel
          />

          <div className="flex items-center gap-4 mb-6">
            {service.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">
                  {service.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({service.reviewCount || 0} reviews)
                </span>
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
              <span className="text-xs font-medium text-green-600">
                {service.bookingCount} bookings completed
              </span>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1" onClick={handleBookNow}>
              Book Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleContact}
            >
              Contact Us
            </Button>
          </div>

          <DetailTrustBadges
            items={[
              { icon: ShieldCheck, text: "Quality Service" },
              { icon: ThumbsUp, text: "Satisfaction Guaranteed" },
              { icon: Clock, text: "Timely Response" },
            ]}
          />

          <DetailMetaInfo
            fields={[
              { label: "Category", value: service.category },
              ...(service.serviceType
                ? [
                    {
                      label: "Type",
                      value: service.serviceType.replace(/_/g, " "),
                    },
                  ]
                : []),
            ]}
          />

          <DetailTabs
            tabs={[
              {
                key: "includes",
                label: "Includes",
                icon: CheckCircle,
                data: service.includes,
              },
              {
                key: "excludes",
                label: "Excludes",
                icon: CircleAlert,
                data: service.exclusions,
                variant: "exclude",
              },
              {
                key: "requirements",
                label: "Requirements",
                icon: FileText,
                data: service.requirements,
              },
              {
                key: "qualifications",
                label: "Qualifications",
                icon: ShieldCheck,
                data: service.qualifications,
              },
            ].filter((tab) => tab.data && tab.data.length > 0)}
          />
        </div>
      </div>
    </div>
  );
}
