"use client";

import { serviceItems, shopItems } from "@/data/navData";
import {
  Mail,
  Phone,
  Search,
  ShoppingCart,
  Snowflake,
  User,
} from "lucide-react";
import Link from "next/link";
import { DesktopDropdown } from "./Dropdowns";

export default function DesktopNav() {
  return (
    <div className="wrapper">
      <div className="flex h-16 items-center justify-between md:h-18">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
              <Snowflake size={16} className="text-white" />
            </div>

            <span className="text-xl font-black text-text">
              Cold<span className="text-primary">Flyer</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <DesktopDropdown label="Shop" to="/shop" items={shopItems} />
            <DesktopDropdown
              label="Services"
              to="/services"
              items={serviceItems}
            />

            {[
              ["Reviews", "/reviews"],
              ["Support", "/support"],
            ].map(([label, to]) => (
              <Link
                key={to}
                href={to}
                className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="hidden lg:flex items-center overflow-hidden rounded-md bg-surface-low">
            <input
              className="w-52 bg-transparent px-3 py-2 text-sm outline-none"
              placeholder="Search..."
            />
            <button className="bg-primary px-3 py-2 text-white">
              <Search size={14} />
            </button>
          </div>

          {/* CONTACT */}
          <div className="hidden xl:flex flex-col border-l border-surface-high pl-3">
            <a className="text-xs text-text" href="tel:+8801994902040">
              <Phone size={11} className="inline text-primary" /> +880
              1994-902040
            </a>
            <a
              className="text-xs text-text-muted"
              href="mailto:info@coldflyer.com"
            >
              <Mail size={11} className="inline text-primary" />{" "}
              info@coldflyer.com
            </a>
          </div>

          {/* ICONS */}
          <ShoppingCart className="text-text" />
          <User className="text-text" />
        </div>
      </div>
    </div>
  );
}
