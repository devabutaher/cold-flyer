import { projects } from "@/data/projects-data";
import { ArrowRight } from "lucide-react";

export default function Portfolio() {
  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Precision Portfolio
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Recent <span className="text-primary">Works.</span>
            </h2>
          </div>
          <button className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">
            Learn More <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative rounded-xl overflow-hidden h-64 sm:row-span-2 sm:h-auto group">
            <img
              src={projects[0].img}
              alt={projects[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                {projects[0].cat}
              </span>
              <h3 className="text-white font-sans font-bold text-lg">
                {projects[0].title}
              </h3>
            </div>
          </div>
          {projects.slice(1).map((p) => (
            <div
              key={p.title}
              className="relative rounded-xl overflow-hidden h-52 group"
            >
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                  {p.cat}
                </span>
                <h3 className="text-white font-sans font-bold text-base">
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
