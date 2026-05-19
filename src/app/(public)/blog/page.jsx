"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getData } from "@/data";
import { useLocale } from "next-intl";

function BlogCard({ post, index }) {
  return (
    <motion.article
      className="group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.img}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge className="border-0 bg-primary/90 text-primary-foreground text-xs font-extrabold uppercase tracking-wider">
            <Tag size={12} className="mr-1" />
            {post.cat}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar size={13} />
          <span>{post.date}</span>
        </div>
        <h3 className="font-sans font-extrabold text-lg text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  const locale = useLocale();
  const blogs = getData("blogs", locale);

  return (
    <main className="bg-background text-foreground">
      <AnimatedSection className="relative h-[80vh] flex items-center overflow-hidden bg-inverted">
        <Image
          src="https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=1400&q=80"
          alt="Blog"
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
                Insights & Updates
              </Badge>
            </motion.div>
            <motion.h1
              className="font-sans font-extrabold text-6xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our <br />
              <span className="text-primary">Blog</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tips, guides, and insights on AC maintenance, energy savings, and the latest in cooling technology.
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <BlogCard key={post.title} post={post} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-primary">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-extrabold text-3xl text-primary-foreground tracking-tight mb-1">
              Stay in the loop
            </h3>
            <p className="text-primary-foreground/70 text-sm">
              Subscribe to our newsletter for the latest tips and offers.
            </p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2 shrink-0">
            Subscribe <ArrowRight size={16} />
          </Button>
        </div>
      </AnimatedSection>
    </main>
  );
}
