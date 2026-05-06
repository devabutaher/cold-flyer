"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Settings,
  Zap,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: Settings,
    title: "Precision Installation",
    desc: "Custom-engineered cooling solutions for data centers and large-scale industrial facilities where thermal management is mission-critical.",
    wide: true,
    variant: "light",
    cta: "View Case Studies",
  },
  {
    id: 2,
    icon: Activity,
    title: "Preventative Maintenance",
    desc: "AI-driven diagnostic checkups to extend equipment lifespan by up to 40% using predictive thermal modeling.",
    wide: false,
    variant: "primary",
    stat: "40%",
    statLabel: "Lifespan Increase",
  },
  {
    id: 3,
    icon: AlertCircle,
    title: "24/7 Repairs",
    desc: "Immediate, mission-critical restoration when every minute counts. Rapid deployment teams on standby.",
    wide: false,
    variant: "muted",
    badge: "EST. RESPONSE: 45 MIN",
  },
  {
    id: 4,
    icon: Zap,
    title: "Efficiency Tuning",
    desc: "Optimizing existing systems for maximum energy savings and peak thermal performance through retro-commissioning.",
    wide: true,
    variant: "light",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
  },
];

const steps = [
  { num: "01", title: "Consultation", desc: "In-depth site analysis and thermal load profiling for your facility." },
  { num: "02", title: "Engineering", desc: "Custom blueprinting using advanced thermodynamics modeling software." },
  { num: "03", title: "Execution", desc: "Zero-downtime installation led by OSHA-certified technicians." },
  { num: "04", title: "Optimization", desc: "Ongoing monitoring and fine-tuning for peak energy efficiency.", highlight: true },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={`
        ${service.wide ? "md:col-span-2" : ""}
        ${service.variant === "primary" ? "bg-primary text-primary-foreground p-10 rounded-xl flex flex-col justify-between" : ""}
        ${service.variant === "muted" ? "bg-secondary/40 p-10 rounded-xl flex flex-col justify-between" : ""}
        ${service.variant === "light" ? "bg-card p-10 rounded-xl relative overflow-hidden group" : ""}
      `}
    >
      {service.variant === "light" && !service.img && (
        <>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <Icon size={36} className="text-primary mb-6" />
              <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight mb-4 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                {service.desc}
              </p>
            </div>
            <button className="mt-12 flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-4 transition-all">
              {service.cta} <ArrowRight size={14} />
            </button>
          </div>
          <Icon size={200} className="absolute -right-8 -bottom-8 text-primary opacity-[0.04] group-hover:opacity-[0.07] transition-opacity" />
        </>
      )}
      
      {service.variant === "primary" && (
        <>
          <div>
            <Icon size={36} className="mb-6" />
            <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight mb-4">
              {service.title}
            </h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {service.desc}
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20">
            <div className="font-sans font-extrabold text-4xl">{service.stat}</div>
            <div className="text-xs uppercase tracking-widest font-bold text-primary-foreground/60 mt-1">
              {service.statLabel}
            </div>
          </div>
        </>
      )}
      
      {service.variant === "muted" && (
        <>
          <div>
            <Icon size={36} className="text-foreground mb-6" />
            <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight mb-4 text-foreground">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.desc}
            </p>
          </div>
          <div className="mt-8">
            <Badge className="bg-background text-primary font-extrabold text-xs tracking-widest">
              {service.badge}
            </Badge>
          </div>
        </>
      )}
      
      {service.variant === "light" && service.img && (
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          <div className="md:w-1/2">
            <Icon size={36} className="text-primary mb-6" />
            <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight mb-4 text-foreground">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              {service.desc}
            </p>
          </div>
          <div className="md:w-1/2 w-full rounded-lg overflow-hidden h-48 relative">
            <Image src={service.img} alt={service.title} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ProcessStep({ step, index }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center lg:items-start lg:text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 border-background shadow-sm ${
        step.highlight ? "bg-primary" : "bg-card"
      }`}>
        {step.highlight ? (
          <CheckCircle size={32} className="text-primary-foreground" />
        ) : (
          <span className="font-sans font-extrabold text-2xl text-primary">{step.num}</span>
        )}
      </div>
      <h4 className="font-sans font-extrabold text-lg mb-2 text-foreground">{step.title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed px-4 lg:px-0">{step.desc}</p>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80" alt="Industrial HVAC facility" fill priority loading="eager" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/70 via-foreground/50 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary mb-4 block">
                Industrial HVAC Excellence
              </Badge>
            </motion.div>
            <motion.h1
              className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Precision <br />
              <span className="text-primary">Climate</span> Services
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              From complex industrial installations to routine commercial maintenance, we keep your environment perfectly controlled.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="gap-2 text-base px-8 py-6">
                Start Your Project <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-foreground leading-none mb-4">
                Core Capabilities
              </h2>
              <p className="text-muted-foreground text-lg">
                Specialized environmental control systems for high-stakes infrastructure.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Live Monitoring Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-24 bg-secondary/30 overflow-hidden">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3 block">
              Our Workflow
            </span>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-foreground">
              Engineering Excellence
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-border z-0" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {steps.map((step, index) => (
                <ProcessStep key={step.num} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-5xl mx-auto">
            <motion.div
              className="w-full md:w-1/2 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full z-0" />
              <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80" alt="Client" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover rounded-xl shadow-2xl" />
            </motion.div>

            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl text-primary/20 font-extrabold leading-none mb-4">&#34;</div>
              <blockquote className="text-xl md:text-2xl font-sans font-semibold text-foreground italic leading-snug mb-8">
                The speed and technical expertise of the Cold Flyer team saved our data center during a cooling failure. Their preventative AI tools have since cut our energy costs by a third.
              </blockquote>
              <div>
                <h5 className="font-sans font-extrabold text-base tracking-tight text-foreground">Marcus Thorne</h5>
                <p className="text-muted-foreground text-sm">Facility Director, Nexus Cloud Systems</p>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/20 to-transparent" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h2 className="font-sans font-extrabold text-4xl md:text-6xl tracking-tight mb-8 max-w-3xl leading-tight">
            Ready to optimize your facility&#8217;s climate?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-10 py-6 text-lg gap-2">
              Schedule a Consultation <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-6 text-lg border-background/20 text-background bg-transparent hover:bg-background/10 hover:text-background">
              View Technical Specs
            </Button>
          </div>
          <p className="mt-12 text-background/40 font-bold text-xs tracking-widest uppercase">
            Trusted by Global Tech Leaders
          </p>
        </div>
      </AnimatedSection>
    </main>
  );
}