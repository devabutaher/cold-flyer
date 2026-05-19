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
    <motion.li
      initial="rest"
      whileHover="hover"
      className="relative w-fit"
    >
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
      <motion.div
        className="flex w-full"
        whileFocusWithin={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
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
              <div className="bg-primary p-2 rounded-md">
                <Image src="/logo.png" width={32} height={32} alt="logo" className="w-4 h-4" />
              </div>

              <h1 className="font-bold text-xl font-heading">
                Cold<span className="text-primary">Flyer</span>
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {t("home.brandTagline")}
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://x.com", svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-10.299 6.162a5.25 5.25 0 00-1.586-1.788l-6.457-6.457a5.25 5.25 0 00-6.44 6.44L18.244 2.25zm-1.133 10.5l-7.167-7.167a5.25 5.25 0 00-6.44 6.44L17.111 12.75z" />
                  </svg>
                )},
                { href: "https://instagram.com", svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                  </svg>
                )},
                { href: "https://linkedin.com", svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 0h-7a4 4 0 00-4.44 5h-1.11V19H0v-4a2 2 0 011.8-2h7.34V4.6a5.86 5.86 0 01-2.9-1.8C12 0 14.4 0 16 0z" />
                  </svg>
                )},
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
            <p className="text-muted-foreground text-sm mb-4">
              {t("home.newsletterDescription")}
            </p>
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
              <Link key={link.label} href={link.href} className="hover:text-inverted-foreground transition-colors relative group">
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
