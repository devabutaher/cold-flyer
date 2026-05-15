"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Clock,
  HelpCircle,
  Home,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Settings,
  Truck,
  Wrench,
} from "lucide-react";
import { categories, contactInfo } from "@/data/faq-data";

export default function FAQPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-foreground">
        <Image
          src="https://images.unsplash.com/photo-1665789318391-6057c533005e?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="FAQ support"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/60 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">Help Center</Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Frequently <br />
              <span className="text-primary">Asked Questions</span>
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Find answers to common questions about our products, services, and policies.
            </p>
          </div>
        </div>
      </section>

      {/* Search Help */}
      <section className="py-16 bg-secondary/40 border-b border-border/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Can&#8217;t find what you&#8217;re looking for?{" "}
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
                <Calculator size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">Get a Quote</h4>
              <p className="text-sm text-muted-foreground">Request a customized quote for your project</p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Truck size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">Track Order</h4>
              <p className="text-sm text-muted-foreground">Check the status of your shipment</p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Wrench size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">Technical Support</h4>
              <p className="text-sm text-muted-foreground">Get help with installation and maintenance</p>
            </div>

            <div className="group text-center p-8 bg-card rounded-xl hover:shadow-lg transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <MessageSquare
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h4 className="font-sans font-extrabold text-lg mb-2">Live Chat</h4>
              <p className="text-sm text-muted-foreground">Chat with our support team</p>
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
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight">Browse by Category</h2>
          </div>

          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.name} className="bg-card rounded-2xl overflow-hidden">
                <div className="p-8 bg-card border-b border-border/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl">{category.name}</h3>
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
                        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
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
                We&#8217;re Here to <br /> Help
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Can&#8217;t find the answer you&#8217;re looking for? Our dedicated support team is ready to assist you
                with any questions.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-muted">support@coldflyer.com</div>
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
                    <div className="text-sm text-muted">Mon-Fri, 9AM-6PM EST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                  alt="Customer support"
                  fill
                  className="object-cover opacity-80"
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
            <p className="text-primary-foreground/70 text-sm">Browse our products or request a quote today.</p>
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
