import {
  AirVent,
  Briefcase,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  Mail,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

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

export const primaryLinks = [
  {
    label: "সেবা",
    href: "/services",
    icon: <Settings />,
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
    icon: <Mail />,
  },
  {
    label: "আমাদের সম্পর্কে",
    href: "/about",
    icon: <Users />,
  },
];

export const moreLinks = [
  {
    label: "সাম্প্রতিক কাজ",
    href: "/recent-works",
    icon: <Briefcase />,
  },
  {
    label: "ব্লগ",
    href: "/blog",
    icon: <FileText />,
  },
  {
    label: "প্রশ্নোত্তর",
    href: "/faq",
    icon: <HelpCircle />,
  },
  {
    label: "ক্যারিয়ার",
    href: "/careers",
    icon: <Briefcase />,
  },
  {
    label: "শিপিং এবং রিটার্ন",
    href: "/shipping",
    icon: <Truck />,
  },
];

export const mainNavLinks = [
  {
    category: "পণ্য",
    links: productLinks,
  },
];
