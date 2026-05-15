"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ── Shared entrance variants ─────────────────────────────────
const entranceVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Subtle tilt on hover (opt-in via tilt prop) ──────────────
function useTilt(enabled) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), springConfig);

  const onMouseMove = enabled
    ? (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }
    : undefined;

  const onMouseLeave = enabled
    ? () => {
        x.set(0);
        y.set(0);
      }
    : undefined;

  return {
    rotateX: enabled ? rotateX : 0,
    rotateY: enabled ? rotateY : 0,
    onMouseMove,
    onMouseLeave,
  };
}

// ── Shimmer highlight that follows the cursor (opt-in) ───────
function useShimmer(enabled) {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const onMouseMove = enabled
    ? (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    : undefined;

  const onMouseLeave = enabled
    ? () => {
        mouseX.set(-200);
        mouseY.set(-200);
      }
    : undefined;

  const background = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => `radial-gradient(200px circle at ${mx}px ${my}px, oklch(1 0 0 / 0.05), transparent 80%)`,
  );

  return {
    background: enabled ? background : "none",
    onMouseMove,
    onMouseLeave,
  };
}

/**
 * Card
 *
 * Props (beyond standard div props):
 *   animate?    boolean   Entrance animation (default true)
 *   whileInView? boolean  Trigger on scroll vs mount (default true)
 *   tilt?       boolean   3D tilt on hover (default false)
 *   shimmer?    boolean   Cursor-following glow (default false)
 *   delay?      number    Stagger delay in seconds (default 0)
 *   size?       "sm" | "default"
 */
function Card({
  className,
  size = "default",
  animate = true,
  whileInView = true,
  tilt = false,
  shimmer = false,
  delay = 0,
  ...props
}) {
  const baseStyles = cn(
    "group/card relative flex flex-col gap-6 overflow-hidden rounded-xl bg-card py-6 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10",
    "has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4",
    "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
    className,
  );

  const tiltProps = useTilt(tilt);
  const shimmerProps = useShimmer(shimmer);

  // Merge mouse handlers from both hooks
  const mergedMouseMove = (e) => {
    tiltProps.onMouseMove?.(e);
    shimmerProps.onMouseMove?.(e);
  };
  const mergedMouseLeave = (e) => {
    tiltProps.onMouseLeave?.(e);
    shimmerProps.onMouseLeave?.(e);
  };

  if (!animate) {
    return <div data-slot="card" data-size={size} className={baseStyles} {...props} />;
  }

  return (
    <motion.div
      data-slot="card"
      data-size={size}
      className={baseStyles}
      // ── Entrance ──────────────────────────────────
      variants={entranceVariants}
      initial="hidden"
      {...(whileInView
        ? { whileInView: "visible", viewport: { once: true, margin: "-60px" } }
        : { animate: "visible" })}
      // ── Transition with optional delay ────────────
      transition={{
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      // ── Hover lift ────────────────────────────────
      whileHover={{ y: -3, boxShadow: "0 12px 32px -4px oklch(0 0 0 / 0.12)" }}
      // ── 3-D tilt (opt-in) ─────────────────────────
      style={{
        rotateX: tiltProps.rotateX,
        rotateY: tiltProps.rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={mergedMouseMove}
      onMouseLeave={mergedMouseLeave}
      {...props}
    >
      {/* Cursor shimmer overlay (opt-in) */}
      {shimmer && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-xl"
          style={{ background: shimmerProps.background }}
          aria-hidden
        />
      )}
      {props.children}
    </motion.div>
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-6",
        "group-data-[size=sm]/card:px-4",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "[.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base leading-normal font-medium group-data-[size=sm]/card:text-sm", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("px-6 group-data-[size=sm]/card:px-4", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4",
        "[.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
