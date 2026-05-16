"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getData } from "@/data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { animations } from "@/lib/animation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations, useLocale } from "next-intl";

function AboutPoint({ point, index }) {
  return (
    <motion.div
      className="flex gap-3"
      variants={animations.entrance.fadeLeft}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: index * 0.08 }}
      >
        <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
      </motion.div>
      <div>
        <h4 className="font-sans font-bold text-foreground text-sm">{point.label}</h4>
        <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{point.sub}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const t = useTranslations("home");
  const locale = useLocale();
  const aboutData = getData("aboutData", locale);
  return (
    <AnimatedSection className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            className="relative rounded-xl overflow-hidden h-72 md:h-105 order-2 md:order-1 group"
            variants={animations.entrance.fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={animations.inView.once}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80"
              alt="Technician"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </motion.div>
          <div className="order-1 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("whyChooseUs")}</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mt-2 mb-6">
              Engineering Comfort with <span className="text-primary">Uncompromising Precision.</span>
            </h2>
            <div className="space-y-5 mb-8">
              {aboutData.map((p, i) => (
                <AboutPoint key={p.label} point={p} index={i} />
              ))}
            </div>
            <Link href={"/about"}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg">{t("moreAboutUs")}</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
