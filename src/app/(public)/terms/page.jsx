
import { Badge } from "@/components/ui/badge";
import { getData } from "@/data";
import { AlertTriangle, FileText, Scale, Shield } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("terms");
  const { sections, lastUpdated, version } = {
    sections: getData("sections", locale),
    lastUpdated: getData("lastUpdated", locale),
    version: getData("version", locale),
  };
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1652690527826-dcddbd1eb46e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Legal documents"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />

        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">{t("heroBadge")}</Badge>
            <h1 className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-8">
              {t.rich("heroTitle", {br: () => <br/>})}
            </h1>
            <p className="text-lg text-white/70 max-w-xl font-medium leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-secondary/40 border-b border-border/30">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={16} />
              <span>{t("lastUpdated", {date: "April 29, 2026"})}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-primary font-medium">
              <Scale size={16} />
              <span>{t("version", {ver: "2.1"})}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Table of Contents */}
            <div className="lg:col-span-4">
              <div className="sticky top-12 space-y-6 pt-4">
                <div className="p-6 bg-card rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-primary" />
                    <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider">{t("navTitle")}</h3>
                  </div>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans font-extrabold text-sm mb-1">{t("noticeTitle")}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("noticeDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="lg:col-span-8 space-y-16">
              {sections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-sans font-extrabold text-sm text-primary">{index + 1}</span>
                    </div>
                    <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight">{section.title}</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground ml-12">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
