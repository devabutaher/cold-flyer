import { Shield, Globe, Eye, EyeOff, User } from "lucide-react";

export const principles = [
  {
    icon: User,
    title: "Your Data, Your Control",
    desc: "You have full authority over your personal information. Access, modify, or delete your data anytime through your account settings or by contacting us directly.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Protection",
    desc: "We employ bank-level encryption and security protocols to safeguard your information against unauthorized access, ensuring your data remains confidential.",
  },
  {
    icon: Globe,
    title: "Transparency First",
    desc: "No hidden clauses or surprise data uses. We believe in complete transparency about what data we collect and exactly how we use it.",
  },
  {
    icon: EyeOff,
    title: "Minimal Data Principle",
    desc: "We collect only what's essential. Every piece of data has a clear purpose, and we never gather more than necessary.",
  },
];

export const dataTypes = [
  {
    category: "Personal Information",
    items: [
      { name: "Full Name", description: "For identification and communication" },
      { name: "Email Address", description: "For account access and notifications" },
      { name: "Phone Number", description: "For order updates and support" },
      { name: "Company Details", description: "For business account management" },
    ],
  },
  {
    category: "Technical Data",
    items: [
      { name: "IP Address", description: "For security and analytics" },
      { name: "Browser Type", description: "For website optimization" },
      { name: "Device Information", description: "For mobile responsiveness" },
      { name: "Usage Patterns", description: "For improving our services" },
    ],
  },
  {
    category: "Transaction Data",
    items: [
      { name: "Order History", description: "For purchase records" },
      { name: "Payment Information", description: "For processing transactions" },
      { name: "Shipping Details", description: "For delivery coordination" },
      { name: "Communication History", description: "For customer support" },
    ],
  },
];

export const timeline = [
  { year: "2024", event: "Implemented GDPR compliance framework" },
  { year: "2025", event: "Launched data privacy dashboard" },
  { year: "2026", event: "Achieved ISO 27001 certification" },
  { year: "2027", event: "Introduced end-to-end encryption" },
];
