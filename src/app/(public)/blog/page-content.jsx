"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogSearch } from "@/hooks/queries/blogs";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Newspaper, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

function BlogCard({ post, index }) {
  const imageUrl = post.image?.url || post.img;
  const category = post.category || post.cat;
  const date = post.publishedAt || post.createdAt || post.date;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const blogSlug = post.slug || "#";

  return (
    <motion.article
      className="group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <Link href={`/blog/${blogSlug}`}>
        <div className="relative aspect-16/10 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Newspaper className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="border-0 bg-primary/90 text-primary-foreground text-xs font-extrabold uppercase tracking-wider">
              <Tag size={12} className="mr-1" />
              {category}
            </Badge>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
        <Link href={`/blog/${blogSlug}`}>
          <h3 className="font-sans font-extrabold text-lg text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <Link
          href={`/blog/${blogSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden">
      <Skeleton className="aspect-16/10 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const { blogs, loading } = useBlogSearch({ limit: 50 });

  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-950">
        <Image
          src="https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Blog"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950/70 via-neutral-950/30 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                {t("heroBadge")}
              </Badge>
            </motion.div>
            <motion.h1
              className="font-sans font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-snug tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t.rich("heroTitle", { br: () => <br /> })}
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("heroDesc")}
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <BlogCard key={post._id || post.slug || index} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              {t("subscribeTitle")}
            </h3>
            <p className="text-primary-foreground/70 text-sm">{t("subscribeDesc")}</p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            {t("subscribeButton")} <ArrowRight size={16} />
          </Button>
        </div>
      </AnimatedSection>
    </main>
  );
}
