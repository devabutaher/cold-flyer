"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { setCookie } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "bn" : "en";
    setCookie("NEXT_LOCALE", newLocale, 365);
    router.refresh();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLocale}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
    >
      <Globe size={16} className="shrink-0" />
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="uppercase font-medium"
      >
        {locale === "bn" ? "বাংলা" : "EN"}
      </motion.span>
    </motion.button>
  );
}
