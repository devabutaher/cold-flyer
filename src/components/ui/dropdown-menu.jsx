"use client";

/**
 * DropdownMenu — Radix primitive + Framer Motion open/close animations.
 *
 * Replaces the Tailwind `animate-in / data-closed:animate-out` classes with
 * proper Framer Motion variants so the close animation actually plays
 * (Tailwind's exit animation relies on a Radix timing trick that can be
 * unreliable when content unmounts before the CSS transition finishes).
 *
 * Everything else — API, classNames, sub-menus, shortcuts — is unchanged.
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { createContext, useContext, useState } from "react";

// Share open state so DropdownMenuContent can drive AnimatePresence
const DropdownOpenContext = createContext(false);

// ── Shared motion variants ───────────────────────────────────
const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    filter: "blur(2px)",
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
};

// Item stagger — each item slides in slightly behind the previous
const itemVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, delay: i * 0.03, ease: "easeOut" },
  }),
};

// ── Root — tracks open state ─────────────────────────────────
function DropdownMenu({ open: controlledOpen, onOpenChange, ...props }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;

  const handleChange = (next) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownOpenContext.Provider value={isOpen}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" open={isOpen} onOpenChange={handleChange} {...props} />
    </DropdownOpenContext.Provider>
  );
}

function DropdownMenuPortal({ ...props }) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

// ── Content — AnimatePresence drives open/close ──────────────
function DropdownMenuContent({ className, align = "start", sideOffset = 4, children, ...props }) {
  const isOpen = useContext(DropdownOpenContext);
  const shouldReduceMotion = useReducedMotion();

  const baseClass = cn(
    "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 dark:ring-foreground/20",
    className,
  );

  return (
    <DropdownMenuPrimitive.Portal>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuPrimitive.Content
            data-slot="dropdown-menu-content"
            sideOffset={sideOffset}
            align={align}
            forceMount
            asChild
            {...props}
          >
            <motion.div
              className={baseClass}
              variants={shouldReduceMotion ? undefined : menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {children}
            </motion.div>
          </DropdownMenuPrimitive.Content>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

// ── Item — staggered entrance ────────────────────────────────
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  index = 0, // pass index from parent for stagger
  ...props
}) {
  const { asChild: _, ...restProps } = props;
  const shouldReduceMotion = useReducedMotion();

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      asChild
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className,
      )}
    >
      <motion.div custom={index} variants={shouldReduceMotion ? undefined : itemVariants} {...restProps} />
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({ className, children, checked, inset, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...restProps}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({ className, children, inset, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...restProps}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({ className, inset, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8", className)}
      {...restProps}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...restProps}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className,
      )}
      {...restProps}
    />
  );
}

function DropdownMenuSub({ ...props }) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  const { asChild: _, ...restProps } = props;
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...restProps}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" asChild {...props}>
      <motion.div
        className={cn(
          "z-50 min-w-24 overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 dark:ring-foreground/20",
          className,
        )}
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      />
    </DropdownMenuPrimitive.SubContent>
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
