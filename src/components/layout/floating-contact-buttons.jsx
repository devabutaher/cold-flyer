"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
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

  const pulseClass = "animate-whatsapp-pulse";

  return (
    <TooltipProvider>
      <div
        className={cn("fixed z-100 flex flex-col gap-3", "bottom-6 right-6", pwaMayShow && "max-sm:bottom-24")}
        style={{ opacity: 0, animation: "fadeInUp 0.5s ease-out 1.5s forwards" }}
      >
        {BUTTONS.map((btn) => (
          <Tooltip key={btn.key}>
            <TooltipTrigger asChild>
              <a
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
                  btn.pulse && !shouldReduceMotion && pulseClass,
                  "transition-transform duration-200 hover:-translate-y-1",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                  "active:scale-90",
                )}
                style={btn.pulse && !shouldReduceMotion ? { boxShadow: btn.hoverShadow } : undefined}
              >
                <btn.icon size={22} />
              </a>
            </TooltipTrigger>
            <TooltipContent side="left">{t(btn.labelKey)}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
