"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentWorkSearch } from "@/hooks/queries/recentWorks";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function WorkCard({ work, isLarge = false }) {
  const imageUrl = work.image?.url;
  const category = work.category;

  return (
    <div className={`relative rounded-xl overflow-hidden group ${isLarge ? "h-64 sm:row-span-2 sm:h-auto" : "h-52"}`}>
      <Link href={`/recent-works/${work.slug}`} className="block h-full w-full">
        <div className="relative h-full w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={work.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted" />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        <div className={`absolute ${isLarge ? "bottom-5 left-5" : "bottom-4 left-4"}`}>
          <span className="text-primary text-xxs font-bold uppercase tracking-widest">{category}</span>
          <h3 className="text-white font-sans font-bold text-lg">{work.title}</h3>
        </div>
      </Link>
    </div>
  );
}

function WorkCardSkeleton({ isLarge = false }) {
  return (
    <div className={`relative rounded-xl overflow-hidden ${isLarge ? "h-64 sm:row-span-2 sm:h-auto" : "h-52"}`}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function RecentWorks() {
  const { recentWorks, loading } = useRecentWorkSearch({ featured: true, limit: 3 });

  if (!loading && recentWorks.length === 0) return null;

  return (
    <AnimatedSection className="py-10 sm:py-14 md:py-16 bg-card" id="recent-works">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-xxs font-bold uppercase tracking-widest text-primary">Our Portfolio</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Recent <span className="text-primary">Works</span>
            </h2>
          </div>
          <Link
            href={"/recent-works"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            View All <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WorkCardSkeleton isLarge={true} />
            <WorkCardSkeleton />
            <WorkCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentWorks[0] && <WorkCard work={recentWorks[0]} isLarge={true} />}
            {recentWorks.slice(1).map((work) => (
              <WorkCard key={work._id || work.slug} work={work} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
