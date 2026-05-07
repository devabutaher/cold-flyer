"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import servicesApi from "@/lib/api/services";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Settings,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import ServiceFilters from "./service-filters";

const iconMap = {
  settings: Settings,
  activity: Activity,
  alertcircle: AlertCircle,
  zap: Zap,
};

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[60vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80"
          alt="Industrial HVAC facility"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/70 via-foreground/50 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary mb-4 block">
              Professional Services
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl leading-relaxed mb-10">
              Expert HVAC installation, maintenance, and repair services tailored to your needs.
            </p>
            <Button size="lg" className="gap-2 text-base px-8 py-6">
              Book a Service <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-8 bg-background border-b border-border">
        <div className="container">
          <Suspense
            fallback={
              <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
                <div className="h-8 w-28 bg-muted animate-pulse rounded" />
                <div className="h-8 w-28 bg-muted animate-pulse rounded" />
                <div className="h-8 w-28 bg-muted animate-pulse rounded" />
              </div>
            }
          >
            <ServiceFilters />
          </Suspense>
        </div>
      </AnimatedSection>

      <ServicesGrid />
    </main>
  );
}

function ServicesGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await servicesApi.getServices({ limit: 50 });
        setServices(res.data?.services ?? res.services ?? []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <AnimatedSection className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (services.length === 0) {
    return (
      <AnimatedSection className="py-16">
        <div className="container text-center">
          <p className="text-muted-foreground text-lg">
            No services available at the moment.
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service._id ?? service.id ?? index} service={service} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Settings;
  const src = service.images?.[0];

  const formatPrice = (price, priceType) => {
    if (priceType === "quote") return "Quote Based";
    if (priceType === "hourly") return `৳${price}/hr`;
    return `৳${price?.toLocaleString()}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-lg border border-border/50 h-full flex flex-col">
      <div className="mb-6 overflow-hidden rounded-t-lg bg-muted h-48 relative">
        {src ? (
          <Image
            src={src}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <Icon className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {service.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground font-bold">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs capitalize">
            {service.category}
          </Badge>
          {service.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{service.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">
                ({service.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-foreground">
          {service.name}
        </h3>
        {service.sub && (
          <p className="text-sm text-muted-foreground mb-3">{service.sub}</p>
        )}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {service.shortDescription || service.description}
        </p>

        <div className="mb-4 space-y-2">
          {service.includes?.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle size={14} className="shrink-0 text-primary" />
              <span className="text-xs text-muted-foreground truncate">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(service.basePrice, service.priceType)}
              </span>
              {service.duration && (
                <span className="text-xs text-muted-foreground ml-2">
                  {service.duration.value} {service.duration.unit}
                </span>
              )}
            </div>
            <Button size="sm">Book Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}