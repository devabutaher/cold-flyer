import { promoCardData } from "@/data/promo-card-data";
import { ArrowRight } from "lucide-react";

export default function PromoCards() {
  return (
    <section className="container relative z-20 -mt-14 mb-12 sm:-mt-16 sm:mb-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {promoCardData.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl p-6 sm:p-7 shadow-xl border ${
              card.accent
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-md ${
                card.accent ? "bg-white/20" : "bg-primary/10"
              }`}
            >
              <card.icon
                size={20}
                className={card.accent ? "text-white" : "text-primary"}
              />
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                card.accent ? "text-white/70" : "text-primary"
              }`}
            >
              {card.tag}
            </span>

            <h3 className="mt-1 mb-2 font-sans text-lg font-bold">
              {card.title}
            </h3>

            <p
              className={`mb-4 text-sm leading-relaxed ${
                card.accent ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {card.sub}
            </p>

            <button
              className={`flex items-center gap-1 text-sm font-bold transition-all hover:gap-2 ${
                card.accent ? "text-white" : "text-primary"
              }`}
            >
              {card.cta}
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
