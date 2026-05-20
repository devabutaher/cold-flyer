"use client";

/**
 * Tooltip — Radix primitive + Framer Motion enter/exit animations.
 *
 * Replaces Tailwind's data-state animate-in/out with AnimatePresence
 * so the exit animation actually completes before unmount.
 *
 * API is identical to the original — no changes needed at call sites.
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { createContext, useContext, useState } from "react";

// Share open state with TooltipContent for AnimatePresence
const TooltipOpenContext = createContext(false);

// ── Per-side enter origin — tooltip slides in from the correct direction ──
const SIDE_VARIANTS = {
  top: { hidden: { y: 4 }, visible: { y: 0 } },
  bottom: { hidden: { y: -4 }, visible: { y: 0 } },
  left: { hidden: { x: 4 }, visible: { x: 0 } },
  right: { hidden: { x: -4 }, visible: { x: 0 } },
};

const BASE_VARIANTS = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(2px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

function buildVariants(side = "top") {
  const dir = SIDE_VARIANTS[side] ?? SIDE_VARIANTS.top;
  return {
    hidden: { ...BASE_VARIANTS.hidden, ...dir.hidden },
    visible: { ...BASE_VARIANTS.visible, ...dir.visible },
  };
}

// ── Provider — unchanged ─────────────────────────────────────
function TooltipProvider({ delayDuration = 0, ...props }) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

// ── Root — tracks open state ─────────────────────────────────
function Tooltip({ open: controlledOpen, onOpenChange, ...props }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;

  const handleChange = (next) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <TooltipOpenContext.Provider value={isOpen}>
      <TooltipPrimitive.Root data-slot="tooltip" open={isOpen} onOpenChange={handleChange} {...props} />
    </TooltipOpenContext.Provider>
  );
}

function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

// ── Content — AnimatePresence drives open/exit ───────────────
function TooltipContent({ className, sideOffset = 6, side = "top", children, ...props }) {
  const isOpen = useContext(TooltipOpenContext);
  const reduced = useReducedMotion();
  const variants = buildVariants(side);

  return (
    <TooltipPrimitive.Portal>
      <AnimatePresence>
        {isOpen && (
          <TooltipPrimitive.Content
            data-slot="tooltip-content"
            sideOffset={sideOffset}
            side={side}
            forceMount
            {...props}
          >
            <motion.div
              className={cn(
                "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-inverted px-3 py-1.5 text-xs text-inverted-foreground",
                "has-data-[slot=kbd]:pr-1.5",
                "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
                className,
              )}
              variants={reduced ? undefined : variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                // Enter: smooth ease-out
                visible: { duration: 0.18, ease: [0, 0, 0.2, 1] },
                // Exit: quick ease-in so it gets out of the way fast
                hidden: { duration: 0.12, ease: [0.4, 0, 1, 1] },
              }}
            >
              {children}
              <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
            </motion.div>
          </TooltipPrimitive.Content>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
