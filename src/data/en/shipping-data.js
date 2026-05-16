import { Truck, Ship, Globe, Warehouse, RefreshCw, Box, ShieldCheck, Calendar } from "lucide-react";

export const shippingOptions = [
  {
    icon: Truck,
    title: "Standard Shipping",
    time: "7-14 Business Days",
    price: "Free for orders over BDT 25,000",
    description: "Reliable ground shipping across all 64 districts of Bangladesh. Perfect for scheduled projects.",
  },
  {
    icon: Ship,
    title: "Express Shipping",
    time: "2-4 Business Days",
    price: "BDT 1,500",
    description: "Fast delivery for time-sensitive orders within Dhaka and major city divisions. Includes priority handling.",
  },
  {
    icon: Globe,
    title: "International Shipping",
    time: "10-21 Business Days",
    price: "Calculated at Checkout",
    description: "Global coverage with customs clearance assistance for bulk and commercial orders. Duties may apply.",
  },
  {
    icon: Warehouse,
    title: "Freight Shipping",
    time: "5-10 Business Days",
    price: "Quote-Based",
    description: "For large equipment and bulk orders. Includes loading dock delivery across Bangladesh industrial zones.",
  },
];

export const process = [
  { step: "01", title: "Order Processing", desc: "We verify and prepare your items within 24-48 hours." },
  { step: "02", title: "Packaging", desc: "Industrial-grade packaging ensures safe transport in all weather conditions." },
  { step: "03", title: "Shipment", desc: "Your order is dispatched via our trusted delivery partners across Bangladesh." },
  { step: "04", title: "Track & Deliver", desc: "Real-time tracking via SMS and email until final delivery to your doorstep." },
];

export const returns = [
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "Return any unused item within 30 days of delivery. No questions asked for standard items.",
  },
  {
    icon: Box,
    title: "Original Packaging",
    desc: "Items must be returned in original packaging with all accessories and labels intact.",
  },
  {
    icon: ShieldCheck,
    title: "Refund Process",
    desc: "Refunds are processed within 5-7 business days after inspection. Original shipping costs may apply.",
  },
  {
    icon: Calendar,
    title: "Exchange Option",
    desc: "Prefer a different product? We offer hassle-free exchanges for alternative sizes or models.",
  },
];

export const restrictions = [
  "Custom or specially ordered items are non-returnable",
  "Items that have been installed or used are not eligible for return",
  "Products past 30-day return window",
  "Items damaged due to improper installation or misuse",
  "Specialty refrigeration units may have modified return terms",
];
