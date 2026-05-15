"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
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

function ContactCard({ info, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="border-none shadow-none bg-transparent hover:bg-secondary/50 rounded-xl transition-colors duration-200">
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
    </motion.div>
  );
}

export default function Contact() {
  return (
    <AnimatedSection className="bg-muted py-10 sm:py-16" id="contact">
      <div className="container">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Get In Touch</span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
            Contact <span className="text-primary">Our Team.</span>
          </h2>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col h-full">
            <motion.div
              className="relative flex-1 min-h-62.5 lg:min-h-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80"
                alt="Contact our team"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info, index) => (
                <ContactCard key={info.title} info={info} index={index} />
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left">
              <Link href="/">
                <Button size="lg">Send Us a Message</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
