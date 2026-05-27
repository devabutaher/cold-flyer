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
- Checkout Components: `src/components/checkout/` — `address-picker.jsx`, `order-items-list.jsx`, `payment-method-selector.jsx`, `order-summary.jsx`, `checkout-page.jsx`
- Auth Components: `src/components/auth/`
- Services Components: `src/components/services/`
- Dashboard Components: `src/components/dashboard/` (sub-directories: activity-log, applications, attendance, blog, booking, checkout, coupons, customers, expenses, layout, location, messages, orders, product, profile, recent-works, reporting, service, stats, table, technicians, users)
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
| Alert Dialog | Confirmation dialog — `w-[calc(100%-2rem)]` ensures 16px side margin on mobile matching app-shell `px-4` |
| Infinite Slider | Infinite scrolling slider |
| Text Slider | Text animation slider |
| Filter Dropdown | Filter control |
| File Upload | File upload component |
| Quantity Input | Quantity selector |
| Price Format | Price display formatter |
| SearchableSelect | Popover + search input + scrollable list — BD district/thana selector |
| Sidebar | Dashboard sidebar |
| Navigation Menu | Navigation menu |
| Command | Command palette / search |
| Dialog | Modal dialog |
| Popover | Popover overlay |
| ScrollArea | Scrollable area |
| HoverCard | Hover card popup |
| Calendar | Date picker calendar |
| Drawer | Responsive drawer (mobile-bottom, desktop-side) |
| Form | Form component (react-hook-form) |
| Toggle Group | Toggle button group |
| Sonner | Toast notifications |

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
│   │   ├── api/[...path]/      # API proxy → backend (forwards Set-Cookie via getSetCookie())
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
│   │   ├── checkout/           # Checkout components (address-picker, order-items, payment-method, order-summary, checkout-page)
│   │   ├── dashboard/          # Dashboard components (activity-log, attendance, blog, booking, coupons, customers, expenses, layout, location, messages, orders, product, profile, recent-works, reporting, service, stats, table, technicians, users)
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
│   │   └── http-client.js      # Axios client (cookies via withCredentials)
│   ├── store/                  # Zustand stores (cart.js)
│   └── proxy.js                # Edge proxy (Next.js 16 convention, replaces middleware.js — JWT guard + RBAC redirect)
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
| `/items/ac_parts` | AC parts products |
| `/items/[id]` | Product detail page |
| `/services` | Services listing |
| `/services/[id]` | Service detail page |
| `/cart` | Shopping cart |
| `/checkout/[id]` | Checkout by order ID |
| `/order/[id]` | Order tracking by ID |
| `/auth` | Authentication |
| `/about` | About us |
| `/faq` | FAQ |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog detail page |
| `/contact` | Contact us |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/shipping` | Shipping info |
| `/careers` | Careers |
| `/recent-works` | Recent works gallery |
| `/recent-works/[slug]` | Recent work detail |
| `/book/[serviceId]` | Public booking (no auth required — guest mode with inline address + customer info) |

### Dashboard Routes (`(dashboard)`)

| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard home |
| `/dashboard/activity-log` | Activity log viewer |
| `/dashboard/analytics` | Analytics & charts |
| `/dashboard/applications` | Job applications |
| `/dashboard/attendance` | Attendance + GPS check-in/out |
| `/dashboard/blogs` | Blog management |
| `/dashboard/blogs/add` | Add new blog post |
| `/dashboard/blogs/edit/[id]` | Edit blog post |
| `/dashboard/bookings` | Service bookings |
| `/dashboard/bookings/[id]` | Booking details |
| `/dashboard/bookings/edit/[id]` | Edit booking |
| `/dashboard/bookings/new/[serviceId]` | New booking form |
| `/dashboard/coupons` | Coupon management |
| `/dashboard/customers` | Customer management |
| `/dashboard/expenses` | Expense tracking |
| `/dashboard/items` | Product management |
| `/dashboard/items/add` | Add new product |
| `/dashboard/items/edit/[id]` | Edit product |
| `/dashboard/location` | Live worker location tracking |
| `/dashboard/messages` | WhatsApp/SMS messaging |
| `/dashboard/orders` | Order management |
| `/dashboard/orders/[id]` | Order details |
| `/dashboard/profile` | Profile settings |
| `/dashboard/recent-works` | Recent works management |
| `/dashboard/recent-works/add` | Add recent work |
| `/dashboard/recent-works/edit/[id]` | Edit recent work |
| `/dashboard/reporting` | P&L reports & duplicate detection |
| `/dashboard/services` | Service management |
| `/dashboard/services/add` | Add new service |
| `/dashboard/services/edit/[id]` | Edit service |
| `/dashboard/technicians` | Technician management |
| `/dashboard/technicians/[id]` | Technician details |
| `/dashboard/users` | User management |
| `/dashboard/users/[id]` | User details |

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
8. All `/api/*` requests are proxied from `src/app/api/[...path]/route.js` to the backend at `NEXT_PUBLIC_API_URL`. Cookies are forwarded automatically via `withCredentials: true` (client) or explicit `Cookie`/`Authorization` headers (server proxy).
9. The `AnimatedSection` component supports: `variant`, `transition`, `delay`, `once`, `margin` props

10. Next.js 16 `params` is a Promise — use `const { id } = await params` in page components
11. `next/dynamic` in Server Components cannot use `{ ssr: false }` in Next.js 16 — use plain `dynamic(() => import(...))` without options
12. BD address data at `src/data/bd-addresses.js` — 65 districts, 536 thanas, `getThanas(districtId)` helper
13. Profile shared components: `AddressCard` (`src/components/dashboard/profile/address-card.jsx`), `AddressFormSheet` (`src/components/dashboard/profile/address-form-sheet.jsx`) — reusable in checkout
14. Server actions (`lib/actions/*.js`) use `revalidatePath` for cache invalidation. Do NOT convert to `revalidateTag` — the data layer uses Axios (not native `fetch()`) and tags would be no-ops.
15. Form initialization from props in dialog components: use `useEffect` + `// eslint-disable-next-line react-hooks/set-state-in-effect` comment. This is the accepted React 19 migration pattern.
16. TanStack Query hooks are centralized in `src/hooks/queries/` (19 files). All mutation hooks call `invalidateQueries` on success. The server action files call `revalidatePath` independently — both mechanisms work together.
17. Auth page `src/app/(public)/auth/page.jsx` uses `force-dynamic` + `<Suspense>` boundary around `AuthPageComponent` (which calls `useSearchParams()`). This ensures the `?redirect` query param is available after login in production. Without this, statically rendered pages may not have search params at hydration time.
18. API proxy `src/app/api/[...path]/route.js` forwards `Set-Cookie` headers using `response.headers.getSetCookie()` (Node 20+ API). This correctly handles multiple cookies, unlike `Headers.forEach()` which can mangle them. Requires Node >= 20.

## Dashboard Booking Details

Located at `src/components/dashboard/booking/booking-details/`:

| File | Purpose |
|------|---------|
| `booking-details.jsx` | Main two-column layout (`lg:grid-cols-3`) — detail body + admin actions sidebar. Shows AC Unit card (brand, model, ton, gasType, acType) + guest customer info when no user |
| `detail-card.jsx` | Reusable Card wrapper with icon + title for field groups |
| `booking-detail-skeleton.jsx` | Loading skeleton matching the two-column layout |
| `booking-header.jsx` | Top section with booking status badge, title, meta info |
| `booking-cancel-dialog.jsx` | Cancel booking confirmation dialog |

## Dashboard Table Columns

All dashboard tables use TanStack React Table v8 via the shared `DataTable` component at `src/components/dashboard/table/data-table.jsx`. Column definitions use factory functions (`buildXxxColumns({ callbacks })`) returning column arrays.

### Column Design Principles
- Show sufficient identifying data without bloat
- Core fields only — full details on dedicated detail pages
- Every table has: checkbox selection, global search, status filter, export (CSV/Excel/JSON/PDF)

### Modified Tables

| Table | Columns | File |
|-------|---------|------|
| **Orders** | Product, Customer (added), Date, Status, Payment, Amount, Actions | `orders-table/order-columns.jsx` |
| **Bookings** | Customer, Service, Technician (added), Date, Status, Payment Status (added), Actions | `booking/bookings-table/booking-columns.jsx` |
| **Blogs** | Title, Author (added), Category, Featured (added), Views, Created, Actions | `blog/blog-columns.jsx` |
| **Technicians** | Name, Email, Specialization, Status, Rating, Salary, Jobs Done, Actions (NID/Blood Group/Emergency Contact removed) | `technicians/technicians-columns.jsx` |
| **Users** | User ID (added, `MonoCell`), User, Phone, Role (technician badge, admin/user select), Status (added, `isActive` badge), Last Login (added), Joined, Actions | `users/users-columns.jsx` |
| **Customers** | Name, Customer ID (in PDF), Phone, Brand, Model, Unit, Ton (added), Gas Type (added), Service, Install Date, Amount, Bookings (added), Status, Actions | `customers/customers-table.jsx` |

### Custom UID Display
User ID (`USR-xxxxx`) uses `MonoCell` component for monospace styling. Customer ID (`CUST-xxxxx`) shown in PDF export columns. Both fields auto-generated via `pre('save')` hooks — see BACKEND.md.

### Tabs Component Fix

**File:** `src/components/ui/tabs.jsx`

The Radix UI `Tabs` primitive sets `data-orientation="horizontal"` attribute, NOT bare `data-horizontal`. The component used invalid Tailwind selectors (`data-horizontal:flex-col`) that never matched, so all tab layouts rendered as single-column. Fixed 11 occurrences by changing:

```
data-horizontal:  →  data-[orientation=horizontal]:
data-vertical:    →  data-[orientation=vertical]:
```

### Link Import Naming Collision

`lucide-react` exports a `Link` icon component that collides with Next.js's `Link` from `next/link`. When both are imported in the same file, the lucide icon shadows the navigation component. The fix: remove `Link` from the lucide import and add `import Link from "next/link"` separately.

**Affected file:** `src/components/dashboard/users/user-details.jsx`

## Dashboard Attendance Components

Located at `src/components/dashboard/attendance/`:

| File | Purpose |
|------|---------|
| `attendance-page.jsx` | Orchestrator — two-column layout, date + status filters |
| `worker-card.jsx` | Worker check-in status card with check-in/out actions |
| `check-in-dialog.jsx` | GPS check-in dialog with location picker |
| `check-out-dialog.jsx` | Check-out confirmation dialog with note |
| `attendance-utils.js` | Helper: `formatTimeAgo()`, status label/color maps |

## Dashboard Messages Components

Located at `src/components/dashboard/messages/`:

| File | Purpose |
|------|---------|
| `messages-page.jsx` | Orchestrator — 3-step wizard flow (Recipients → Message → Send) with state management |
| `step-indicator.jsx` | Visual 3-step progress bar with step labels, clickable navigation |
| `recipients-picker.jsx` | Customer/technician import from API, manual name+phone entry, pill-list with remove |
| `message-editor.jsx` | Template dropdown (`TEMPLATES` in constants) + textarea with `{name}` variable substitution |
| `send-actions.jsx` | WhatsApp / SMS send buttons with per-recipient progress status |
| `message-log.jsx` | Sent message history table fetched from API |
| `message-constants.js` | 8 Bengali message templates, channel options, helper labels |

**WhatsApp delivery note:** MVP uses `wa.me` browser links (one tab per recipient, 1.5s delay) + server-side `POST /api/messages` audit logging. No true WhatsApp Business API — no delivery tracking, no message templates, no opt-in management. To upgrade: integrate Twilio/Meta Cloud API with a dedicated service layer. SMS uses `sms:` protocol links (opens default SMS app).

**Message templates:** 8 Bengali-language templates in `message-constants.js`: appointment reminder, order confirmation, payment reminder, service follow-up, promotional offer, festival greeting, general notice, technician dispatch. Templates use `{name}` placeholder replaced with each recipient's name at send time.

Admin action dialogs accept `triggerClassName` and `triggerVariant` props for full-width styling:

```jsx
<ConfirmBookingDialog
  bookingId={id}
  triggerClassName="w-full"
  triggerVariant="default"
/>
```

Cancel dialog pattern — AlertDialog wraps outside DropdownMenu:

```jsx
<AlertDialog>
  <DropdownMenu>
    <DropdownMenuTrigger>⋮</DropdownMenuTrigger>
    <DropdownMenuContent>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Cancel Booking
        </DropdownMenuItem>
      </AlertDialogTrigger>
    </DropdownMenuContent>
  </DropdownMenu>
  <AlertDialogContent>...</AlertDialogContent>
</AlertDialog>
```
