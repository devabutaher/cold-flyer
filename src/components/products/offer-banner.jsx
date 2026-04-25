import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export default function OfferBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-accent-foreground -mt-8">
      {/* Background patterns */}
      <div className="absolute inset-0">
        <svg
          className="absolute top-0 left-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle cx="80%" cy="60%" r="100" fill="white" fillOpacity="0.07" />
          <circle cx="50%" cy="20%" r="40" fill="white" fillOpacity="0.07" />
          <path
            d="M0 20 L40 0 L40 40 Z"
            fill="white"
            fillOpacity="0.07"
            transform="translate(20, 40)"
          />
          <path
            d="M0 20 L40 0 L40 40 Z"
            fill="white"
            fillOpacity="0.07"
            transform="translate(460, 140) rotate(180)"
          />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-3 flex items-center justify-center">
            <Badge className={"uppercase bg-background/20 font-semibold"}>
              Limited Time Offer
            </Badge>
          </div>

          {/* Title */}
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-primary-foreground uppercase md:text-4xl lg:text-5xl">
            Summer Sale
          </h2>

          {/* Discount */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="text-center text-5xl font-bold text-primary-foreground md:text-6xl">
                20% OFF
              </div>
              <div className="absolute -top-1 -right-8 rotate-12 rounded-md border-2 border-green-400 bg-green-500 px-2 py-1 text-xs font-bold text-white">
                EXCLUSIVE
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mb-7 text-center text-base text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            Beat the heat with our premium AC units and HVAC systems. All
            products included in this special seasonal promotion!
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
            >
              Shop Summer Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground font-bold"
            >
              View All Deals
            </Button>
          </div>

          {/* Fine print */}
          <p className="mt-5 text-center text-xs text-primary-foreground/60">
            * Offer valid until August 31st. Cannot be combined with other
            promotions.
          </p>
        </div>
      </div>
    </div>
  );
}
