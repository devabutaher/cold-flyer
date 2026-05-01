import {
  AirVent,
  HelpCircle,
  Layers,
  LayoutGrid,
  Settings,
  ShieldCheck,
} from "lucide-react";

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

export const serviceLinks = [
  {
    label: "Installation",
    href: "/services/installation",
    icon: <Settings />,
  },
  {
    label: "Maintenance",
    href: "/services/maintenance",
    icon: <ShieldCheck />,
  },
  {
    label: "Support",
    href: "/services/support",
    icon: <HelpCircle />,
  },
];
