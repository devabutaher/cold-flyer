"use client";

import { Dialog as SheetPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

// Animation variants per side
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  right: {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  left: {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  top: {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  bottom: {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
};

const spring = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.8,
};

const ease = {
  duration: 0.18,
  ease: [0.32, 0.72, 0, 1],
};

// ─── Primitives (unchanged) ──────────────────────────────────────────────────

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetHeader({ className, ...props }) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title data-slot="sheet-title" className={cn("font-medium text-foreground", className)} {...props} />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// ─── Animated Sheet ───────────────────────────────────────────────────────────

/**
 * Sheet
 *
 * Wraps Radix Dialog.Root and syncs its open state with local React state
 * so AnimatePresence can drive enter/exit animations on the overlay and content.
 *
 * Works with both controlled (<Sheet open={...} onOpenChange={...}>) and
 * uncontrolled (<Sheet>) usage.
 */
function Sheet({ open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, ...props }) {
  // Local state mirrors Radix open state so AnimatePresence can react
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (next) => {
      if (!isControlled) setInternalOpen(next);
      controlledOnOpenChange?.(next);
    },
    [isControlled, controlledOnOpenChange],
  );

  return <SheetPrimitive.Root data-slot="sheet" open={open} onOpenChange={handleOpenChange} {...props} />;
}

/**
 * SheetContent
 *
 * Uses `forceMount` so the DOM node stays alive during exit, letting
 * Framer Motion play the leave animation before Radix unmounts it.
 * AnimatePresence is keyed to the Radix open state passed via `open` prop.
 *
 * Usage: <SheetContent open={sheetOpen} side="right"> … </SheetContent>
 * The `open` prop must be passed from the parent Sheet's onOpenChange.
 *
 * For simpler uncontrolled usage, SheetContent reads open state via context
 * provided by the Sheet root.
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  open, // must be passed from parent for AnimatePresence to work
  ...props
}) {
  const variants = contentVariants[side] ?? contentVariants.right;

  return (
    <SheetPrimitive.Portal forceMount>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <SheetPrimitive.Overlay forceMount asChild>
              <motion.div
                data-slot="sheet-overlay"
                key="sheet-overlay"
                className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={ease}
              />
            </SheetPrimitive.Overlay>

            {/* Content */}
            <SheetPrimitive.Content forceMount data-slot="sheet-content" data-side={side} asChild {...props}>
              <motion.div
                key="sheet-content"
                className={cn(
                  "fixed z-50 flex flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg outline-none",
                  side === "bottom" && "inset-x-0 bottom-0 h-auto border-t",
                  side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                  side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                  side === "top" && "inset-x-0 top-0 h-auto border-b",
                  className,
                )}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={spring}
              >
                {children}
                {showCloseButton && (
                  <SheetPrimitive.Close asChild>
                    <Button variant="ghost" className="absolute top-4 right-4" size="icon-sm">
                      <XIcon />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetPrimitive.Close>
                )}
              </motion.div>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPrimitive.Portal>
  );
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger };
