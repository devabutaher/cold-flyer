import {
  AirVent,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Users,
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

export const staticLinks = [
  {
    label: "About",
    href: "/about",
    icon: <Users />,
  },
  {
    label: "Terms",
    href: "/terms",
    icon: <FileText />,
  },
];

export const mainNavLinks = [
  {
    category: "Products",
    links: productLinks,
  },
  {
    category: "Services",
    links: serviceLinks,
  },
];
