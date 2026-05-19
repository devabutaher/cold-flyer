"use client";

import Image from "next/image";
import { getData } from "@/data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations, useLocale } from "next-intl";

function AboutPoint({ point }) {
  return (
    <div className="flex gap-3">
      <div>
        <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
      </div>
      <div>
        <h4 className="font-sans font-bold text-foreground text-sm">{point.label}</h4>
        <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{point.sub}</p>
      </div>
    </div>
  );
}

export default function About() {
  const t = useTranslations("home");
  const locale = useLocale();
  const aboutData = getData("aboutData", locale);
  return (
    <AnimatedSection className="py-10 sm:py-14 md:py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative rounded-xl overflow-hidden h-72 md:h-105 order-2 md:order-1 group">
            <Image
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80"
              alt="Technician"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
          <div className="order-1 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("whyChooseUs")}</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mt-2 mb-6">
              Engineering Comfort with <span className="text-primary">Uncompromising Precision.</span>
            </h2>
            <div className="space-y-5 mb-8">
              {aboutData.map((p) => (
                <AboutPoint key={p.label} point={p} />
              ))}
            </div>
            <Link href={"/about"}>
              <Button size="lg">{t("moreAboutUs")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
