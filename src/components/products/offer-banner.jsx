import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OfferBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-accent-foreground -mt-8">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          preserveAspectRatio="none"
        >
          <circle cx="92%" cy="50%" r="80" fill="white" fillOpacity="0.06" />
          <circle cx="80%" cy="-10%" r="55" fill="white" fillOpacity="0.05" />
          <circle cx="5%" cy="80%" r="45" fill="white" fillOpacity="0.05" />
          <polygon
            points="0,0 28,0 0,28"
            fill="white"
            fillOpacity="0.07"
            transform="translate(16,16)"
          />
        </svg>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="relative z-10 px-5 py-4 sm:px-7 sm:py-5 md:px-10 md:py-6">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: badge + text */}
          <div className="flex flex-col items-center gap-1.5 md:flex-row md:items-start md:gap-3 text-center md:text-left">
            <div>
              <Badge className="shrink-0 bg-background/20 text-primary-foreground uppercase text-[10px] font-bold tracking-widest px-2.5 py-0.5">
                Limited Time
              </Badge>

              <div>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <span className="text-xl font-extrabold tracking-tight text-primary-foreground md:text-2xl">
                    Summer Sale
                  </span>
                  <span className="text-lg font-black text-primary-foreground/90 md:text-xl">
                    — 20% OFF
                  </span>
                  {/* EXCLUSIVE chip */}
                  <span className="hidden md:inline-flex items-center rounded border-2 border-green-400 bg-green-500 px-1.5 py-px text-[9px] font-bold text-white rotate-2 leading-none">
                    EXCLUSIVE
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-primary-foreground/70 leading-snug max-w-md">
                  All premium AC units & HVAC systems. Valid until Aug 31st.
                </p>
              </div>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="md"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-xs h-8 px-4"
            >
              Shop Now
            </Button>
            <Button
              size="md"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground font-bold text-xs h-8 px-4"
            >
              All Deals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
