"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Shield, Truck, Zap } from "lucide-react";
import Link from "next/link";
import { animations, staggerItem } from "@/lib/animation";

function PromoCard({ card, index }) {
  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-md p-6 sm:p-7 shadow-xl border transition-colors duration-200 ${
        card.accent
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:border-primary/30"
      }`}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-md ${
          card.accent ? "bg-white/20" : "bg-primary/10"
        }`}
      >
        <card.icon size={20} className={card.accent ? "text-white" : "text-primary"} />
      </div>

      <span
        className={`text-xxs font-bold uppercase tracking-widest ${card.accent ? "text-white/70" : "text-primary"}`}
      >
        {card.tag}
      </span>

      <h3 className="mt-1 mb-2 font-sans text-lg font-bold">{card.title}</h3>

      <p className={`mb-4 text-sm leading-relaxed ${card.accent ? "text-white/80" : "text-muted-foreground"}`}>
        {card.sub}
      </p>

      <Link
        href={"/services"}
        className={`inline-flex items-center gap-1 text-sm font-bold transition-all duration-200 hover:gap-2 ${
          card.accent ? "text-white" : "text-primary"
        }`}
      >
        {card.cta}
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

export default function PromoCards() {
  const t = useTranslations("home");

  const cards = [
    {
      icon: Zap,
      tag: t("limitedOffer"),
      title: t("twentyOffServicing"),
      sub: t("promoMaintenance"),
      cta: t("learnMore"),
      accent: false,
    },
    {
      icon: Truck,
      tag: t("nextDayInstall"),
      title: t("sameWeekFitting"),
      sub: t("promoOrder"),
      cta: t("bookNow"),
      accent: true,
    },
    {
      icon: Shield,
      tag: t("partsWarranty"),
      title: t("tenYearGuarantee"),
      sub: t("promoGuarantee"),
      cta: t("learnMore"),
      accent: false,
    },
  ];

  return (
    <motion.div
      className="container relative z-20 -mt-14 mb-12 lg:-mt-16 lg:mb-16"
      variants={animations.stagger.normal}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {cards.map((card, index) => (
          <PromoCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
