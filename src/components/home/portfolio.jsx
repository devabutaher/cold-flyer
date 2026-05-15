"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects-data";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function PortfolioItem({ project, index, isLarge = false }) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden group ${isLarge ? "h-64 sm:row-span-2 sm:h-auto" : "h-52"}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Image
        src={project.img}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className={`absolute ${isLarge ? "bottom-5 left-5" : "bottom-4 left-4"}`}>
        <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{project.cat}</span>
        <h3 className="text-white font-sans font-bold text-lg">{project.title}</h3>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <AnimatedSection className="py-16 bg-card">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Precision Portfolio</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Recent <span className="text-primary">Works.</span>
            </h2>
          </div>
          <Link
            href={"/services"}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200"
          >
            Learn More <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PortfolioItem project={projects[0]} index={0} isLarge={true} />
          {projects.slice(1).map((p, i) => (
            <PortfolioItem key={p.title} project={p} index={i + 1} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
