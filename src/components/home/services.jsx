import { servicesData } from "@/data/services-data";
import { ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <section className="py-16 bg-surface" id="services">
      <div className="container">
        <div className="mb-9">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Our Expertise
          </span>
          <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-text-text mt-1">
            World-Class <span className="text-primary">Climate Services.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {servicesData.map((s) => (
            <div
              key={s.title}
              className="bg-bg rounded-xl p-6 sm:p-7 group hover:bg-surface hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <s.icon
                size={72}
                className="absolute right-4 bottom-3 text-primary opacity-[0.05] group-hover:opacity-[0.08] transition-opacity"
              />
              <div className="w-11 h-11 rounded-md bg-primary-light flex items-center justify-center mb-4">
                <s.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-headline font-bold text-lg text-text-text mb-2">
                {s.title}
              </h3>
              <p className="text-text-text-muted text-sm leading-relaxed mb-5">
                {s.sub}
              </p>
              <button className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                Learn More <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
