"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useBlogSearch } from "@/hooks/queries/blogs";

function BlogCard({ blog, t }) {
  const imageUrl = blog.image?.url || blog.img;
  const category = blog.category || blog.cat;
  const date = blog.publishedAt || blog.createdAt || blog.date;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const blogSlug = blog.slug || "#";

  return (
    <article className="bg-background rounded-xl overflow-hidden group shadow-sm transition-shadow duration-300 border border-transparent hover:border-border">
      <Link href={`/blog/${blogSlug}`}>
        <div className="h-36 sm:h-44 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Newspaper className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <span className="text-xxs font-bold uppercase tracking-widest text-primary">{category}</span>
        <Link href={`/blog/${blogSlug}`}>
          <h3 className="font-sans font-bold text-foreground text-base mt-1 mb-3 leading-snug group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{formattedDate}</span>
          <Link
            href={`/blog/${blogSlug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            {t("readMore")} <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bg-background rounded-xl overflow-hidden border border-border">
      <Skeleton className="h-36 sm:h-44 w-full" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function Blogs() {
  const t = useTranslations("home");
  const { blogs, loading } = useBlogSearch({ featured: true, limit: 3 });

  return (
    <AnimatedSection className="py-10 sm:py-14 md:py-16 bg-card" id="blogs">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-xxs font-bold uppercase tracking-widest text-primary">{t("latestInsights")}</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">{t("blogTitle")}</h2>
          </div>
          <Link
            href={"/blog"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            {t("viewAll")} <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : blogs.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-3 text-center py-10">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            blogs.map((blog) => <BlogCard key={blog._id || blog.slug} blog={blog} t={t} />)
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
