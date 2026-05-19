"use client";

import { cn } from "@/lib/utils";

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 40,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const duration = speed;
  const hoverDuration = speedOnHover;

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{
        "--slide-duration": `${duration}s`,
        "--slide-duration-hover": hoverDuration ? `${hoverDuration}s` : undefined,
        "--slide-gap": `${gap}px`,
        "--slide-direction": reverse ? "reverse" : "normal",
      }}
    >
      <div
        className={cn(
          "flex w-max animate-marquee",
          direction === "horizontal" ? "flex-row" : "flex-col",
        )}
        style={{
          gap: `${gap}px`,
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: `var(--slide-duration)`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
        onMouseEnter={
          hoverDuration
            ? (e) => {
                e.currentTarget.style.animationDuration = `var(--slide-duration-hover)`;
              }
            : undefined
        }
        onMouseLeave={
          hoverDuration
            ? (e) => {
                e.currentTarget.style.animationDuration = `var(--slide-duration)`;
              }
            : undefined
        }
      >
        {children}
        {children}
      </div>
    </div>
  );
}
