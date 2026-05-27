"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const PHONE_NUMBER = "01626441900";
const WHATSAPP_NUMBER = "01626441900";
const WHATSAPP_MESSAGE = "Hi, I'd like to know more about Cold Flyer's products and services.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const PHONE_URL = `tel:${PHONE_NUMBER}`;

const BUTTONS = [
  {
    key: "whatsapp",
    href: WHATSAPP_URL,
    external: true,
    icon: MessageCircle,
    bgColor: "bg-[#25D366]",
    hoverShadow: "0 8px 24px rgba(37, 211, 102, 0.35)",
    pulse: true,
    labelKey: "chatOnWhatsApp",
  },
  {
    key: "phone",
    href: PHONE_URL,
    external: false,
    icon: Phone,
    bgColor: "bg-primary",
    hoverShadow: "0 8px 24px oklch(0.646 0.222 41.116 / 0.35)",
    pulse: false,
    labelKey: "callUs",
  },
];

export function FloatingContactButtons() {
  const t = useTranslations("common");
  const shouldReduceMotion = useReducedMotion();
  const [pwaMayShow, setPwaMayShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!isInstalled && !dismissed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPwaMayShow(true);
      }
    }
  }, []);

  return (
    <TooltipProvider>
      <motion.div
        className={cn("fixed z-100 flex flex-col gap-3", "bottom-6 right-6", pwaMayShow && "max-sm:bottom-24")}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
      >
        {BUTTONS.map((btn) => (
          <Tooltip key={btn.key}>
            <TooltipTrigger asChild>
              <motion.a
                href={btn.href}
                target={btn.external ? "_blank" : undefined}
                rel={btn.external ? "noopener noreferrer" : undefined}
                aria-label={t(btn.labelKey)}
                className={cn(
                  "relative flex items-center justify-center",
                  "w-14 h-14 rounded-full",
                  "shadow-lg",
                  btn.bgColor,
                  "text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                )}
                initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : btn.pulse
                      ? {
                          opacity: 1,
                          scale: [1, 1.06, 1],
                          transition: {
                            scale: {
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatDelay: 1,
                            },
                          },
                        }
                      : { opacity: 1, scale: 1 }
                }
                whileHover={shouldReduceMotion ? undefined : { y: -4, boxShadow: btn.hoverShadow }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 400, damping: 17 }}
              >
                <btn.icon size={22} />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="left">{t(btn.labelKey)}</TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
