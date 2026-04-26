import { servicesData } from "@/data/services-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Services() {
  return (
    <section className="py-16 bg-background" id="services">
      <div className="container">
        <div className="mb-9">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Our Expertise
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
            World-Class <span className="text-primary">Climate Services.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {servicesData.map((s) => (
            <div
              key={s.title}
              className="bg-muted rounded-xl p-6 sm:p-7 group hover:bg-secondary hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <s.icon
                size={72}
                className="absolute right-4 bottom-3 text-primary opacity-[0.05] group-hover:opacity-[0.08] transition-opacity"
              />
              <div className="w-11 h-11 rounded-md bg-accent flex items-center justify-center mb-4">
                <s.icon size={22} className="text-accent-foreground" />
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {s.sub}
              </p>
              <Link
                href={"/services"}
                className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all"
              >
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
