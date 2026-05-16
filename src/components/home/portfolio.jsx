"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { getData } from "@/data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { animations, staggerItem } from "@/lib/animation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function PortfolioItem({ project, index, isLarge = false }) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden group ${isLarge ? "h-64 sm:row-span-2 sm:h-auto" : "h-52"}`}
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-full w-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className={`absolute ${isLarge ? "bottom-5 left-5" : "bottom-4 left-4"}`}>
        <motion.span 
          className="text-primary text-[10px] font-bold uppercase tracking-widest"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {project.cat}
        </motion.span>
        <h3 className="text-white font-sans font-bold text-lg">{project.title}</h3>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const projects = getData("projects", locale);

  if (!projects?.length) return null;

  return (
    <AnimatedSection className="py-16 bg-card" id="portfolio">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("precisionPortfolio")}</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              {t("recent")} <span className="text-primary">{t("works")}</span>
            </h2>
          </div>
          <Link
            href={"/services"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            {tc("learnMore")} <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PortfolioItem project={projects[0]} index={0} isLarge={true} />
          {projects.slice(1).map((p, i) => (
            <PortfolioItem key={p.title} project={p} index={i + 1} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
