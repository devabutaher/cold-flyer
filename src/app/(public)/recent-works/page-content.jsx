"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentWorkSearch } from "@/hooks/queries/recentWorks";

function WorkCard({ work, index }) {
  const imageUrl = work.image?.url;
  const category = work.category;
  const date = work.completionDate || work.createdAt;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <motion.article
      className="group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <Link href={`/recent-works/${work.slug}`}>
        <div className="relative aspect-16/10 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={work.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Briefcase className="h-12 w-12 text-muted-foreground/30" />
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
        {(formattedDate || work.clientName) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            {formattedDate && (
              <>
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </>
            )}
            {work.clientName && <span className="text-muted-foreground/50">| {work.clientName}</span>}
          </div>
        )}
        <Link href={`/recent-works/${work.slug}`}>
          <h3 className="font-sans font-extrabold text-lg text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
            {work.title}
          </h3>
        </Link>
        {work.excerpt && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{work.excerpt}</p>}
        <Link
          href={`/recent-works/${work.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View Project <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}

function WorkCardSkeleton() {
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

export default function RecentWorksPage() {
  const { recentWorks, loading } = useRecentWorkSearch({ limit: 50 });

  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1581092795604-19e71fdab1d4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Recent Works"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                Our Portfolio
              </Badge>
            </motion.div>
            <motion.h1
              className="font-sans font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Recent <br />
              Works
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore our portfolio of completed AC installation, maintenance, and repair projects.
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <WorkCardSkeleton key={i} />
              ))}
            </div>
          ) : recentWorks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No completed projects yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentWorks.map((work, index) => (
                <WorkCard key={work._id || work.slug || index} work={work} index={index} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Have a Project in Mind?
            </h3>
            <p className="text-primary-foreground/70 text-sm">
              Let us help you with your next AC installation or maintenance project.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="gap-2 shrink-0">
              Contact Us <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </main>
  );
}
