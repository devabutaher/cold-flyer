"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse, Wrench } from "lucide-react";

const TYPES = [
  {
    value: "unit",
    label: "AC Unit",
    description: "Complete air conditioner units",
    icon: Warehouse,
  },
  {
    value: "part",
    label: "AC Part",
    description: "Replacement parts and accessories",
    icon: Wrench,
  },
];

export function ProductTypeSelector({ value, onChange }) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 h-auto p-1 bg-muted rounded-lg">
        {TYPES.map((type) => (
          <TabsTrigger
            key={type.value}
            value={type.value}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <type.icon size={18} />
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{type.label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
