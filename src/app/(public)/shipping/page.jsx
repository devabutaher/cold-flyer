"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Box,
  Calendar,
  Clock,
  Globe,
  Package,
  RefreshCw,
  ShieldCheck,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";
import { shippingOptions, process, returns, restrictions } from "@/data/shipping-data";

export default function ShippingPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-foreground">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1170&auto=format&fit=crop"
          alt="Shipping warehouse"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/60 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">
              Delivery & Returns
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Shipping <br />
              <span className="text-primary">& Returns</span>
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Reliable delivery solutions and flexible return options for your
              peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
                Delivery Methods
              </span>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Shipping Options
              </h2>
            </div>

            <p className="max-w-md font-medium text-muted-foreground">
              Choose the delivery method that best fits your timeline and budget.
              Free shipping available for qualifying orders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {shippingOptions.map((option) => {
              const Icon = option.icon;

              return (
                <div
                  key={option.title}
                  className="group rounded-xl bg-card p-10 hover:shadow-lg transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Icon size={44} className="text-primary" />
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-primary">
                        {option.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.time}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-sans text-2xl font-extrabold text-foreground mb-3">
                    {option.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-28 bg-secondary/40">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-20 bg-primary rounded-full" />
                <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                  From Order to Doorstep
                </h2>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Our streamlined delivery process ensures your equipment arrives
                safely and on time, every time.
              </p>

              <div className="flex items-center gap-6 p-8 bg-card rounded-xl shadow-md">
                <div className="font-sans font-extrabold text-6xl text-primary leading-none">
                  24/7
                </div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground leading-tight">
                  Order <br />
                  Support
                </div>
              </div>

              <Button size="lg" className="gap-2">
                Track Your Order <Package size={16} />
              </Button>
            </div>

            <div className="md:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {process.map((p) => (
                  <div key={p.step} className="bg-card rounded-xl p-6">
                    <div className="font-sans font-extrabold text-3xl text-primary/30 mb-3">
                      {p.step}
                    </div>
                    <h4 className="font-sans font-extrabold text-lg mb-2">
                      {p.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Policy */}
      <section className="py-28 bg-foreground text-background">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-background mb-5">
              Returns Made Simple
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {returns.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-xl bg-card p-10 hover:bg-card/80 transition-all duration-500"
                >
                  <Icon
                    size={44}
                    className="mb-7 text-primary group-hover:text-primary transition-colors"
                  />

                  <h3 className="font-sans text-2xl font-extrabold text-foreground mb-3 group-hover:text-background transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-background/70 transition-colors">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return Restrictions */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80"
                  alt="Package return"
                  fill
                  className="object-cover opacity-80"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                Important Info
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                Return Restrictions
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                To maintain product quality and safety, certain items cannot be returned:
              </p>

              <ul className="space-y-4">
                {restrictions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Strip */}
      <section className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Still have questions?
            </h3>
            <p className="text-primary-foreground/70 text-sm">
              Our shipping team is here to help with any inquiries.
            </p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            <Clock size={16} /> Contact Shipping Team
          </Button>
        </div>
      </section>
    </main>
  );
}