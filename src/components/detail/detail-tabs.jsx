"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CircleAlert } from "lucide-react";

export function DetailTabs({ tabs }) {
  if (!tabs || !Array.isArray(tabs)) return null;

  const activeTabs = tabs.filter((tab) => tab.data && tab.data.length > 0);
  if (activeTabs.length === 0) return null;

  const defaultTab = activeTabs[0]?.key || "";

  return (
    <div className="mt-8 rounded-lg bg-card">
      <Tabs
        defaultValue={defaultTab}
        className="w-full flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-t-lg p-0 h-auto shrink-0">
          {activeTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="gap-1 rounded-t-md px-4 py-3"
            >
              {tab.icon && <tab.icon size={13} />} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {activeTabs.map((tab) => (
          <TabsContent
            key={tab.key}
            value={tab.key}
            className="p-4 pt-4 focus-visible:outline-none"
          >
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tab.data.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
                    ${tab.variant === "exclude" ? "bg-destructive/20" : "bg-accent"}
                  `}>
                    {tab.variant === "exclude" ? (
                      <CircleAlert size={11} className="text-destructive" strokeWidth={3} />
                    ) : (
                      <Check size={11} className="text-accent-foreground" strokeWidth={3} />
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {typeof item === "string" ? item : item.label || item.text}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default DetailTabs;
