import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Check, Wrench, Zap } from "lucide-react";
import { Tabs as TabsPrimitive } from "radix-ui";

export default function InfoTabs({ product }) {
  return (
    <TabsPrimitive.Root
      defaultValue="features"
      className="mt-6 w-full flex flex-col"
    >
      <TabsList className="w-full flex items-center overflow-x-auto scrollbar-none">
        <TabsTrigger value="features" className="gap-1">
          <Zap size={13} /> Features
        </TabsTrigger>
        <TabsTrigger value="specs" className="gap-1">
          <Wrench size={13} /> Specifications
        </TabsTrigger>
        <TabsTrigger value="inbox" className="gap-1">
          <Box size={13} /> In the Box
        </TabsTrigger>
      </TabsList>

      <TabsContent value="features" className="pt-5 w-full">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <Check
                  size={11}
                  className="text-accent-foreground"
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="specs" className="pt-5 w-full">
        <div className="divide-y divide-border/50">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between py-2.5 text-sm">
              <span className="text-muted-foreground font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span className="font-semibold text-foreground text-right max-w-[55%]">
                {val}
              </span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inbox" className="pt-5 w-full">
        <ul className="divide-y divide-border/40">
          {product.inBox.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5">
              <Box size={14} className="text-primary shrink-0" />
              <span className="text-sm text-foreground font-medium">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </TabsContent>
    </TabsPrimitive.Root>
  );
}
