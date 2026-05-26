"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col gap-4">
      <motion.div
        className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", "*:min-h-48 *:w-full *:rounded-md")}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className={cn(
              i === 4 && "col-span-2 min-h-114! lg:col-span-4",
              (i === 5 || i === 6) && "col-span-2 min-h-92! lg:col-span-2",
            )}
          >
            <Skeleton className="h-full w-full" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
