"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentWorkSearch } from "@/hooks/queries/recentWorks";
import { ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function WorkCard({ work }) {
  const imageUrl = work.image?.url;
  const category = work.category;
  const date = work.completionDate || work.createdAt;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <article className="bg-background rounded-xl overflow-hidden group shadow-sm transition-shadow duration-300 border border-transparent hover:border-border">
      <Link href={`/recent-works/${work.slug}`}>
        <div className="h-36 sm:h-44 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={work.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Briefcase className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{category}</span>
        <Link href={`/recent-works/${work.slug}`}>
          <h3 className="font-sans font-bold text-foreground text-base mt-1 mb-3 leading-snug group-hover:text-primary transition-colors">
            {work.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{formattedDate}</span>
          <Link
            href={`/recent-works/${work.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            View Project <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function WorkCardSkeleton() {
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

export default function RecentWorks() {
  const { recentWorks, loading } = useRecentWorkSearch({ featured: true, limit: 3 });

  return (
    <AnimatedSection className="py-10 sm:py-14 md:py-16 bg-card" id="recent-works">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Our Portfolio</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">Recent Works.</h2>
          </div>
          <Link
            href={"/recent-works"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            View All <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <WorkCardSkeleton key={i} />)
          ) : recentWorks.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-3 text-center py-10">
              No completed projects yet. Check back soon!
            </p>
          ) : (
            recentWorks.map((work) => <WorkCard key={work._id || work.slug} work={work} />)
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
