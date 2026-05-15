import { Wrench, CreditCard, Truck, Package, Users } from "lucide-react";

export const quickHelpItems = [
  {
    icon: "Calculator",
    title: "Get a Quote",
    desc: "Request a customized quote for your project",
  },
  {
    icon: "Truck",
    title: "Track Order",
    desc: "Check the status of your shipment",
  },
  {
    icon: "Wrench",
    title: "Technical Support",
    desc: "Get help with installation and maintenance",
  },
  {
    icon: "MessageSquare",
    title: "Live Chat",
    desc: "Chat with our support team",
  },
];

export const contactInfo = {
  email: "support@coldflyer.com",
  phone: "1-800-COLD-FLYER",
  hours: "Mon-Fri, 9AM-6PM EST",
};

export const categories = [
  {
    icon: Wrench,
    name: "Products & Services",
    questions: [
      {
        q: "What types of HVAC systems do you offer?",
        a: "We offer a comprehensive range of industrial and commercial HVAC solutions including central air conditioning units, split systems, VRF systems, chillers, heat pumps, and custom refrigeration units. Our catalog includes leading brands and custom solutions for specialized applications.",
      },
      {
        q: "Do you provide installation services?",
        a: "Yes, we provide professional installation services through our certified network of HVAC technicians. Our team handles projects of all sizes, from small commercial setups to large industrial installations. Request a quote for installation assistance.",
      },
      {
        q: "What brands do you work with?",
        a: "We partner with industry-leading manufacturers including Carrier, Trane, LG, Samsung, Daikin, and Mitsubishi. Our product selection ensures you find the perfect solution for any requirement and budget.",
      },
      {
        q: "Can I get a custom HVAC solution?",
        a: "Absolutely. We specialize in custom HVAC solutions for unique industrial requirements. Our engineering team works closely with you to design and specify systems tailored to your specific needs.",
      },
    ],
  },
  {
    icon: CreditCard,
    name: "Orders & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards (Visa, MasterCard, American Express), bank wire transfers, and corporate purchase orders for verified businesses. All transactions are secured with industry-standard encryption.",
      },
      {
        q: "Do you offer financing options?",
        a: "Yes, we offer flexible financing options through our lending partners. Payment plans are available for qualified businesses with competitive rates. Contact our sales team for more information.",
      },
      {
        q: "How do I place a bulk order?",
        a: "For bulk orders, please contact our B2B sales team directly at b2b@coldflyer.com or call 1-800-COLD-FLYER. We offer volume discounts and dedicated account managers for large orders.",
      },
      {
        q: "Can I get a quote before ordering?",
        a: "Yes, we provide free quotes for all products and projects. Request a quote through our website or contact our sales team. Most quotes are generated within 24 hours.",
      },
    ],
  },
  {
    icon: Truck,
    name: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Shipping times vary by product and location. Standard shipping takes 7-14 business days, express shipping 3-5 business days. Heavy equipment may require additional time. Track your order for real-time updates.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship globally. International orders may require additional documentation and are subject to customs regulations. Contact us for specific international shipping quotes and requirements.",
      },
      {
        q: "How much is shipping?",
        a: "Shipping costs are calculated at checkout based on weight, dimensions, and destination. Orders over $500 qualify for free standard shipping. Freight shipping is available for large equipment.",
      },
      {
        q: "Can I track my order?",
        a: "Yes, all orders include tracking information. You'll receive tracking details via email once your order ships. Track your package through our website or the carrier's portal.",
      },
    ],
  },
  {
    icon: Package,
    name: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unused items in original packaging. Custom orders and installed items are not returnable. Contact our support team to initiate a return.",
      },
      {
        q: "How do warranties work?",
        a: "All products include manufacturer warranties typically ranging from 1-10 years depending on the product. Extended warranties are available at checkout. Register your product for warranty coverage.",
      },
      {
        q: "How do I file a warranty claim?",
        a: "To file a warranty claim, gather your purchase receipt and product serial number, then contact our support team. We'll guide you through the claims process and arrange repairs or replacements.",
      },
      {
        q: "Who handles repairs?",
        a: "Repairs are handled by our certified service network. Create a support ticket through your account or contact our service department directly for assistance with repairs.",
      },
    ],
  },
  {
    icon: Users,
    name: "Account & Support",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the navigation and complete the registration form. Accounts provide order tracking, history, and preferential pricing on many products.",
      },
      {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' link on the login page. You'll receive a password reset email. For security, the link expires after one hour.",
      },
      {
        q: "How can I contact support?",
        a: "Reach our support team via email at support@coldflyer.com, call 1-800-COLD-FLYER, or use the live chat feature. We're available Monday-Friday, 9AM-6PM.",
      },
      {
        q: "Is there a loyalty program?",
        a: "Yes, our loyalty program rewards repeat customers with exclusive discounts, early access to new products, and special offers. Enroll through your account dashboard.",
      },
    ],
  },
];
