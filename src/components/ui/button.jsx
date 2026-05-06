"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
        outline:
          "border border-border bg-background text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xl: "h-12 gap-2 rounded-[min(var(--radius-md),14px)] px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Per-variant animation config — different buttons feel different
const VARIANT_MOTION = {
  // Primary CTA: crisp spring tap + a fast shimmer sweep on hover
  default: {
    whileHover: { scale: 1.015 },
    whileTap: { scale: 0.965 },
    transition: { type: "spring", stiffness: 500, damping: 22, mass: 0.6 },
    shimmer: true,
  },
  // Outline: gentle lift, no shimmer (border already adds hover feedback)
  outline: {
    whileHover: { y: -1 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
    shimmer: false,
  },
  // Secondary: same gentle lift
  secondary: {
    whileHover: { y: -1 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
    shimmer: false,
  },
  // Ghost: minimal — just a quick scale-down on tap
  ghost: {
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 500, damping: 25 },
    shimmer: false,
  },
  // Destructive: firm press, no scale-up (danger actions should feel weighty)
  destructive: {
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 500, damping: 22 },
    shimmer: false,
  },
  link: {
    transition: { duration: 0 },
    shimmer: false,
  },
};

// Light sweep that passes left→right on hover — only for default variant
function ShimmerLayer() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full"
      style={{
        background:
          "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.18) 50%, transparent 60%)",
      }}
      initial={false}
      variants={{
        rest: { x: "-100%", opacity: 0 },
        hover: {
          x: "100%",
          opacity: 1,
          transition: { duration: 0.45, ease: "easeInOut" },
        },
      }}
    />
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  animate = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const classNames = cn(buttonVariants({ variant, size, className }));

  // Honour prefers-reduced-motion and asChild (Slot doesn't accept motion props)
  if (!animate || asChild || shouldReduceMotion) {
    const Element = asChild ? Slot.Root : "button";
    return (
      <Element
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={classNames}
        {...props}
      />
    );
  }

  const motionCfg = VARIANT_MOTION[variant] ?? VARIANT_MOTION.default;
  const { shimmer, ...motionProps } = motionCfg;

  return (
    <motion.button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classNames}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      {...motionProps}
      {...props}
    >
      {shimmer && <ShimmerLayer />}
      {/* Content sits above the shimmer layer */}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">
        {props.children}
      </span>
    </motion.button>
  );
}

export { Button, buttonVariants };
