import { AirVent, FileText, HelpCircle, Layers, LayoutGrid, Settings, ShieldCheck, Users } from "lucide-react";

export const productLinks = [
  {
    label: "সব পণ্য",
    href: "/items",
    icon: <LayoutGrid />,
  },
  {
    label: "এসি ইউনিট",
    href: "/items/ac_units",
    icon: <AirVent />,
  },
  {
    label: "এসি যন্ত্রাংশ",
    href: "/items/ac_parts",
    icon: <Layers />,
  },
];

export const serviceLinks = [
  {
    label: "ইনস্টলেশন",
    href: "/services/installation",
    icon: <Settings />,
  },
  {
    label: "রক্ষণাবেক্ষণ",
    href: "/services/maintenance",
    icon: <ShieldCheck />,
  },
  {
    label: "সাপোর্ট",
    href: "/services/support",
    icon: <HelpCircle />,
  },
];

export const staticLinks = [
  {
    label: "সেবা",
    href: "/services",
    icon: <Settings />,
  },
  {
    label: "আমাদের সম্পর্কে",
    href: "/about",
    icon: <Users />,
  },
  {
    label: "শর্তাবলী",
    href: "/terms",
    icon: <FileText />,
  },
];

export const mainNavLinks = [
  {
    category: "পণ্য",
    links: productLinks,
  },
];
