import { footerColumns, footerLinks } from "@/data/footer-links";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground/95 text-background">
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={"/"} className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-md">
                <Image src="/logo.png" width={200} height={200} alt="logo" className="w-4 h-4" />
              </div>

              <h1 className="font-bold text-xl font-sans">
                Cold<span className="text-primary">Flyer</span>
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Leading the industry in precision climate engineering and sustainable HVAC solutions since 1998.
            </p>
            <div className="flex gap-3">
              {[
                {
                  href: "https://x.com",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-10.299 6.162a5.25 5.25 0 00-1.586-1.788l-6.457-6.457a5.25 5.25 0 00-6.44 6.44L18.244 2.25zm-1.133 10.5l-7.167-7.167a5.25 5.25 0 00-6.44 6.44L17.111 12.75z" />
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
                      <path d="M20 0h-7a4 4 0 00-4.44 5h-1.11V19H0v-4a2 2 0 011.8-2h7.34V4.6a5.86 5.86 0 01-2.9-1.8C12 0 14.4 0 16 0z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="w-9 h-9 rounded-md bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  {item.svg}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground text-sm hover:text-background transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Stay cool with our latest efficiency tips and product releases.
            </p>
            <div className="flex rounded-md overflow-hidden w-full">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 min-w-0 bg-background/10 border-none outline-none text-sm text-background placeholder:text-muted-foreground px-3 py-2.5"
              />
              <button className="bg-primary hover:bg-primary/90 px-3 py-2.5 text-primary-foreground transition-colors shrink-0">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-muted-foreground text-xs">
          <span>© 2025 ColdFlyer Precision Climate. All rights reserved.</span>
          <div className="flex gap-4">
            {footerLinks.quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-background transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
