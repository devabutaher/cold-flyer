"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Check, Wrench, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InfoTabs({ product }) {
  const t = useTranslations("common");
  if (!product) return null;

  const features = product.features || [];
  const specs = product.specs || {};
  const inBox = product.inBox || [];

  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasSpecs = typeof specs === "object" && Object.keys(specs).length > 0;
  const hasInBox = Array.isArray(inBox) && inBox.length > 0;

  if (!hasFeatures && !hasSpecs && !hasInBox) return null;

  return (
    <div className="mt-8 rounded-lg bg-card">
      <Tabs defaultValue={hasFeatures ? "features" : hasSpecs ? "specs" : "inbox"} className="w-full flex flex-col">
        <TabsList className="w-full justify-start rounded-t-lg p-0 h-auto shrink-0 overflow-x-auto scrollbar-none">
          {hasSpecs && (
            <TabsTrigger value="specs" className="gap-1 rounded-t-md px-3 sm:px-4 py-3">
              <Wrench size={13} /> <span className="whitespace-nowrap">{t("specifications")}</span>
            </TabsTrigger>
          )}
          {hasFeatures && (
            <TabsTrigger value="features" className="gap-1 rounded-t-md px-3 sm:px-4 py-3">
              <Zap size={13} /> <span className="whitespace-nowrap">{t("features")}</span>
            </TabsTrigger>
          )}
          {hasInBox && (
            <TabsTrigger value="inbox" className="gap-1 rounded-t-md px-3 sm:px-4 py-3">
              <Box size={13} /> <span className="whitespace-nowrap">{t("whatsInTheBox")}</span>
            </TabsTrigger>
          )}
        </TabsList>

        {hasFeatures && (
          <TabsContent value="features" className="p-3 sm:p-4 pt-4 focus-visible:outline-none overflow-x-hidden">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-accent-foreground" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-muted-foreground break-words">{f}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}

        {hasSpecs && (
          <TabsContent value="specs" className="p-3 sm:p-4 pt-4 focus-visible:outline-none overflow-x-hidden">
            <div className="divide-y divide-border/50">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-2 py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium capitalize shrink-0">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-semibold text-foreground text-right break-words max-w-[60%]">{val}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        )}

        {hasInBox && (
          <TabsContent value="inbox" className="p-3 sm:p-4 pt-4 focus-visible:outline-none overflow-x-hidden">
            <ul className="divide-y divide-border/40">
              {inBox.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5">
                  <Box size={14} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground font-medium break-words">{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
