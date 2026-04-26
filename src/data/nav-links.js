import { AirVent, Layers, LayoutGrid } from "lucide-react";

export const productLinks = [
  {
    label: "All Products",
    href: "/items",
    icon: <LayoutGrid />,
  },
  {
    label: "AC Units",
    href: "/items/ac_units",
    icon: <AirVent />,
  },
  {
    label: "AC Parts",
    href: "/items/ac_parts",
    icon: <Layers />,
  },
];
