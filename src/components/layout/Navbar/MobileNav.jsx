"use client";

import { serviceItems, shopItems } from "@/data/navData";
import { cn } from "@/lib/utils";
import { Mail, Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { MobileDropdown } from "./Dropdowns";

export default function MobileNav({
  menuOpen,
  setMenuOpen,
  openDropdown,
  setOpenDropdown,
}) {
  return (
    <div className="md:hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-text">ColdFlyer</span>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MENU */}
      <div
        className={cn(
          "overflow-hidden border-t border-surface-low bg-surface transition-all",
          menuOpen ? "max-h-screen" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-2 p-4">
          {/* SEARCH */}
          <div className="flex bg-surface-low">
            <input className="flex-1 px-3 py-2 text-sm" />
            <button className="bg-primary px-3 text-white">
              <Search size={14} />
            </button>
          </div>

          {/* DROPDOWNS */}
          <MobileDropdown
            label="Shop"
            items={shopItems}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

          <MobileDropdown
            label="Services"
            items={serviceItems}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

          {/* LINKS */}
          <Link className="p-3 text-sm" href="/reviews">
            Reviews
          </Link>

          <Link className="p-3 text-sm" href="/support">
            Support
          </Link>

          {/* CONTACT */}
          <div className="bg-surface-low p-3 text-sm">
            <p>
              <Phone size={14} /> +880 1994-902040
            </p>
            <p>
              <Mail size={14} /> info@coldflyer.com
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <Link className="flex-1 border p-2 text-center" href="/login">
              Login
            </Link>

            <button className="flex-1 bg-primary text-white">Service</button>
          </div>
        </div>
      </div>
    </div>
  );
}
