"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

function Accordion({ className, children, type = "single", defaultValue, ...props }) {
  const [openValue, setOpenValue] = React.useState(defaultValue || null);

  const isOpen = (value) => openValue === value;

  const handleToggle = React.useCallback(
    (value) => {
      if (type === "single") {
        setOpenValue((prev) => (prev === value ? null : value));
      }
    },
    [type],
  );

  const childrenArray = React.Children.toArray(children);

  return (
    <div data-slot="accordion" className={cn("flex w-full flex-col", className)}>
      {childrenArray.map((child) => {
        if (!React.isValidElement(child)) return null;
        const value = child.props.value;
        return React.cloneElement(child, {
          isOpen: isOpen(value),
          onToggle: () => handleToggle(value),
        });
      })}
    </div>
  );
}

function AccordionItem({ className, value, isOpen, onToggle, children, ...props }) {
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find((c) => React.isValidElement(c) && c.type === AccordionTrigger);
  const content = childArray.find((c) => React.isValidElement(c) && c.type === AccordionContent);

  return (
    <div data-slot="accordion-item" className={cn("not-last:border-b border-border", className)} {...props}>
      {trigger && React.cloneElement(trigger, { isOpen, onToggle })}
      <AnimatePresence>
        {isOpen && content && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionTrigger({ className, isOpen, onToggle, children, ...props }) {
  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      className={cn(
        "group flex flex-1 items-center justify-between rounded-md border border-transparent py-4 text-left text-sm font-semibold text-foreground transition-all outline-none hover:no-underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={onToggle}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className="pointer-events-none ml-auto shrink-0"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </motion.span>
    </button>
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <div
      data-slot="accordion-content"
      className={cn("text-muted-foreground pb-4 pt-1 leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
