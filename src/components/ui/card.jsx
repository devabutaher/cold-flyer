"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";
import { useRef, useCallback } from "react";

function useTilt(enabled) {
  const rafRef = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        e.currentTarget.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
      });
    },
    [enabled],
  );

  const onMouseLeave = useCallback(
    (e) => {
      if (!enabled) return;
      cancelAnimationFrame(rafRef.current);
      e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    },
    [enabled],
  );

  return { onMouseMove, onMouseLeave };
}

function useShimmerHandler(enabled) {
  const rafRef = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    },
    [enabled],
  );

  const onMouseLeave = useCallback(() => {
    if (!enabled) return;
    cancelAnimationFrame(rafRef.current);
  }, [enabled]);

  return { onMouseMove, onMouseLeave };
}

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
  const { ref, inView } = useInView({ once: whileInView, margin: "-60px" });

  const baseStyles = cn(
    "group/card relative flex flex-col gap-6 overflow-hidden rounded-xl bg-card py-6 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 dark:ring-foreground/20",
    "has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4",
    "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
    tilt && "card-tilt",
    className,
  );

  const tiltProps = useTilt(tilt);
  const shimmerProps = useShimmerHandler(shimmer);

  const mergedMouseMove = (e) => {
    tiltProps.onMouseMove?.(e);
    shimmerProps.onMouseMove?.(e);
  };

  const mergedMouseLeave = (e) => {
    tiltProps.onMouseLeave?.(e);
    shimmerProps.onMouseLeave?.(e);
  };

  if (!animate) {
    return <div ref={ref} data-slot="card" data-size={size} className={baseStyles} {...props} />;
  }

  return (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      data-shimmer={shimmer || undefined}
      data-in-view={inView || undefined}
      className={cn("animate-in-fade-up", baseStyles)}
      style={{ animationDelay: delay ? `${delay}s` : undefined }}
      onMouseMove={mergedMouseMove}
      onMouseLeave={mergedMouseLeave}
      {...props}
    >
      {props.children}
    </div>
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
