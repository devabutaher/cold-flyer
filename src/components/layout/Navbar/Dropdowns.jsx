"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function DesktopDropdown({ label, to, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1">
        {label}

        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute top-full left-0 mt-2 w-52 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 origin-top",
          open
            ? "opacity-100 visible scale-y-100"
            : "opacity-0 invisible scale-y-95",
        )}
      >
        {items.map((item) => (
          <Link
            key={item}
            href={item}
            className="block px-4 py-3 hover:bg-gray-100"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileDropdown({
  label,
  to,
  items,
  openDropdown,
  setOpenDropdown,
}) {
  const location = usePathname();

  const isOpen = openDropdown === label;

  // const isActive = location.pathname.startsWith(to);
  const isActive = true;

  return (
    <div>
      <button
        onClick={() => setOpenDropdown(isOpen ? null : label)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-md",
          isActive ? "bg-primary/10 text-primary" : "",
        )}
      >
        {label}

        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden ml-4 border-l">
          {items.map((item) => (
            <Link key={item} href={item} className="block px-4 py-2">
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
