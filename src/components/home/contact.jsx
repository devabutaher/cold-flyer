import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

const contactInfo = [
  {
    title: "Email",
    icon: Mail,
    description: "We respond within 24 hours.\nsupport@climatepro.com",
  },
  {
    title: "Office",
    icon: MapPin,
    description: "Drop by for a consultation.\n1 Eagle St, Brisbane, QLD 4000",
  },
  {
    title: "Phone",
    icon: Phone,
    description: "Mon-Fri, 9am-5pm AEST.\n(07) 1234 5678",
  },
  {
    title: "Live Chat",
    icon: MessageCircle,
    description: "Get instant support online.\nStart Chat",
  },
];

export default function Contact() {
  return (
    <section className="bg-muted py-10 sm:py-16" id="contact">
      <div className="container">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Get In Touch
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
            Contact <span className="text-primary">Our Team.</span>
          </h2>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch">
          {/* Left Column – Image */}
          <div className="flex flex-col h-full">
            <div className="relative flex-1 min-h-62.5 lg:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80"
                alt="Contact our team"
                className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Column – Content */}
          <div className="flex flex-col justify-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info, index) => (
                <Card
                  className="border-none shadow-none bg-transparent"
                  key={index}
                >
                  <CardContent className="flex flex-col items-center gap-3 text-center p-4">
                    <Avatar className="size-10 border bg-accent">
                      <AvatarFallback className="bg-transparent [&>svg]:size-5 text-accent-foreground">
                        <info.icon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold">{info.title}</h4>
                      <div className="text-muted-foreground text-sm font-medium">
                        {info.description.split("\n").map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left">
              <Link href="/contact">
                <Button size="lg">Send Us a Message</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
