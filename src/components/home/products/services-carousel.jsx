"use client";

import { Button } from "@/components/ui/button";
import { services } from "@/data/services-carousel-data";
import { CheckCircle } from "lucide-react";
import ProductCarousel from "./product-carousel";

export default function ServicesCarousel() {
  return (
    <section className="container pb-10">
      <ProductCarousel
        title="Our Best Services"
        tag="Professional Solutions"
        items={services}
        catalogLabel="View All Services"
        catalogLink="/services"
        renderCard={(service) => <ServiceCard service={service} />}
      />
    </section>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-lg border border-border/50 h-full flex flex-col">
      {/* Image Container */}
      <div className="mb-6 overflow-hidden rounded-t-l bg-muted h-48">
        {service.img ? (
          <img
            src={service.img}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>

      <div className="p-4 flex flex-col grow">
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
          {service.name}
        </h3>
        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base grow">
          {service.description}
        </p>
        {/* Features List */}
        <div className="mb-6 space-y-3">
          {service.features?.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle
                size={18}
                className="shrink-0 text-primary"
                strokeWidth={2.5}
              />
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </div>
          ))}
        </div>
        {/* Book Now Button */}
        <Button className="w-full">Book Now</Button>
      </div>
    </div>
  );
}
