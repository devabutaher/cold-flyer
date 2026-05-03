"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Package } from "lucide-react";

const PRODUCT_TYPES = [
  {
    value: "unit",
    label: "AC Unit",
    icon: Package,
    description: "Complete air conditioning units",
  },
  {
    value: "part",
    label: "AC Part",
    icon: Box,
    description: "Parts, filters, and accessories",
  },
];

export function ProductTypeSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Tabs value={value} onValueChange={onChange} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 h-11">
          {PRODUCT_TYPES.map(({ value: v, label, icon: Icon }) => (
            <TabsTrigger key={v} value={v} className="gap-2 text-sm">
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-xs text-muted-foreground">
        {PRODUCT_TYPES.find((t) => t.value === value)?.description}
      </p>
    </div>
  );
}
