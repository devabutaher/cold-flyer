"use client";

import { motion } from "framer-motion";
import { animations, transitionTokens } from "@/lib/animation";

export function AnimatedSection({
  children,
  className,
  variant = "fadeUp",
  transition = "normal",
  delay = 0,
  once = true,
  margin = "-60px",
  as = "section",
  id,
  ...props
}) {
  const Component = motion[as] || motion.section;

  return (
    <Component
      id={id}
      className={className}
      variants={animations.entrance[variant] || animations.entrance.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        margin,
      }}
      transition={{
        ...transitionTokens[transition],
        delay,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
