import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    id: "faq-1",
    question: "How often should I service my AC unit?",
    answer:
      "We recommend servicing your AC unit at least once a year, preferably before the summer season begins. Regular maintenance helps prevent breakdowns, improves efficiency, and extends the lifespan of your unit.",
  },
  {
    id: "faq-2",
    question: "What signs indicate my AC needs repair?",
    answer:
      "Common signs include weak airflow, unusual noises, strange odors, inconsistent cooling, higher energy bills, or frequent cycling on and off. If you notice any of these issues, contact us for a professional inspection.",
  },
  {
    id: "faq-3",
    question: "Do you offer emergency AC repair services?",
    answer:
      "Yes, we provide emergency repair services for urgent AC issues. Our team is available to handle breakdowns and restore your comfort as quickly as possible.",
  },
  {
    id: "faq-4",
    question: "What brands of AC units do you service?",
    answer:
      "We service all major brands of air conditioning units including Daikin, Carrier, LG, Samsung, Mitsubishi, and more. Our technicians are trained to work with a wide range of systems.",
  },
  {
    id: "faq-5",
    question: "How long does a typical AC installation take?",
    answer:
      "A standard AC installation typically takes 4-8 hours depending on the complexity of the job, the type of unit, and any necessary modifications to your existing ductwork or electrical systems.",
  },
  {
    id: "faq-6",
    question: "Are your technicians certified and insured?",
    answer:
      "Yes, all our technicians are fully certified, licensed, and insured. They undergo regular training to stay updated with the latest industry standards and technologies.",
  },
];

export default function Faq() {
  return (
    <section className="py-16 bg-background" id="faq">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 lg:items-start">
          {/* Left Side - Title & FAQ */}
          <div className="flex flex-col justify-center">
            <div className="mb-9">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Common Questions
              </span>
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
                Frequently Asked{" "}
                <span className="text-primary">Questions.</span>
              </h2>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue={faqItems[0].id}
              className="w-full"
            >
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "border-border",
                    index !== faqItems.length - 1 && "border-b",
                  )}
                >
                  <AccordionTrigger className="font-semibold hover:no-underline text-left py-4 text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="text-muted-foreground pb-4 pt-1 leading-relaxed">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Side - Image */}
          <div className="relative rounded-xl overflow-hidden h-64 md:h-80 lg:h-125 w-full shrink-0 order-last shadow-lg">
            <img
              src="https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="AC Technician"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="bg-background/10 backdrop-blur-md border border-white/10 rounded-lg p-4 inline-block">
                <p className="text-white font-bold text-base md:text-lg">
                  Expert Support When You Need It
                </p>
                <p className="text-white/90 text-sm mt-1">
                  Our team is ready to help with all your climate control needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
