import { AirVent, Briefcase, FileText, HelpCircle, Layers, LayoutGrid, Mail, Settings, ShieldCheck, Truck, Users } from "lucide-react";

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

export const primaryLinks = [
  {
    label: "Services",
    href: "/services",
    icon: <Settings />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <Mail />,
  },
  {
    label: "About",
    href: "/about",
    icon: <Users />,
  },
];

export const moreLinks = [
  {
    label: "Blog",
    href: "/blog",
    icon: <FileText />,
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: <HelpCircle />,
  },
  {
    label: "Careers",
    href: "/careers",
    icon: <Briefcase />,
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    icon: <ShieldCheck />,
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
    icon: <FileText />,
  },
  {
    label: "Shipping & Returns",
    href: "/shipping",
    icon: <Truck />,
  },
];

export const mainNavLinks = [
  {
    category: "Products",
    links: productLinks,
  },
];
