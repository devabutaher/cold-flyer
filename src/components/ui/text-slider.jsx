"use client";

// https://motion-primitives.com/docs/infinite-slider
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const announcements = [
  "🔥 Free AC Checkup for First-Time Customers",
  "❄️ Up to 25% OFF on AC Installation Services",
  "🚚 Free Delivery on Orders Over ৳5000",
  "🛠️ 24/7 Emergency AC Repair Support",
  "💨 Fast Same-Day AC Servicing Available",
  "🎉 Summer Offer: Save Big on Split ACs",
];

export function TextSlider() {
  return (
    <div className="border-b border-surface-high bg-primary py-2 text-white">
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <InfiniteSlider gap={48} speed={40} speedOnHover={20}>
          {announcements.map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="text-sm font-semibold tracking-wide">
                {text}
              </span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
