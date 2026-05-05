"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Search,
  Settings,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const categories = [
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

export default function FAQPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1665789318391-6057c533005e?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="FAQ support"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/60 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">
              Help Center
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Frequently <br />
              <span className="text-primary">Asked Questions</span>
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Find answers to common questions about our products, services, and
              policies.
            </p>
          </div>
        </div>
      </section>

      {/* Search Help */}
      <section className="py-16 bg-secondary/40 border-b border-border/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Can't find what you're looking for?{" "}
              <a href="#contact" className="text-primary hover:underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Calculator
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">
                Get a Quote
              </h4>
              <p className="text-sm text-muted-foreground">
                Request a customized quote for your project
              </p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Truck
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">
                Track Order
              </h4>
              <p className="text-sm text-muted-foreground">
                Check the status of your shipment
              </p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Wrench
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">
                Technical Support
              </h4>
              <p className="text-sm text-muted-foreground">
                Get help with installation and maintenance
              </p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <MessageSquare
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">
                Live Chat
              </h4>
              <p className="text-sm text-muted-foreground">
                Chat with our support team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-28 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-20">
            <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
              Comprehensive Answers
            </span>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight">
              Browse by Category
            </h2>
          </div>

          <div className="space-y-12">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-card rounded-2xl overflow-hidden"
              >
                <div className="p-8 bg-card border-b border-border/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl">
                    {category.name}
                  </h3>
                </div>

                <div className="divide-y divide-border/30">
                  {category.questions.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="p-8 cursor-pointer flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                        <span className="font-medium text-lg">{faq.q}</span>
                        <HelpCircle
                          size={20}
                          className="text-muted-foreground group-open:text-primary shrink-0 transition-colors"
                        />
                      </summary>
                      <div className="px-8 pb-8">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-28 bg-foreground text-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                Still Need Help?
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                We're Here to <br /> Help
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Can't find the answer you're looking for? Our dedicated support
                team is ready to assist you with any questions.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-muted">
                      support@coldflyer.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-muted">1-800-COLD-FLYER</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Hours</div>
                    <div className="text-sm text-muted">
                      Mon-Fri, 9AM-6PM EST
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                  alt="Customer support"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Ready to get started?
            </h3>
            <p className="text-primary-foreground/70 text-sm">
              Browse our products or request a quote today.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Button variant="secondary" size="lg" className="gap-2">
              <Home size={16} /> Browse Products
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <Calculator size={16} /> Get Quote
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
