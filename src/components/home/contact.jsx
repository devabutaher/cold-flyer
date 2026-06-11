import { AnimatedSection } from "@/components/ui/animated-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

function ContactCard({ info }) {
  return (
    <Card className="border-none shadow-none bg-transparent hover:bg-secondary/50 rounded-xl transition-colors duration-200">
      <CardContent className="flex flex-col items-center gap-3 text-center p-4">
        <div>
          <Avatar className="size-10 border bg-accent">
            <AvatarFallback className="bg-transparent [&>svg]:size-5 text-accent-foreground">
              <info.icon />
            </AvatarFallback>
          </Avatar>
        </div>
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
  );
}

export default async function Contact() {
  const t = await getTranslations("home");

  const contactInfo = [
    {
      title: t("contactEmail"),
      icon: Mail,
      description: t("contactEmailDesc"),
    },
    {
      title: t("contactOffice"),
      icon: MapPin,
      description: t("contactOfficeDesc"),
    },
    {
      title: t("contactPhone"),
      icon: Phone,
      description: t("contactPhoneDesc"),
    },
    {
      title: t("contactChat"),
      icon: MessageCircle,
      description: t("contactChatDesc"),
    },
  ];

  return (
    <AnimatedSection className="bg-muted py-10 sm:py-16" id="contact">
      <div className="container">
        <div className="mb-6">
          <span className="text-xxs font-bold uppercase tracking-widest text-primary">{t("contactSectionTitle")}</span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">{t("contactHeading")}</h2>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col h-full">
            <div className="relative flex-1 min-h-62.5 lg:min-h-0 group">
              <Image
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80"
                alt={t("contactSectionTitle")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info) => (
                <ContactCard key={info.title} info={info} />
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left">
              <Link href="/">
                <Button size="lg">{t("contactButton")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
