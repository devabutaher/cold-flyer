"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";

const brands = [
  "HYUNDAI",
  "DAIKIN",
  "TRANE",
  "LENNOX",
  "CARRIER",
  "MITSUBISHI",
  "LG",
  "SAMSUNG",
];

export default function BrandsStrip() {
  const repeated = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 bg-background border-y border-border">
      <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">
        Trusted by Industry Leaders
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
    </section>
  );
}
