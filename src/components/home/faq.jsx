"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const faqItems = [
  {
    id: "faq-1",
    question: "How often should I service my AC unit?",
    answer:
      "We recommend servicing your AC unit at least once a year, preferably before the summer season begins. Regular maintenance helps prevent breakdowns, improves efficiency, and extends the lifespan of your unit.",
  },
  {
    id: "faq-2",
    question: "What signs indicate my AC needs repair?",
    answer:
      "Common signs include weak airflow, unusual noises, strange odors, inconsistent cooling, higher energy bills, or frequent cycling on and off. If you notice any of these issues, contact us for a professional inspection.",
  },
  {
    id: "faq-3",
    question: "Do you offer emergency AC repair services?",
    answer:
      "Yes, we provide emergency repair services for urgent AC issues. Our team is available to handle breakdowns and restore your comfort as quickly as possible.",
  },
  {
    id: "faq-4",
    question: "What brands of AC units do you service?",
    answer:
      "We service all major brands of air conditioning units including Daikin, Carrier, LG, Samsung, Mitsubishi, and more. Our technicians are trained to work with a wide range of systems.",
  },
  {
    id: "faq-5",
    question: "How long does a typical AC installation take?",
    answer:
      "A standard AC installation typically takes 4–8 hours depending on the complexity of the job, the type of unit, and any necessary modifications to your existing ductwork or electrical systems.",
  },
  {
    id: "faq-6",
    question: "Are your technicians certified and insured?",
    answer:
      "Yes, all our technicians are fully certified, licensed, and insured. They undergo regular training to stay updated with the latest industry standards and technologies.",
  },
];

// ── Animated chevron icon ────────────────────────────────────
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
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

// ── Single FAQ item — built directly on Radix primitives ─────
// This is the correct pattern: motion lives INSIDE Radix items,
// never wrapping them, so Radix compound-component wiring stays intact.
function FaqItem({ item, index, openValue }) {
  const isOpen = openValue === item.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
    >
      <AccordionPrimitive.Item value={item.id} className="border-b border-border last:border-0">
        {/* Trigger — Radix handles open/close; motion only animates the chevron */}
        <AccordionPrimitive.Header asChild>
          <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none">
            <span>{item.question}</span>
            <AnimatedChevron isOpen={isOpen} />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        {/* Content — AnimatePresence drives the height + fade,
            bypassing Radix's built-in CSS animation entirely */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <AccordionPrimitive.Content forceMount asChild>
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </motion.div>
            </AccordionPrimitive.Content>
          )}
        </AnimatePresence>
      </AccordionPrimitive.Item>
    </motion.div>
  );
}

// ── Side image ───────────────────────────────────────────────
function FaqImage() {
  return (
    <motion.div
      className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl shadow-lg md:h-80 lg:h-130"
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
        <div className="inline-block rounded-lg border border-white/10 bg-background/10 p-4 backdrop-blur-md">
          <p className="text-base font-bold text-white md:text-lg">Expert Support When You Need It</p>
          <p className="mt-1 text-sm text-white/90">Our team is ready to help with all your climate control needs</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function Faq() {
  const [openValue, setOpenValue] = useState(faqItems[0].id);

  return (
    <AnimatedSection className="bg-background py-16" id="faq">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          {/* Left column */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Common Questions</span>
              <h2 className="mt-1 font-sans text-2xl font-extrabold text-foreground md:text-3xl">
                Frequently Asked <span className="text-primary">Questions.</span>
              </h2>
            </div>

            {/*
              Use Radix directly so we can track openValue in state.
              shadcn's <Accordion> is just a thin wrapper around this —
              using the primitive gives us the same behaviour plus
              the ability to read which item is open for our chevron animation.
            */}
            <AccordionPrimitive.Root
              type="single"
              value={openValue}
              onValueChange={(v) => setOpenValue(v ?? "")}
              collapsible
              className="w-full"
            >
              {faqItems.map((item, index) => (
                <FaqItem key={item.id} item={item} index={index} openValue={openValue} />
              ))}
            </AccordionPrimitive.Root>
          </div>

          {/* Right column */}
          <FaqImage />
        </div>
      </div>
    </AnimatedSection>
  );
}
