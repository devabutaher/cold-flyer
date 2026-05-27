"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { useTranslations } from "next-intl";

export function TextSlider() {
  const t = useTranslations("home.announcements");

  const announcements = [t("freeCheckup"), t("summerDiscount"), t("freeDelivery")];
  const repeated = Array(3).fill(announcements).flat();

  return (
    <div className="border-b border-primary/20 bg-primary py-2 text-white relative z-50">
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <InfiniteSlider gap={48} speed={90}>
          {repeated.map((text, index) => (
            <div key={index} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-semibold tracking-wide">{text}</span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
