"use client";

import { getData } from "@/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function SocialLink({ href, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, backgroundColor: "var(--color-primary)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Link
        href={href}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-inverted-foreground/10 hover:bg-primary transition-colors"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function FooterLink({ href, children }) {
  return (
    <motion.li initial="rest" whileHover="hover" className="relative w-fit">
      <Link
        href={href}
        className="text-muted-foreground text-sm hover:text-inverted-foreground transition-colors inline-block"
      >
        {children}
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-inverted-foreground"
          variants={{
            rest: { scaleX: 0, originX: 0 },
            hover: { scaleX: 1, originX: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </Link>
    </motion.li>
  );
}

function NewsletterForm() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex rounded-md overflow-hidden w-full">
      <motion.div className="flex w-full" whileFocusWithin={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("subscribePlaceholder")}
          required
          className="flex-1 min-w-0 bg-white/10 border-none outline-none text-sm text-white placeholder:text-neutral-500 px-3 py-2.5 transition-all duration-200 focus:bg-white/15"
        />
        <motion.button
          type="submit"
          className="bg-primary hover:bg-primary/90 px-3 py-2.5 text-primary-foreground transition-colors shrink-0 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          {subscribed ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check size={16} />
            </motion.span>
          ) : (
            <ArrowRight size={16} />
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const footerColumns = getData("footerColumns", locale);
  const footerLinks = getData("footerLinks", locale);

  return (
    <footer className="bg-inverted text-inverted-foreground">
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <Link href={"/"} className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" width={32} height={32} alt="logo" className="w-10 h-10" />

              <h1 className="font-bold text-xl font-heading">{t("common.siteName")}</h1>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t("home.brandTagline")}</p>
            <div className="flex gap-3">
              {[
                {
                  href: "https://x.com",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 30 30"
                      fill="currentColor"
                    >
                      <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
                    </svg>
                  ),
                },
                {
                  href: "https://instagram.com",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  href: "https://linkedin.com",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <SocialLink key={i} href={item.href}>
                  {item.svg}
                </SocialLink>
              ))}
            </div>
          </motion.div>

          {/* Nav cols */}
          {footerColumns.map((col, colIdx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.1 + colIdx * 0.05 }}
            >
              <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">{t("footer.newsletter")}</h4>
            <p className="text-muted-foreground text-sm mb-4">{t("home.newsletterDescription")}</p>
            <NewsletterForm />
          </motion.div>
        </div>

        <motion.div
          className="border-t border-inverted-foreground/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-muted-foreground text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span>{t("common.copyright")}</span>
          <div className="flex gap-4">
            {footerLinks.quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-inverted-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-px bg-inverted-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
