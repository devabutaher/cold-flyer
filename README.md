# Cold Flyer

Modern AC service booking and AC parts marketplace built with Next.js 16 App Router and a headless Express/MongoDB backend.

## Features

- **Product Catalog** — Browse AC units, parts, and accessories with search, filters, and categories
- **Shopping Cart & Checkout** — Full cart flow with Stripe and SSLCOMMERZ payment gateways
- **AC Service Booking** — Browse services, book appointments, manage bookings
- **Admin Dashboard** — Manage products, orders, services, users, bookings, coupons, technicians, analytics
- **Authentication** — JWT-based auth (access + refresh tokens) with optional Google OAuth
- **Internationalization** — Full English and Bengali (bn) locale support via next-intl
- **Dark Mode** — System-respecting theme toggle via next-themes
- **Animated UI** — Framer Motion animations, Embla Carousel, scroll-reveal presets

## Tech Stack

**Framework:** Next.js 16.2.4 (App Router, Turbopack), React 19  
**Styling:** Tailwind CSS v4, shadcn/ui (radix-vega), Lucide icons, Radix UI primitives  
**State & Data:** Zustand (cart), React Query (server state)  
**Forms & Validation:** React Hook Form, Zod  
**Internationalization:** next-intl (en, bn, `localePrefix: "never"`)  
**Package Manager:** pnpm

## Getting Started

```bash
git clone https://github.com/devabutaher/cold-flyer.git
cd cold-flyer/cold-flyer
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Firebase (frontend auth)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The backend API should be running at `http://localhost:5000` (see `cold-flyer-server/`).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |

## Links

- **Live:** [https://coldflyer.vercel.app](https://coldflyer.vercel.app)
- **Repository:** [https://github.com/devabutaher/cold-flyer](https://github.com/devabutaher/cold-flyer)

## License

MIT
