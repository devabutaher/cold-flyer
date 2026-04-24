import { aboutData } from "@/data/about-data";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function About() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative rounded-xl overflow-hidden h-72 md:h-105 order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80"
              alt="Technician"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-dark-bg/40 to-transparent" />
          </div>
          <div className="order-1 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Why Choose Us
            </span>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-text-text leading-tight mt-2 mb-6">
              Engineering Comfort with{" "}
              <span className="text-primary">Uncompromising Precision.</span>
            </h2>
            <div className="space-y-5 mb-8">
              {aboutData.map((p) => (
                <div key={p.label} className="flex gap-3">
                  <CheckCircle
                    size={20}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-headline font-bold text-text-text text-sm">
                      {p.label}
                    </h4>
                    <p className="text-text-text-muted text-sm mt-0.5 leading-relaxed">
                      {p.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="lg">Book a Diagnostic</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
