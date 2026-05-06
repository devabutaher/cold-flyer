"use client";

import { motion } from "framer-motion";
import { promoCardData } from "@/data/promo-card-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function PromoCard({ card, index }) {
  return (
    <motion.div
      className={`rounded-md p-6 sm:p-7 shadow-xl border transition-colors duration-200 ${
        card.accent
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:border-primary/30"
      }`}
      variants={itemVariants}
      whileHover={{ y: -2 }}
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

      <h3 className="mt-1 mb-2 font-sans text-lg font-bold">{card.title}</h3>

      <p
        className={`mb-4 text-sm leading-relaxed ${
          card.accent ? "text-white/80" : "text-muted-foreground"
        }`}
      >
        {card.sub}
      </p>

      <Link
        href={"/services"}
        className={`inline-flex items-center gap-1 text-sm font-bold transition-all duration-200 hover:gap-2 ${
          card.accent ? "text-white" : "text-primary"
        }`}
      >
        {card.cta}
        <ArrowRight size={14} className="transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export default function PromoCards() {
  return (
    <motion.div
      className="container relative z-20 -mt-14 mb-12 sm:-mt-16 sm:mb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {promoCardData.map((card, index) => (
          <PromoCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </motion.div>
  );
}