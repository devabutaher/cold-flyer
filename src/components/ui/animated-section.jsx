"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const variantMap = {
  fadeUp: "fade-up",
  fadeIn: "fade",
  fadeLeft: "fade-left",
  fadeRight: "fade-right",
  scaleUp: "scale-up",
};

export function AnimatedSection({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  once = true,
  margin = "-60px",
  as = "section",
  id,
  ...props
}) {
  const { ref, inView } = useInView({ once, margin });
  const Component = as;
  const animClass = `animate-in-${variantMap[variant] || variant}`;

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(animClass, className)}
      data-in-view={inView || undefined}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
