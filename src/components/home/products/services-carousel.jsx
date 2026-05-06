"use client";

import { Button } from "@/components/ui/button";
import { services } from "@/data/services-carousel-data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ProductCarousel from "./product-carousel";

export default function ServicesCarousel() {
  return (
    <AnimatedSection className="container pb-10">
      <ProductCarousel
        title="Our Best Services"
        tag="Professional Solutions"
        items={services}
        catalogLabel="View All Services"
        catalogLink="/services"
        renderCard={(service) => <ServiceCard service={service} />}
      />
    </AnimatedSection>
  );
}

function ServiceCard({ service, index }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-lg border border-border/50 h-full flex flex-col"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mb-6 overflow-hidden rounded-t-l bg-muted h-48 relative">
        {service.img ? (
          <Image
            src={service.img}
            alt={service.name}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
          {service.name}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base grow">
          {service.description}
        </p>
        <div className="mb-6 space-y-3">
          {service.features?.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <CheckCircle
                size={18}
                className="shrink-0 text-primary"
                strokeWidth={2.5}
              />
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
        <Button className="w-full">Book Now</Button>
      </div>
    </motion.div>
  );
}