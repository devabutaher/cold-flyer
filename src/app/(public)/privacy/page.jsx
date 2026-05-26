import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Globe, Mail, MessageSquare, Package, Phone, Shield, ShieldCheck, User } from "lucide-react";
import { getData } from "@/data";
import { getLocale, getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations("privacy");
  const principles = getData("principles", locale);
  const dataTypes = getData("dataTypes", locale);
  const timeline = getData("timeline", locale);
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1584433144697-205892243f4d?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Privacy concept"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
              {t("heroBadge")}
            </Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-8">
              {t.rich("heroTitle", { br: () => <br /> })}
            </h1>
            <p className="text-lg text-white/70 max-w-xl font-medium leading-relaxed">
              Your trust is our most valuable asset. We&apos;re committed to safeguarding your personal information with
              the highest standards of privacy and security.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-3 block text-xxs font-extrabold uppercase tracking-[0.3em] text-primary">
                Our Commitment
              </span>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Privacy Principles
              </h2>
            </div>

            <p className="max-w-md font-medium text-muted-foreground">{t("principlesDesc")}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {principles.map((principle, i) => {
              const Icon = principle.icon;

              return (
                <div
                  key={i}
                  className={`
                    group rounded-xl bg-card p-10 transition-all duration-500
                    ${principle.highlight ? "hover:bg-primary border border-primary/20" : "hover:shadow-lg"}
                  `}
                >
                  <Icon
                    size={44}
                    className={`
                      mb-7 transition-colors
                      ${principle.highlight ? "text-primary group-hover:text-primary-foreground" : "text-primary"}
                    `}
                  />

                  <h3
                    className={`
                      mb-3 font-sans text-2xl font-extrabold transition-colors
                      ${principle.highlight ? "text-foreground group-hover:text-primary-foreground" : "text-foreground"}
                    `}
                  >
                    {principle.title}
                  </h3>

                  <p
                    className={`
                      text-sm leading-relaxed transition-colors
                      ${
                        principle.highlight
                          ? "text-muted-foreground group-hover:text-primary-foreground/80"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {principle.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Collect */}
      <section className="py-28 bg-secondary/40">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-20 bg-primary rounded-full" />
                <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                  Understanding Your Data
                </h2>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">{t("dataDesc")}</p>

              <div className="flex items-center gap-6 p-8 bg-card rounded-xl shadow-md">
                <div className="font-sans font-extrabold text-6xl text-primary leading-none">100%</div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground leading-tight">
                  You <br />
                  Control
                </div>
              </div>

              <Button size="lg" className="gap-2">
                {t("dataButton")} <User size={16} />
              </Button>
            </div>

            <div className="md:col-span-7 space-y-8">
              {dataTypes.map((type) => (
                <div key={type.category} className="bg-card rounded-xl p-8">
                  <h3 className="font-sans font-extrabold text-xl mb-6 text-foreground">{type.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {type.items.map((item, i) => (
                      <div key={i}>
                        <div className="font-medium text-foreground mb-1">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Timeline */}
      <section className="py-28 bg-inverted text-inverted-foreground">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-inverted-foreground mb-5">
              Our Privacy Journey
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {timeline.map((item, index) => (
              <div key={index} className="relative">
                <div className="font-sans font-extrabold text-6xl text-primary/30 mb-4">{item.year}</div>
                <p className="text-lg font-medium leading-relaxed">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Privacy security"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
              </div>
            </div>

            <div>
              <span className="text-xxs font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                Your Control
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                Exercising Your Rights
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Eye size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-lg mb-1">{t("right1Title")}</h4>
                    <p className="text-muted-foreground">{t("right1Desc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-lg mb-1">{t("right2Title")}</h4>
                    <p className="text-muted-foreground">{t("right2Desc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-lg mb-1">{t("right3Title")}</h4>
                    <p className="text-muted-foreground">{t("right3Desc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-lg mb-1">{t("right4Title")}</h4>
                    <p className="text-muted-foreground">{t("right4Desc")}</p>
                  </div>
                </div>
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
              Questions about privacy?
            </h3>
            <p className="text-primary-foreground/70 text-sm">{t("ctaDesc")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button variant="secondary" size="lg" className="gap-2">
              <Mail size={16} /> privacy@coldflyer.com
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <Phone size={16} /> Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
