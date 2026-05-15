"use client";

/**
 * Collapsible — Radix primitive + Framer Motion height/fade animation.
 *
 * Same API as the original. The animation is driven by `open` state tracked
 * internally via `onOpenChange`, so it works with both controlled and
 * uncontrolled usage.
 *
 * Usage (uncontrolled):
 *   <Collapsible>
 *     <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *     <CollapsibleContent>…content…</CollapsibleContent>
 *   </Collapsible>
 *
 * Usage (controlled):
 *   <Collapsible open={open} onOpenChange={setOpen}>…</Collapsible>
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { createContext, useContext, useState } from "react";

// Share open state with CollapsibleContent without prop-drilling
const CollapsibleContext = createContext(false);

function Collapsible({ open: controlledOpen, onOpenChange, defaultOpen = false, ...props }) {
  // Support both controlled and uncontrolled
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;

  const handleChange = (next) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={isOpen}>
      <CollapsiblePrimitive.Root data-slot="collapsible" open={isOpen} onOpenChange={handleChange} {...props} />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ ...props }) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

/**
 * CollapsibleContent
 *
 * Uses `forceMount` on the Radix primitive so the DOM node always exists —
 * AnimatePresence then drives visibility with height + opacity, exactly
 * the same pattern as the fixed FAQ accordion.
 */
function CollapsibleContent({ children, ...props }) {
  const isOpen = useContext(CollapsibleContext);
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion: no animation, just show/hide
  if (shouldReduceMotion) {
    return (
      <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props}>
        {children}
      </CollapsiblePrimitive.CollapsibleContent>
    );
  }

  return (
    <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" forceMount asChild {...props}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="collapsible-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2, ease: "easeOut", delay: 0.05 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.15, ease: "easeIn" },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
