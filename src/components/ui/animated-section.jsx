"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
};

const transitionConfig = {
  fast: { duration: 0.25, ease: "easeOut" },
  normal: { duration: 0.4, ease: "easeOut" },
  slow: { duration: 0.6, ease: "easeInOut" },
};

export function AnimatedSection({
  children,
  className,
  variant = "fadeUp",
  transition = "normal",
  delay = 0,
  once = true,
  margin = "-50px",
  as = "section",
  id,
  ...props
}) {
  const Component = motion[as] || motion.section;

  return (
    <Component
      id={id}
      className={className}
      initial={sectionVariants[variant].initial}
      whileInView={sectionVariants[variant].animate}
      viewport={{
        once,
        margin,
      }}
      transition={{
        ...transitionConfig[transition],
        delay,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
