"use client";

import { useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-low bg-surface/90 backdrop-blur-xl">
      <DesktopNav />

      <MobileNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
    </header>
  );
}
