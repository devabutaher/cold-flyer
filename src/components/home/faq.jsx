"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { animations } from "@/lib/animation";

const FAQ_IDS = ["faqQ1", "faqQ2", "faqQ3", "faqQ4", "faqQ5", "faqQ6"];

function AnimatedChevron({ isOpen }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-primary"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

function FaqItem({ item, openValue }) {
  const isOpen = openValue === item.id;

  return (
    <AccordionPrimitive.Item value={item.id} className="border-b border-border last:border-0">
      <AccordionPrimitive.Header asChild>
        <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-4 min-h-11 text-left text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none">
          <span className="transition-colors group-hover:text-primary">{item.question}</span>
          <AnimatedChevron isOpen={isOpen} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AnimatePresence initial={false}>
        {isOpen && (
          <AccordionPrimitive.Content forceMount asChild>
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </motion.div>
          </AccordionPrimitive.Content>
        )}
      </AnimatePresence>
    </AccordionPrimitive.Item>
  );
}

function FaqImage() {
  const t = useTranslations("home");
  return (
    <motion.div
      className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl shadow-lg md:h-80 lg:h-130"
      variants={animations.entrance.fadeLeft}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
    >
      <Image
        src="https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=1170&auto=format&fit=crop"
        alt="AC Technician"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <motion.div
          className="inline-block rounded-lg border border-white/10 bg-background/10 p-4 backdrop-blur-md"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-base font-bold text-white md:text-lg">{t("faqSupportTitle")}</p>
          <p className="mt-1 text-sm text-white/90">{t("faqSupportDesc")}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Faq() {
  const t = useTranslations("home");
  const faqItems = useMemo(
    () =>
      FAQ_IDS.map((key) => ({
        id: key,
        question: t(key),
        answer: t(key.replace("Q", "A")),
      })),
    [t],
  );
  const [openValue, setOpenValue] = useState(faqItems[0].id);

  return (
    <AnimatedSection className="bg-background py-10 sm:py-14 md:py-16" id="faq">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {t("commonQuestions")}
              </span>
              <h2 className="mt-1 font-sans text-2xl font-extrabold text-foreground md:text-3xl">
                {t("faqHeading")}
              </h2>
            </div>

            <AccordionPrimitive.Root
              type="single"
              value={openValue}
              onValueChange={(v) => setOpenValue(v ?? "")}
              collapsible
              className="w-full"
            >
              {faqItems.map((item) => (
                <FaqItem key={item.id} item={item} openValue={openValue} />
              ))}
            </AccordionPrimitive.Root>
          </div>

          <FaqImage />
        </div>
      </div>
    </AnimatedSection>
  );
}
