"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getData } from "@/data";
import { getClient } from "@/lib/http-client";
import { Clock, Loader2, Mail, MapPin, Video, Wrench } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/validations";

export default function CareersPage() {
  const locale = useLocale();
  const t = useTranslations("careers");
  const benefits = getData("benefits", locale);
  const culture = getData("culture", locale);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", phone: "", experience: "", skills: "", coverLetter: "" },
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
  });

  const process = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  const handleApply = () => {
    setShowApplyForm(true);
    reset({ name: "", email: "", phone: "", experience: "", skills: "", coverLetter: "" });
  };

  const onApply = async (data) => {
    setSubmitting(true);
    try {
      const client = getClient();
      const skills = data.skills
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: "HVAC Technician",
        experience: data.experience,
        skills,
        coverLetter: data.coverLetter,
      };

      await client.post("/job-applications", payload);
      toast.success(t("applySuccess"));
      setShowApplyForm(false);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("already have")) {
        toast.error(t("applyAlreadyExists"));
      } else {
        toast.error(t("applyError"));
      }
    } finally {
      setSubmitting(false);
    }
  };

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
          quality={75}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-6 uppercase tracking-[0.2em] text-xs">{t("heroBadge")}</Badge>
            <h1 className="font-sans font-extrabold text-6xl text-white md:text-8xl leading-[0.9] tracking-tighter mb-8">
              {t.rich("heroTitle", { br: () => <br /> })}
            </h1>
            <p className="text-lg text-white/70 max-w-xl font-medium leading-relaxed">{t("heroDesc")}</p>
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

              <p className="text-lg leading-relaxed text-muted-foreground">{t("whyDesc")}</p>

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
              <span className="mb-3 block text-xxs font-extrabold uppercase tracking-[0.3em] text-primary">
                What We Offer
              </span>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Benefits & Perks
              </h2>
            </div>

            <p className="max-w-md font-medium text-muted-foreground">{t("benefitsDesc")}</p>
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

          <div className="max-w-2xl mx-auto">
            <div className="bg-background/5 rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-border/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wrench size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-2xl">Service Team</h3>
                  <p className="text-sm text-muted-foreground mt-1">Technical Operations</p>
                </div>
              </div>

              <div className="divide-y divide-border/30">
                <div className="p-6 flex items-center justify-between hover:bg-primary/10 transition-colors">
                  <div>
                    <div className="font-medium text-lg mb-1">HVAC Technician</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        Dhaka, Bangladesh
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Full-time
                      </span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleApply}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-xxs font-extrabold uppercase tracking-[0.4em] text-primary mb-5 block">
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
              {"Don't see the right role?"}
            </h3>
            <p className="text-primary-foreground/70 text-sm">{t("ctaDesc")}</p>
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

      {/* Apply Form Sheet */}
      <Sheet open={showApplyForm} onOpenChange={(open) => !open && setShowApplyForm(false)}>
        <SheetContent open={showApplyForm} className="sm:max-w-125 px-4 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Apply for HVAC Technician</SheetTitle>
            <SheetDescription>Dhaka, Bangladesh &middot; Full-time</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onApply)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="apply-name">
                {t("applyName")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="apply-name" placeholder={t("applyNamePlaceholder")} {...field} />}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-email">
                {t("applyEmail")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input id="apply-email" type="email" placeholder={t("applyEmailPlaceholder")} {...field} />
                )}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-phone">
                {t("applyPhone")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input id="apply-phone" type="tel" placeholder={t("applyPhonePlaceholder")} {...field} />
                )}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-experience">{t("applyExperience")}</Label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Input id="apply-experience" placeholder={t("applyExperiencePlaceholder")} {...field} />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-skills">{t("applySkills")}</Label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => <Input id="apply-skills" placeholder={t("applySkillsPlaceholder")} {...field} />}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-cover-letter">{t("applyCoverLetter")}</Label>
              <Controller
                name="coverLetter"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="apply-cover-letter"
                    placeholder={t("applyCoverLetterPlaceholder")}
                    {...field}
                    rows={4}
                  />
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("applySubmitting")}
                </>
              ) : (
                t("applySubmit")
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </main>
  );
}
