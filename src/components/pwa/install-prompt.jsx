"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) return;

    const hasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (hasDismissed) {
      const dismissedAt = parseInt(hasDismissed, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80"
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Download size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Install Cold Flyer</h4>
                  <p className="text-xs text-muted-foreground">
                    Add to home screen for quick access
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleInstall}>
                Install
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={handleDismiss}>
                Maybe later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
