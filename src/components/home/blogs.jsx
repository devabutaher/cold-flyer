"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { blogs } from "@/data/blogs-data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { animations, staggerItem } from "@/lib/animation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function BlogCard({ blog, index }) {
  return (
    <motion.article
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      whileHover={{ y: -4, boxShadow: "0 12px 32px -4px oklch(0 0 0 / 0.12)" }}
      className="bg-background rounded-xl overflow-hidden group shadow-sm transition-all duration-300 border border-transparent hover:border-border"
    >
      <div className="h-44 overflow-hidden relative group-hover:opacity-90 transition-opacity">
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
            Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blogs() {
  return (
    <AnimatedSection className="py-16 bg-card" id="blogs">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Learn & Discover</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Climate <span className="text-primary">Insights.</span>
            </h2>
          </div>
          <Link
            href={"/about"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            View All <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={animations.stagger.fast}
          initial="hidden"
          whileInView="visible"
          viewport={animations.inView.once}
        >
          {blogs.map((blog, i) => (
            <BlogCard key={blog.title} blog={blog} index={i} />
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
