"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import Image from "next/image";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    detail: "09612-345678",
    sub: "Sat-Thu, 9AM-8PM",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@coldflyer.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "Dhaka, Bangladesh",
    sub: "Head office & showroom",
  },
  {
    icon: Clock,
    title: "Hours",
    detail: "Sat - Thu, 9AM - 8PM",
    sub: "Friday closed",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&q=80"
          alt="Contact us"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                Get In Touch
              </Badge>
            </motion.div>
            <motion.h1
              className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Let&apos;s <br />
              <span className="text-primary">Talk</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have a question about our products or services? Our team is ready to help.
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
                Contact Us
              </span>
              <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Tell us more about your inquiry..." rows={5} />
                </div>
                <Button size="lg" className="gap-2">
                  <Send size={16} /> Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    className="flex items-start gap-5 p-6 bg-card rounded-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.35, delay: i * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-lg mb-1">{method.title}</h3>
                      <p className="text-foreground font-medium">{method.detail}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{method.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-16">
            <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
              Our Location
            </span>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight">Find Us</h2>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f2ad600?w=1200&q=80"
              alt="Map location"
              fill
              sizes="100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur-sm rounded-xl p-6 text-center">
                <MapPin size={32} className="text-primary mx-auto mb-2" />
                <p className="font-medium">Dhaka, Bangladesh</p>
                <p className="text-sm text-muted-foreground">Visit our showroom</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Need urgent support?
            </h3>
            <p className="text-primary-foreground/70 text-sm">Call us now for emergency service.</p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            <Phone size={16} /> 09612-345678
          </Button>
        </div>
      </AnimatedSection>
    </main>
  );
}
