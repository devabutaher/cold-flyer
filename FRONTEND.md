# Cold Flyer - Project Documentation

See `AGENTS.md` at repo root for the quick-start overview. This file covers detailed UI patterns, theming, and component conventions.

This documentation is designed for AI models to understand the project structure, styling, and patterns to help make informed decisions when creating components or making changes.

## Project Overview

- **Project Name**: Cold Flyer
- **Type**: E-commerce website for AC (Air Conditioning) products and services
- **Framework**: Next.js 16.2.4 with React 19.2.4
- **Build Tool**: Turbopack
- **Package Manager**: pnpm

## Tech Stack

- **Frontend**: Next.js 16.2.4, React 19.2.4, React DOM 19.2.4
- **Styling**: Tailwind CSS 4, class-variance-authority, tailwind-merge
- **UI Components**: Radix UI primitives, shadcn/ui components (radix-vega style)
- **Animations**: Motion (Framer Motion), Embla Carousel 8.6.0
- **Icons**: Lucide React 1.11.0
- **Forms**: React Hook Form 7.74.0, Zod 4.3.6, @hookform/resolvers
- **Internationalization**: next-intl 4.12.0 (en, bn), next-themes 0.4.6
- **State**: Zustand 5 (Cart), React Query 5 (Data fetching)
- **Fonts**: Google Fonts - DM Sans (headings), Outfit (body), Lora (serif), Geist Mono (mono), Noto Sans Bengali (bn locale)
- **Utilities**: clsx, twMerge, date-fns, papaparse, xlsx, react-zoom-pan-pinch, react-number-format, sonner, slugify

## Color Theme — Nova White + Orange

All colors are defined in `src/app/globals.css` using OKLCH color space. Supports both light and dark modes via `.dark` class (managed by `next-themes`).

### Light Mode (`:root`)

| Color Variable | Value | Usage |
|----------------|-------|-------|
| `--background` | oklch(0.99 0 0) | Page background (near-white) |
| `--foreground` | oklch(0 0 0) | Primary text (pure black) |
| `--primary` | oklch(0.646 0.222 41.116) | Primary actions, CTAs |
| `--primary-foreground` | oklch(1 0 0) | Text on primary (white) |
| `--secondary` | oklch(0.954 0.038 75.164) | Secondary elements (pale warm) |
| `--secondary-foreground` | oklch(0.646 0.222 41.116) | Text on secondary (matches primary) |
| `--accent` | oklch(0.94 0 0) | Accent backgrounds (light grey) |
| `--accent-foreground` | oklch(0 0 0) | Text on accent (black) |
| `--muted` | oklch(0.97 0 0) | Muted backgrounds |
| `--muted-foreground` | oklch(0.44 0 0) | Muted text |
| `--border` | oklch(0.92 0 0) | Border color |
| `--ring` | oklch(0 0 0) | Focus ring (black) |
| `--destructive` | oklch(0.63 0.19 23.03) | Error/delete actions |

### Dark Mode (`.dark` class)

| Color Variable | Value | Usage |
|----------------|-------|-------|
| `--background` | oklch(0 0 0) | Pure black background |
| `--foreground` | oklch(1 0 0) | White text |
| `--primary` | oklch(0.646 0.222 41.116) | Primary orange (same as light) |
| `--primary-foreground` | oklch(1 0 0) | White text on primary |
| `--secondary` | oklch(0.266 0.079 36.259) | Dark warm secondary |
| `--secondary-foreground` | oklch(0.901 0.076 70.697) | Warm light text on secondary |
| `--accent` | oklch(0.32 0 0) | Dark grey accent |
| `--accent-foreground` | oklch(1 0 0) | White text on accent |
| `--muted` | oklch(0.23 0 0) | Dark muted bg |
| `--muted-foreground` | oklch(0.72 0 0) | Lighter muted text |
| `--border` | oklch(0.26 0 0) | Subtle dark border |
| `--ring` | oklch(0.72 0 0) | Focus ring (light grey) |

### Chart Colors

| Color Variable | Light | Dark |
|----------------|-------|------|
| `--chart-1` | oklch(0.81 0.17 75.35) | oklch(0.81 0.17 75.35) |
| `--chart-2` | oklch(0.55 0.22 264.53) | oklch(0.58 0.21 260.84) |
| `--chart-3` | oklch(0.72 0 0) | oklch(0.56 0 0) |
| `--chart-4` | oklch(0.92 0 0) | oklch(0.44 0 0) |
| `--chart-5` | oklch(0.56 0 0) | oklch(0.92 0 0) |

## Typography

Fonts are loaded via `next/font/google` in `src/app/layout.jsx`:

| CSS Variable | Font | Usage |
|--------------|------|-------|
| `--font-heading` | DM Sans | All headings (h1-h6) — bold, modern |
| `--font-sans` | Outfit | Body text — soft, cool |
| `--font-serif` | Lora | Pull quotes, accent text |
| `--font-mono` | Geist Mono | Code/monospace |
| `--font-bengali` | Noto Sans Bengali | Bengali locale (bn) |

### CSS Note

```css
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
body { font-family: var(--font-sans); }
```

## Animation System

All animation presets are defined in `src/lib/animation.js`. Use these instead of inline variants.

### Import Pattern

```javascript
import { animations, staggerItem, transitionTokens, pageVariants } from "@/lib/animation";
```

### Entrance Variants

| Variant | Usage |
|---------|-------|
| `animations.entrance.fadeUp` | Elements enter from below with blur |
| `animations.entrance.fadeIn` | Simple opacity fade |
| `animations.entrance.fadeLeft` | Slide in from left |
| `animations.entrance.fadeRight` | Slide in from right |
| `animations.entrance.scaleUp` | Scale + opacity |

### Hover Variants

| Variant | Description |
|---------|-------------|
| `animations.hover.lift` | Element lifts up |
| `animations.hover.glow` | Glow effect |
| `animations.hover.scale` | Scale up slightly |
| `animations.hover.underline` | Underline animation |

### Stagger Presets

| Preset | Use |
|--------|-----|
| `animations.stagger.fast` | Grids, lists — 50ms stagger |
| `animations.stagger.normal` | Sections — 80ms stagger |
| `animations.stagger.slow` | Hero, featured — 120ms stagger |

### Scroll Reveal Helper

```javascript
// Single element
<motion.div
  variants={animations.entrance.fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={animations.inView.once}
>
```

### Staggered Grid Pattern

```javascript
<motion.div
  variants={animations.stagger.normal}
  initial="hidden"
  whileInView="visible"
  viewport={animations.inView.once}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Page Transitions

Page transitions are handled by `src/components/layout/page-transition.jsx`. Each main layout wraps children in:

```javascript
<PageTransition>{children}</PageTransition>
```

The root `Providers` wraps with `AnimatePresence mode="wait"` for cross-page animations.

## Spacing & Sizing

```css
--radius: 0.75rem;
--spacing: 0.25rem;
```

## Shadows

Defined in OKLCH with soft opacity — used via `shadow-sm`, `shadow-md`, etc.

## Custom Animations (globals.css)

| Animation | Purpose |
|-----------|---------|
| `shimmer` | Skeleton loading shimmer sweep |
| `pulse-soft` | Gentle pulsing effect |
| `float` | Subtle floating (empty states) |
| `scale-in` | Scale entrance |

## Utility Function

```javascript
// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

## Skeleton Component

The skeleton component (`src/components/ui/skeleton.jsx`) includes a shimmer overlay:

```jsx
<Skeleton className="h-4 w-3/4" />
```

## Component System

This project uses **shadcn/ui** style components:

- **Style**: radix-vega
- **Icon Library**: Lucide
- **Path Alias**: `@/*` maps to `./src/*`

### Component Location

- UI Components: `src/components/ui/`
- Layout Components: `src/components/layout/`
- Home Components: `src/components/home/`
- Products Components: `src/components/products/`
- Detail Components: `src/components/detail/`
- Catalog Components: `src/components/catalog/`
- Cart Components: `src/components/carts/`
- Auth Components: `src/components/auth/`
- Services Components: `src/components/services/`
- Dashboard Components: `src/components/dashboard/`
- Reviews Components: `src/components/reviews/`
- Notifications Components: `src/components/notifications/`
- Common Components: `src/components/common/`
- Providers: `src/components/providers/`
- PWA: `src/components/pwa/`
- SEO: `src/components/seo/`

### Available UI Components

Located in `src/components/ui/`:

| Component | Description |
|-----------|-------------|
| Button | Animated with shimmer, spring hover/tap, variants: default, outline, secondary, ghost, destructive, link |
| Card | Animated entrance with blur, tilt support, cursor shimmer, hover lift |
| Input | Text input field |
| Badge | Label/tag component |
| Avatar | User avatar |
| Checkbox | Checkbox input |
| Select | Dropdown select |
| Tabs | Tab navigation |
| Table | Data table |
| Sheet | Modal/drawer |
| Dropdown Menu | Dropdown menu |
| Tooltip | Tooltip popup |
| Accordion | Collapsible accordion with Radix |
| Separator | Horizontal divider |
| Skeleton | Shimmer loading placeholder |
| Pagination | Pagination controls |
| Textarea | Multi-line text input |
| Label | Form label |
| Radio Group | Radio button group |
| Breadcrumb | Breadcrumb navigation |
| Button Group | Grouped buttons |
| Alert Dialog | Confirmation dialog |
| Infinite Slider | Infinite scrolling slider |
| Text Slider | Text animation slider |
| Filter Dropdown | Filter control |
| File Upload | File upload component |
| Quantity Input | Quantity selector |
| Price Format | Price display formatter |
| Sidebar | Dashboard sidebar |
| Navigation Menu | Navigation menu |

## Dark Mode

Enabled via `next-themes` with `attribute="class"`. Toggle button included in navbar (`ThemeToggle` in `shared.jsx`).

- Respects system preference by default
- Toggle: `Sun`/`Moon` icon button
- All CSS variables have dark mode values in `.dark` block

## Folder Structure

```
cold-flyer/
├── i18n/                       # next-intl routing + request config
├── messages/                   # Translation JSON files (en/, bn/)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public routes
│   │   ├── (dashboard)/        # Dashboard routes
│   │   ├── api/[...path]/      # API proxy → backend
│   │   ├── layout.jsx          # Root layout
│   │   ├── globals.css         # Global styles + theme
│   │   └── not-found.jsx       # 404 page
│   ├── components/
│   │   ├── ui/                 # shadcn UI components
│   │   ├── layout/             # Layout (navbar, footer)
│   │   ├── products/           # Product components
│   │   ├── detail/             # Product detail components
│   │   ├── catalog/            # Catalog/browsing components
│   │   ├── home/               # Home page components
│   │   ├── auth/               # Auth components
│   │   ├── services/           # Service related components
│   │   ├── carts/              # Cart components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── reviews/            # Review components
│   │   ├── notifications/      # Notification components
│   │   ├── common/             # Shared components
│   │   └── providers/          # React context providers
│   ├── data/                   # Static data files (en/, bn/)
│   ├── hooks/                  # Custom React hooks
│   │   └── queries/            # React Query hooks
│   ├── lib/                    # Utilities
│   │   ├── actions/            # Server actions
│   │   ├── schemas/            # Zod schemas
│   │   ├── animation.js        # Animation presets
│   │   └── http-client.js      # Axios client w/ CSRF + refresh
│   ├── store/                  # Zustand stores (cart.js)
│   └── proxy.js                # Middleware (JWT guard)
├── components.json            # shadcn configuration
├── next.config.mjs
├── jsconfig.json              # @/* → ./src/*
└── package.json
```

## Route Structure

### Public Routes (`(public)`)

| Route | Description |
|-------|-------------|
| `/` | Home/Landing page |
| `/items` | All products listing |
| `/items/ac_units` | AC units products |
| `/items/[id]` | Product detail page |
| `/services` | Services listing |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/auth` | Authentication |
| `/order` | Order tracking |
| `/about` | About us |
| `/faq` | FAQ |
| `/blog` | Blog |
| `/contact` | Contact us |
| `/my-bookings` | User bookings |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/shipping` | Shipping info |
| `/careers` | Careers |

### Dashboard Routes (`(dashboard)`)

| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard home |
| `/dashboard/items` | Manage products |
| `/dashboard/items/add` | Add new product |
| `/dashboard/orders` | Manage orders |
| `/dashboard/services` | Manage services |
| `/dashboard/bookings` | Manage bookings |
| `/dashboard/users` | User management |
| `/dashboard/analytics` | Analytics |
| `/dashboard/coupons` | Coupon management |
| `/dashboard/technicians` | Technician management |
| `/dashboard/profile` | Profile settings |

## Component Patterns

### Animation Consistency

All scroll-reveal animations should use the `animations` preset:

```jsx
// Preferred pattern
import { animations, staggerItem } from "@/lib/animation";

<motion.div
  variants={animations.entrance.fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={animations.inView.once}
>
```

### Staggered Grids

```jsx
<motion.div variants={animations.stagger.fast} initial="hidden" whileInView="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

### Card Component

```jsx
<Card animate tilt shimmer>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Button Component

```jsx
<Button variant="default" size="lg">
  Click Me
</Button>
```

Buttons include: spring hover/tap, shimmer effect (default variant), variants for all states.

### Skeleton Loading

```jsx
<Skeleton className="h-4 w-3/4" />
```

Includes automatic shimmer animation sweep.

### Dark Mode Toggle

```jsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
```

## Available Scripts

```bash
pnpm dev         # Start development server (Turbopack)
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
pnpm format      # Format code with Prettier
```

## Notes for AI Models

1. Use `cn()` from `@/lib/utils` for Tailwind class merging
2. Use OKLCH CSS variables from `globals.css` — never hex/HSL
3. Animation presets MUST come from `@/lib/animation` — never inline variants
4. Import icons from `lucide-react` only
5. Heavy libraries (xlsx, papaparse, @react-pdf) → dynamic `import()`
6. All new sections should be `"use client"` unless purely static
7. next-intl with `localePrefix: "never"` — no locale in URL path. Locale detected via `NEXT_LOCALE` cookie or `Accept-Language` header
8. All `/api/*` requests are proxied from `src/app/api/[...path]/route.js` to the backend at `NEXT_PUBLIC_API_URL`. The axios client in `src/lib/http-client.js` handles CSRF token injection and automatic token refresh
9. The `AnimatedSection` component supports: `variant`, `transition`, `delay`, `once`, `margin` props
