"use client";

import { useTranslations } from "next-intl";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { AnimatedSection } from "@/components/ui/animated-section";

const brands = ["HYUNDAI", "DAIKIN", "TRANE", "LENNOX", "CARRIER", "MITSUBISHI", "LG", "SAMSUNG"];

export default function BrandsStrip() {
  const t = useTranslations("home");
  const repeated = [...brands, ...brands, ...brands];

  return (
    <AnimatedSection className="py-10 bg-background border-y border-border" variant="fadeIn">
      <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">
        {t("trustedByLeaders")}
      </p>
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <InfiniteSlider gap={56} speed={35} speedOnHover={15}>
          {repeated.map((b, i) => (
            <span
              key={i}
              className="shrink-0 font-sans font-black text-lg text-muted-foreground hover:text-primary transition-colors tracking-wider cursor-default"
            >
              {b}
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </AnimatedSection>
  );
}
