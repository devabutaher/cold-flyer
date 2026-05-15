"use client";

/**
 * Tabs — Radix primitive + Framer Motion animations.
 *
 * Two animation layers:
 *  1. `TabsList` — a `layoutId` pill slides between active triggers
 *     (works for both "default" and "line" variants)
 *  2. `TabsContent` — active panel crossfades in with a subtle y-shift
 *
 * API is identical to the original. The only new prop is `animate`
 * on `Tabs` (default true) — set false to opt out of all animation.
 *
 * Usage:
 *   <Tabs defaultValue="tab1">
 *     <TabsList>
 *       <TabsTrigger value="tab1">One</TabsTrigger>
 *       <TabsTrigger value="tab2">Two</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="tab1">…</TabsContent>
 *     <TabsContent value="tab2">…</TabsContent>
 *   </Tabs>
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

// Context — shares activeTab + animate flag with children
const TabsContext = React.createContext({
  activeTab: "",
  animate: true,
  variant: "default",
});

// ── Root ─────────────────────────────────────────────────────
function Tabs({
  className,
  orientation = "horizontal",
  animate = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  ...props
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const activeTab = controlledValue ?? internalValue;

  const handleChange = (next) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ activeTab, animate }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
        value={activeTab}
        onValueChange={handleChange}
        {...props}
      />
    </TabsContext.Provider>
  );
}

// ── TabsList variants ─────────────────────────────────────────
const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

// Context for variant — needed inside TabsTrigger for the layout pill
const TabsVariantContext = React.createContext("default");

function TabsList({ className, variant = "default", ...props }) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

// ── TabsTrigger — sliding layout pill ────────────────────────
function TabsTrigger({ className, value, children, ...props }) {
  const { activeTab, animate } = React.useContext(TabsContext);
  const variant = React.useContext(TabsVariantContext);
  const reduced = useReducedMotion();
  const isActive = activeTab === value;

  // Shared layoutId groups all triggers' pills into one animated element.
  // Framer Motion moves a single DOM node between triggers smoothly.
  const LAYOUT_ID = "tabs-active-pill";

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors",
        "text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Active text colour — Framer pill handles background
        "data-[state=active]:text-foreground dark:data-[state=active]:text-foreground",
        // Line variant indicator
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
        "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-1.25 group-data-horizontal/tabs:after:h-0.5",
        "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className,
      )}
      {...props}
    >
      {/* Sliding background pill — only for "default" variant */}
      {isActive && animate && !reduced && variant === "default" && (
        <motion.span
          layoutId={LAYOUT_ID}
          className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
            mass: 0.5,
          }}
          style={{ zIndex: 0 }}
        />
      )}
      {/* Content sits above the pill */}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

// ── TabsContent — crossfade with subtle y-shift ───────────────
function TabsContent({ className, value, children, ...props }) {
  const { activeTab, animate } = React.useContext(TabsContext);
  const reduced = useReducedMotion();
  const isActive = activeTab === value;

  if (!animate || reduced) {
    return (
      <TabsPrimitive.Content
        data-slot="tabs-content"
        value={value}
        className={cn("flex-1 text-sm outline-none", className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Content>
    );
  }

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      value={value}
      forceMount
      asChild
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isActive && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
