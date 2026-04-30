"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Scale, AlertTriangle } from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing and using the Cold Flyer website and services, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using Cold Flyer's services, you shall be subject to any posted guidelines or rules applicable to such services.",
  },
  {
    id: "products",
    title: "Products and Services",
    content:
      "Cold Flyer provides industrial HVAC solutions, including air conditioning units, components, and related services. All products are subject to availability. We reserve the right to modify product specifications, pricing, and availability without prior notice.",
  },
  {
    id: "orders",
    title: "Orders and Payment",
    content:
      "Orders placed through our platform are subject to acceptance and confirmation. We accept major credit cards and wire transfers for payment. All prices are displayed in USD unless otherwise specified. Taxes and shipping fees are calculated at checkout.",
  },
  {
    id: "shipping",
    title: "Shipping and Delivery",
    content:
      "Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the carrier. We are not responsible for delays caused by customs, force majeure, or carrier issues. Insurance is recommended for all shipments.",
  },
  {
    id: "warranty",
    title: "Warranty and Returns",
    content:
      "Products come with manufacturer warranties as specified in product documentation. Warranty claims must be filed within the warranty period with proof of purchase. Custom or specially ordered items are not returnable. Restocking fees may apply to approved returns.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content:
      "All content on this website, including text, graphics, logos, and images, is the property of Cold Flyer or its content suppliers and is protected by international copyright laws. Unauthorized reproduction is prohibited.",
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content:
      "Cold Flyer shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount paid by you for the products or services giving rise to the claim.",
  },
  {
    id: "privacy",
    title: "Privacy and Data Protection",
    content:
      "We collect and process personal data in accordance with our Privacy Policy. By using our services, you consent to such processing. We implement appropriate security measures to protect your personal information.",
  },
  {
    id: "applicable-law",
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Cold Flyer operates. Any disputes shall be resolved in the courts of that jurisdiction.",
  },
  {
    id: "contact",
    title: "Contact Information",
    content:
      "For questions about these Terms and Conditions, please contact us at legal@coldflyer.com or call our customer service line.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1504711925240-86e116af50ad?w=1400&q=80"
          alt="Legal documents"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/90 via-foreground/60 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs bg-primary text-primary-foreground">
              Legal
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Terms & <br />
              <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Please read these terms carefully before using our products and
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-secondary/40 border-b border-border/30">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={16} />
              <span>Last Updated: April 29, 2026</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-primary font-medium">
              <Scale size={16} />
              <span>Version 2.1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Table of Contents */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="p-6 bg-card rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-primary" />
                    <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider">
                      Quick Navigation
                    </h3>
                  </div>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={18}
                      className="text-destructive shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-sans font-extrabold text-sm mb-1">
                        Important Notice
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By using this website, you acknowledge that you have
                        read and understood these terms and agree to be bound
                        by them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="lg:col-span-8 space-y-16">
              {sections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-sans font-extrabold text-sm text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Agreement Box */}
              <div className="mt-16 p-8 bg-card rounded-xl border border-border/30">
                <h3 className="font-sans font-extrabold text-xl mb-4">
                  Agreement to Terms
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  By accessing this website, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms and
                  Conditions. If you do not agree to these terms, please do not
                  use our services.
                </p>
                <Button>Accept Terms</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}