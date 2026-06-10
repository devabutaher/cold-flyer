import { AnimatedDiv } from "@/components/ui/animated-div";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RichText from "@/components/ui/rich-text";
import { ArrowRight, Leaf, Quote, Thermometer, Users, Zap } from "lucide-react";
import { getLocale } from "next-intl/server";
import { getPageContent } from "@/lib/content";
import Image from "next/image";

export const metadata = { title: "About Us" };

const ICONS = { Thermometer, Leaf, Users, Zap };

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

function ValueCard({ value, index }) {
  const Icon = ICONS[value.icon];
  const isPrimaryHover = value.hover === "bg-primary";
  const isForegroundHover = value.hover === "bg-foreground";

  return (
    <AnimatedDiv
      className={`group rounded-xl bg-card p-10 transition-all duration-500 ${value.wide ? "md:col-span-2" : ""} ${
        isPrimaryHover ? "hover:bg-primary" : isForegroundHover ? "hover:bg-foreground" : "hover:shadow-lg"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      {value.img ? (
        <div className="flex flex-col items-center gap-10 md:flex-row">
          <div className="flex-1">
            <Icon size={44} className="mb-7 text-primary" />
            <h3 className="mb-3 font-sans text-2xl font-extrabold text-foreground">{value.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
          </div>
          <div className="h-44 w-full shrink-0 overflow-hidden rounded-lg transition-all duration-700 group-hover:grayscale-0 md:w-56 grayscale relative">
            <Image
              src={value.img}
              alt={value.title}
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <>
          <Icon
            size={44}
            className={`mb-7 transition-colors ${
              isPrimaryHover
                ? "text-primary group-hover:text-primary-foreground"
                : isForegroundHover
                  ? "text-primary group-hover:text-primary"
                  : "text-primary"
            }`}
          />
          <h3
            className={`mb-3 font-sans text-2xl font-extrabold transition-colors ${
              isPrimaryHover
                ? "text-foreground group-hover:text-primary-foreground"
                : isForegroundHover
                  ? "text-foreground group-hover:text-inverted-foreground"
                  : "text-foreground"
            }`}
          >
            {value.title}
          </h3>
          <p
            className={`text-sm leading-relaxed transition-colors ${
              isPrimaryHover
                ? "text-muted-foreground group-hover:text-primary-foreground/80"
                : isForegroundHover
                  ? "text-muted-foreground group-hover:text-inverted-foreground/70"
                  : "text-muted-foreground"
            }`}
          >
            {value.desc}
          </p>
        </>
      )}
    </AnimatedDiv>
  );
}

function CEOSection({ content }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <AnimatedDiv
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-60" />
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">
          <div className="aspect-[4/5]">
            <Image
              src="/images/ceo.jpeg"
              alt={content.ceoName}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        </div>
      </AnimatedDiv>
      <AnimatedDiv
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Quote size={32} className="text-primary/30" />
        <div>
          <h3 className="font-sans font-extrabold text-3xl text-foreground">{content.ceoName}</h3>
          <p className="text-primary font-extrabold uppercase tracking-widest text-xs mt-1">{content.ceoRole}</p>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">{content.ceoDesc1}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{content.ceoDesc2}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{content.ceoDesc3}</p>
      </AnimatedDiv>
    </div>
  );
}

function StatItem({ stat, index }) {
  return (
    <AnimatedDiv
      className="p-7 border-l-2 border-primary bg-background/5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="font-sans font-extrabold text-4xl mb-1.5">{stat.value}</div>
      <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
    </AnimatedDiv>
  );
}

export default async function AboutPage() {
  const locale = await getLocale();
  const content = getPageContent("about", locale);
  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&q=80"
          alt="HVAC facility"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <AnimatedDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                {content.heroBadge}
              </Badge>
            </AnimatedDiv>
            <AnimatedDiv
              as="h1"
              className="font-sans font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RichText html={content.heroTitle} />
            </AnimatedDiv>
            <AnimatedDiv
              as="p"
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {content.heroSub}
            </AnimatedDiv>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-20 bg-primary rounded-full" />
                <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                  {content.storyTitle}
                </h2>
              </div>
              <AnimatedDiv
                className="flex items-center gap-6 p-8 bg-card rounded-xl shadow-md"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="font-sans font-extrabold text-6xl text-primary leading-none">2</div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground leading-tight">
                  {content.storyYears}
                </div>
              </AnimatedDiv>
              <Button size="lg" className="gap-2">
                {content.storyButton} <ArrowRight size={16} />
              </Button>
            </div>
            <div className="md:col-span-7 space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">{content.storyPara1}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{content.storyPara2}</p>
              <div className="space-y-4 pt-8 border-t border-border/30">
                <h3 className="font-sans font-extrabold text-2xl text-foreground">{content.missionTitle}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">{content.missionDesc}</p>
                <div className="space-y-2">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    <span className="font-extrabold text-foreground">{content.visionLabel}</span> {content.visionText}
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    <span className="font-extrabold text-foreground">{content.missionLabel}</span> {content.missionText}
                  </p>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground font-medium">{content.closingText}</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/30">
                <div>
                  <div className="font-sans font-extrabold text-3xl text-primary mb-1 relative inline-block">
                    800+
                    <KineticPulse />
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-1">
                    {content.storyEngineers}
                  </div>
                </div>
                <div>
                  <div className="font-sans font-extrabold text-3xl text-primary mb-1 relative inline-block">
                    100%
                    <KineticPulse />
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-1">
                    {content.storyCarbonGoal}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-secondary/40 py-28">
        <div className="container">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-3 block text-xxs font-extrabold uppercase tracking-[0.3em] text-primary">
                {content.valuesLabel}
              </span>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {content.valuesTitle}
              </h2>
            </div>
            <p className="max-w-md font-medium text-muted-foreground">{content.valuesDesc}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {content.values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-foreground mb-5">
              {content.teamTitle}
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
          </div>
          <CEOSection content={content} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-inverted text-inverted-foreground">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-xxs font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
                {content.statsLabel}
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl leading-tight mb-12 tracking-tighter">
                <RichText html={content.statsTitle} />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {content.stats.map((stat, index) => (
                  <StatItem key={stat.label} stat={stat} index={index} />
                ))}
              </div>
            </div>
            <AnimatedDiv
              className="relative group"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                  alt="Global operations"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
              </div>
            </AnimatedDiv>
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
            {content.ctaButton} <ArrowRight size={16} />
          </Button>
        </div>
      </AnimatedSection>
    </main>
  );
}
