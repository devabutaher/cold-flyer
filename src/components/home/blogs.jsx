import { blogs } from "@/data/blogs-data";
import { ArrowRight } from "lucide-react";

export default function Blogs() {
  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Learn & Discover
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Climate <span className="text-primary">Insights.</span>
            </h2>
          </div>
          <button className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {blogs.map((p) => (
            <article
              key={p.title}
              className="bg-background rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {p.cat}
                </span>
                <h3 className="font-sans font-bold text-foreground text-base mt-1 mb-3 leading-snug">
                  {p.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    {p.date}
                  </span>
                  <button className="flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all">
                    Read <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
