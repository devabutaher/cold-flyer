"use client";

import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QuantityInput({ quantity, min = 1, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      <motion.button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Minus size={13} />
      </motion.button>
      <div className="relative w-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={quantity}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex h-full w-full items-center justify-center text-sm font-semibold tabular-nums text-foreground"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.button
        onClick={() => onChange(quantity + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus size={13} />
      </motion.button>
    </div>
  );
}
