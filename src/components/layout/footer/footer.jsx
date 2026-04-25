import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const cols = [
  {
    title: "Services",
    links: [
      "Residential Cooling",
      "Commercial HVAC",
      "Duct Cleaning",
      "Smart Thermostats",
    ],
  },
  { title: "Company", links: ["About Us", "Contact", "Careers", "FAQ"] },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={"/"} className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-md">
                <Image
                  src="/vercel.svg"
                  width={200}
                  height={200}
                  alt="logo"
                  className="w-4 h-4"
                />
              </div>

              <h1 className="font-bold text-xl font-sans">
                Cold<span className="text-primary">Flyer</span>
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Leading the industry in precision climate engineering and
              sustainable HVAC solutions since 1998.
            </p>
            <div className="flex gap-3">
              {[FaXTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-md bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-background transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">
              Newsletter
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Stay cool with our latest efficiency tips and product releases.
            </p>
            <div className="flex rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-background/10 border-none outline-none text-sm text-background placeholder:text-muted-foreground px-3 py-2.5"
              />
              <button className="bg-primary hover:bg-primary/90 px-4 py-2.5 text-primary-foreground transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-muted-foreground text-xs">
          <span>© 2025 ColdFlyer Precision Climate. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-background transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Shipping & Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
