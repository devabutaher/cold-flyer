"use client";

import Image from "next/image";
import { getData } from "@/data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

function BlogCard({ blog, t }) {
  return (
    <article className="bg-background rounded-xl overflow-hidden group shadow-sm transition-shadow duration-300 border border-transparent hover:border-border">
      <div className="h-36 sm:h-44 overflow-hidden relative group-hover:opacity-90 transition-opacity">
        <Image
          src={blog.img}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{blog.cat}</span>
        <h3 className="font-sans font-bold text-foreground text-base mt-1 mb-3 leading-snug group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{blog.date}</span>
          <Link
            href={"/about"}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            {t("readMore")} <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Blogs() {
  const t = useTranslations("home");
  const locale = useLocale();
  const blogs = getData("blogs", locale);
  return (
    <AnimatedSection className="py-10 sm:py-14 md:py-16 bg-card" id="blogs">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("latestInsights")}</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              {t("blogTitle")}
            </h2>
          </div>
          <Link
            href={"/about"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            {t("viewAll")} <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <BlogCard key={blog.title} blog={blog} t={t} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
