"use client";

import { motion } from "framer-motion";

export function AnimatedDiv({ children, className, as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return <Component className={className} {...props}>{children}</Component>;
}
