"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { useInView } from "@/hooks/use-in-view";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { useMemo, useState } from "react";

const FAQ_IDS = ["faqQ1", "faqQ2", "faqQ3", "faqQ4", "faqQ5", "faqQ6"];

function AnimatedChevron({ isOpen }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-primary transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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

      <AccordionPrimitive.Content className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function FaqImage() {
  const t = useTranslations("home");
  const { ref, inView } = useInView({ once: true });

  return (
    <div
      ref={ref}
      className="animate-in-fade-left relative h-64 w-full shrink-0 overflow-hidden rounded-xl shadow-lg md:h-80 lg:h-130"
      data-in-view={inView || undefined}
    >
      <Image
        src="https://images.unsplash.com/photo-1603335730747-ca17baa3aac2?q=80&w=1590&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="AC Technician"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div
          className="animate-in-scale-up inline-block rounded-lg border border-white/10 bg-background/10 p-4 backdrop-blur-md"
          data-in-view={inView || undefined}
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-base font-bold text-white md:text-lg">{t("faqSupportTitle")}</p>
          <p className="mt-1 text-sm text-white/90">{t("faqSupportDesc")}</p>
        </div>
      </div>
    </div>
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
              <span className="text-xxs font-bold uppercase tracking-widest text-primary">{t("commonQuestions")}</span>
              <h2 className="mt-1 font-sans text-2xl font-extrabold text-foreground md:text-3xl">{t("faqHeading")}</h2>
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
