import { AnimatedDiv } from "@/components/ui/animated-div";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichText from "@/components/ui/rich-text";
import { Textarea } from "@/components/ui/textarea";
import { getPageContent } from "@/lib/content";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { getLocale } from "next-intl/server";
import Image from "next/image";

export const metadata = { title: "Contact Us" };

const ICONS = { Phone, Mail, MapPin, Clock };

export default async function ContactPage() {
  const locale = await getLocale();
  const content = getPageContent("contact", locale);
  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-950">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&q=80"
          alt="Contact us"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950/70 via-neutral-950/30 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <AnimatedDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                {content.heroBadge}
              </Badge>
            </AnimatedDiv>
            <AnimatedDiv
              as="h1"
              className="font-sans font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-snug tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RichText html={content.heroHeading} />
            </AnimatedDiv>
            <AnimatedDiv
              as="p"
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {content.heroDesc}
            </AnimatedDiv>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="mb-3 block text-xxs font-extrabold uppercase tracking-[0.3em] text-primary">
                {content.contactMethodsTitle}
              </span>
              <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight mb-6">{content.formTitle}</h2>
              <p className="text-muted-foreground mb-10 max-w-md">{content.formDesc}</p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{content.name}</label>
                    <Input placeholder={content.namePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{content.email}</label>
                    <Input type="email" placeholder={content.emailPlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{content.subject}</label>
                  <Input placeholder={content.subjectPlaceholder} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{content.message}</label>
                  <Textarea placeholder={content.messagePlaceholder} rows={5} />
                </div>
                <Button size="lg" className="gap-2">
                  <Send size={16} /> {content.sendMessage}
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {content.contactMethods.map((method, i) => {
                const Icon = ICONS[method.icon];
                return (
                  <AnimatedDiv
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
                  </AnimatedDiv>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-16">
            <span className="mb-3 block text-xxs font-extrabold uppercase tracking-[0.3em] text-primary">
              {content.locationLabel}
            </span>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight">{content.locationTitle}</h2>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Map location"
              fill
              sizes="100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur-sm rounded-xl p-6 text-center">
                <MapPin size={32} className="text-primary mx-auto mb-2" />
                <p className="font-medium">{content.locationAddress}</p>
                <p className="text-sm text-muted-foreground">{content.locationSub}</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              {content.ctaTitle}
            </h3>
            <p className="text-primary-foreground/70 text-sm">{content.ctaSub}</p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            <Phone size={16} /> {content.ctaPhone}
          </Button>
        </div>
      </AnimatedSection>
    </main>
  );
}
