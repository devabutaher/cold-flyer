"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, Building, Clock, GraduationCap, Mail, MapPin, Phone, Users, Video } from "lucide-react";
import { getData } from "@/data";
import { useLocale } from "next-intl";

const process = [
  { step: "01", title: "Apply Online", desc: "Submit your resume and application through our careers portal." },
  { step: "02", title: "Initial Review", desc: "Our recruiting team reviews applications within 48 hours." },
  { step: "03", title: "Interviews", desc: "Video call interviews with hiring manager and team." },
  { step: "04", title: "Offer", desc: "Received offer within 1 week of final interview." },
];

export default function CareersPage() {
  const locale = useLocale();
  const benefits = getData("benefits", locale);
  const departments = getData("departments", locale);
  const culture = getData("culture", locale);
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop"
          alt="Team collaboration"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/60 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">Join Our Team</Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-background leading-[0.9] tracking-tighter mb-8">
              Build the <br />
              <span className="text-primary">Future</span> of Comfort
            </h1>
            <p className="text-lg text-muted/60 max-w-xl font-medium leading-relaxed">
              Join a global team of innovators shaping sustainable climate solutions for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-20 bg-primary rounded-full" />
                <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                  Why Cold Flyer?
                </h2>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">
                We&#8217;re more than an HVAC company&#8212;we&#8217;re a movement toward sustainable living. Our team
                combines passion with purpose to solve the world&#8217;s most pressing climate challenges.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {culture.map((item) => (
                  <div key={item.label} className="p-6 bg-card rounded-xl">
                    <div className="font-sans font-extrabold text-3xl text-primary mb-1">{item.value}</div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
                <div className="relative overflow-hidden rounded-2xl aspect-video shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                    alt="Team meeting"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-28 bg-secondary/40">
        <div className="container">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">
                What We Offer
              </span>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Benefits & Perks
              </h2>
            </div>

            <p className="max-w-md font-medium text-muted-foreground">
              We invest in our people because they&#8217;re our greatest asset. Enjoy comprehensive benefits designed
              for your wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className={`
                    group rounded-xl bg-card p-10 transition-all duration-500
                    ${benefit.highlight ? "hover:bg-primary border border-primary/20" : "hover:shadow-lg"}
                  `}
                >
                  <Icon
                    size={44}
                    className={`
                      mb-7 transition-colors
                      ${benefit.highlight ? "text-primary group-hover:text-primary-foreground" : "text-primary"}
                    `}
                  />

                  <h3
                    className={`
                      mb-3 font-sans text-xl font-extrabold transition-colors
                      ${benefit.highlight ? "text-foreground group-hover:text-primary-foreground" : "text-foreground"}
                    `}
                  >
                    {benefit.title}
                  </h3>

                  <p
                    className={`
                      text-sm leading-relaxed transition-colors
                      ${benefit.highlight ? "text-muted-foreground group-hover:text-primary-foreground/80" : "text-muted-foreground"}
                    `}
                  >
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-28 bg-inverted text-inverted-foreground">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-inverted-foreground mb-5">
              Open Positions
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
          </div>

          <div className="space-y-12">
            {departments.map((dept) => (
              <div key={dept.name} className="bg-background/5 rounded-2xl overflow-hidden">
                <div className="p-8 border-b border-border/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Briefcase size={24} className="text-primary" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl">{dept.name}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{dept.positions.length} open positions</span>
                </div>

                <div className="divide-y divide-border/30">
                  {dept.positions.map((position, index) => (
                    <div
                      key={index}
                      className="p-6 flex items-center justify-between hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-lg mb-1">{position.title}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                How It Works
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                Application Process
              </h2>

              <div className="space-y-6">
                {process.map((p) => (
                  <div key={p.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-sans font-extrabold text-sm text-primary">{p.step}</span>
                    </div>
                    <div>
                      <h4 className="font-sans font-extrabold text-lg mb-1">{p.title}</h4>
                      <p className="text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
                  alt="Job application"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Don&#8217;t see the right role?
            </h3>
            <p className="text-primary-foreground/70 text-sm">Submit your resume for future opportunities.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button variant="secondary" size="lg" className="gap-2">
              <Mail size={16} /> careers@coldflyer.com
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <Video size={16} /> Schedule Chat
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
