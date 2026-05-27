"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

function guessVariant(initial = {}, animate = {}, whileInView = {}) {
  const target = { ...animate, ...whileInView };
  if (target.y !== undefined) return "fade-up";
  if (target.x !== undefined) return "fade-left";
  if (target.scale !== undefined) return "scale-up";
  return "fade";
}

const variantMap = {
  fadeUp: "fade-up",
  fadeIn: "fade",
  fadeLeft: "fade-left",
  fadeRight: "fade-right",
  scaleUp: "scale-up",
};

export function AnimatedDiv({
  children,
  className,
  as = "div",
  initial: _initial,
  animate: _animate,
  transition,
  whileInView: _whileInView,
  viewport,
  whileHover: _whileHover,
  ...props
}) {
  const { ref, inView } = useInView({
    once: viewport?.once ?? true,
    margin: viewport?.margin ?? "-60px",
  });

  const Component = as;
  const variant = variantMap[guessVariant(_initial, _animate, _whileInView)];
  const delay = transition?.delay;

  return (
    <Component
      ref={ref}
      className={cn(`animate-in-${variant}`, className)}
      data-in-view={inView || undefined}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
