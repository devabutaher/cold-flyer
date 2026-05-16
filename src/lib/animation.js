export const animations = {
  // ── Entrance variants ──────────────────────────────
  entrance: {
    fadeUp: {
      hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -24 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    },
    fadeRight: {
      hidden: { opacity: 0, x: 24 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
  },

  // ── Hover variants ─────────────────────────────────
  hover: {
    lift: {
      rest: { y: 0 },
      hover: { y: -4 },
    },
    glow: {
        rest: { boxShadow: "0 0 0 0 oklch(0.6460 0.2220 41.1160 / 0)" },
        hover: { boxShadow: "0 0 20px 0 oklch(0.6460 0.2220 41.1160 / 0.2)" },
    },
    scale: {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
    },
    underline: {
      rest: { scaleX: 0 },
      hover: { scaleX: 1 },
    },
  },

  // ── Tap variants ───────────────────────────────────
  tap: {
    press: { scale: 0.96 },
    firm: { scale: 0.94 },
    bounce: { scale: 0.92 },
  },

  // ── Spring presets ─────────────────────────────────
  spring: {
    snappy: { type: "spring", stiffness: 500, damping: 22, mass: 0.6 },
    smooth: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 },
    bouncy: { type: "spring", stiffness: 400, damping: 15, mass: 0.5 },
    gentle: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  },

  // ── Stagger presets ────────────────────────────────
  stagger: {
    fast: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
      },
    },
    normal: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
      },
    },
    slow: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
      },
    },
  },

  // ── Scroll-reveal shorthand ────────────────────────
  scrollReveal: (variant = "fadeUp", delay = 0) => ({
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-60px" },
    variants: animations.entrance[variant] || animations.entrance.fadeUp,
    transition: { delay },
  }),

  // ── In-view config (for use with motion components) ─
  inView: {
    once: { once: true, margin: "-60px" },
    repeat: { once: false, margin: "-60px" },
  },
};

export const transitionTokens = {
  fast: { duration: 0.2, ease: "easeOut" },
  normal: { duration: 0.35, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeInOut" },
};

// ── Page transition variants ─────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// ── Staggered item variant ───────────────────────────
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};
