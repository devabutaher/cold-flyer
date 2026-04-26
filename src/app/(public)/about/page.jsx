"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Thermometer, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Thermometer,
    title: "Precision Engineering",
    desc: "Every millimeter matters. Our systems are designed with surgical accuracy to ensure peak performance under any atmospheric condition.",
    wide: true,
    hover: "bg-primary",
  },
  {
    icon: Leaf,
    title: "Sustainable Innovation",
    desc: "Pioneering low-carbon technologies that harmonize human comfort with planetary health.",
    wide: false,
    hover: "bg-foreground",
  },
  {
    icon: Users,
    title: "Customer-Centricity",
    desc: "We don't just sell systems; we build partnerships based on trust, transparency, and lifetime support.",
    wide: false,
    hover: "none",
  },
  {
    icon: Zap,
    title: "Operational Speed",
    desc: "Agility in response, efficiency in execution. We deliver mission-critical solutions at the speed of your business.",
    wide: true,
    hover: "none",
    img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80",
  },
];

const team = [
  {
    name: "Marcus Vane",
    role: "Chief Executive Officer",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Engineering",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    name: "Dr. Simon Chen",
    role: "Sustainability Lead",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

const stats = [
  { value: "15k+", label: "Projects Completed" },
  { value: "50+", label: "Global Partners" },
  { value: "32", label: "Countries Reached" },
  { value: "400M", label: "kWh Saved Annually" },
];

// Kinetic Pulse dot
function KineticPulse() {
  return (
    <span className="relative inline-block">
      <span
        className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-primary opacity-60"
        style={{ animation: "kpulse 2s infinite" }}
      />
      <style>{`
        @keyframes kpulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(2.5); opacity: 0;   }
          100% { transform: scale(1);   opacity: 0;   }
        }
      `}</style>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-dvh flex items-center overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&q=80"
          alt="HVAC facility"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/60 via-foreground/30 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">
              Precision Engineering
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Engineering <br />
              <span className="text-primary">the Future</span> <br />
              of Comfort
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Redefining thermal efficiency through kinetic innovation and
              architectural integration.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-20 bg-primary rounded-full" />
                <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                  Since 1998, we've pioneered the science of thermal dynamics.
                </h2>
              </div>

              <div className="flex items-center gap-6 p-8 bg-card rounded-xl shadow-md">
                <div className="font-sans font-extrabold text-6xl text-primary leading-none">
                  26
                </div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground leading-tight">
                  Years of <br /> Excellence
                </div>
              </div>

              <Button size="lg" className="gap-2">
                Our Story <ArrowRight size={16} />
              </Button>
            </div>

            <div className="md:col-span-7 space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Cold Flyer Industrial began with a singular focus: to solve the
                most complex climate challenges in high-stakes environments.
                What started as a small engineering firm in 1998 has evolved
                into a global leader in sustainable climate solutions.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our journey has been defined by a relentless pursuit of "Kinetic
                Efficiency"—the belief that climate control systems should not
                just respond to environments, but anticipate and adapt to them
                with minimal energy footprint.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/30">
                <div>
                  <div className="font-sans font-extrabold text-3xl text-primary mb-1 relative inline-block">
                    800+
                    <KineticPulse />
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-1">
                    Engineers
                  </div>
                </div>
                <div>
                  <div className="font-sans font-extrabold text-3xl text-primary mb-1 relative inline-block">
                    100%
                    <KineticPulse />
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-1">
                    Carbon Neutral Goal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-secondary/40 py-28">
        <div className="container">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
                Our DNA
              </span>

              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                The Kinetic Core
              </h2>
            </div>

            <p className="max-w-md font-medium text-muted-foreground">
              Guided by precision, fueled by innovation, and committed to a
              sustainable legacy for the built environment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              const isPrimaryHover = value.hover === "bg-primary";
              const isForegroundHover = value.hover === "bg-foreground";

              return (
                <div
                  key={value.title}
                  className={`
              group rounded-xl bg-card p-10 transition-all duration-500
              ${value.wide ? "md:col-span-2" : ""}
              ${
                isPrimaryHover
                  ? "hover:bg-primary"
                  : isForegroundHover
                    ? "hover:bg-foreground"
                    : "hover:shadow-lg"
              }
            `}
                >
                  {value.img ? (
                    <div className="flex flex-col items-center gap-10 md:flex-row">
                      <div className="flex-1">
                        <Icon size={44} className="mb-7 text-primary" />

                        <h3 className="mb-3 font-sans text-2xl font-extrabold text-foreground">
                          {value.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {value.desc}
                        </p>
                      </div>

                      <div className="h-44 w-full shrink-0 overflow-hidden rounded-lg transition-all duration-700 group-hover:grayscale-0 md:w-56 grayscale">
                        <img
                          src={value.img}
                          alt={value.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Icon
                        size={44}
                        className={`
                    mb-7 transition-colors
                    ${
                      isPrimaryHover
                        ? "text-primary group-hover:text-primary-foreground"
                        : isForegroundHover
                          ? "text-primary group-hover:text-primary"
                          : "text-primary"
                    }
                  `}
                      />

                      <h3
                        className={`
                    mb-3 font-sans text-2xl font-extrabold transition-colors
                    ${
                      isPrimaryHover
                        ? "text-foreground group-hover:text-primary-foreground"
                        : isForegroundHover
                          ? "text-foreground group-hover:text-background"
                          : "text-foreground"
                    }
                  `}
                      >
                        {value.title}
                      </h3>

                      <p
                        className={`
                    text-sm leading-relaxed transition-colors
                    ${
                      isPrimaryHover
                        ? "text-muted-foreground group-hover:text-primary-foreground/80"
                        : isForegroundHover
                          ? "text-muted-foreground group-hover:text-background/70"
                          : "text-muted-foreground"
                    }
                  `}
                      >
                        {value.desc}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-foreground mb-5">
              Visionary Leadership
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-4/5 mb-5 overflow-hidden rounded-xl bg-secondary">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-sans font-extrabold text-xl text-foreground">
                  {member.name}
                </h4>
                <p className="text-primary font-extrabold uppercase tracking-widest text-[10px] mt-0.5">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-28 bg-foreground text-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                Global Reach
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                Impact Without <br /> Borders
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="p-7 border-l-2 border-primary bg-background/5"
                  >
                    <div className="font-sans font-extrabold text-4xl mb-1.5">
                      {s.value}
                    </div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                  alt="Global operations"
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
              Ready to engineer your comfort?
            </h3>
            <p className="text-primary-foreground/70 text-sm">
              Talk to our team about your next project.
            </p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            Get a Quote <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </main>
  );
}
