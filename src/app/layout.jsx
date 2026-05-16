import { Providers } from "@/components/providers";
import "./globals.css";

import { DM_Sans, Outfit, Lora, Geist_Mono } from "next/font/google";

const fontHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com"),
  title: {
    default: "Cold Flyer | AC Products & Repair Services in Bangladesh",
    template: "%s | Cold Flyer",
  },
  description:
    "Cold Flyer - Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services. Fast delivery, expert technicians.",
  keywords: [
    "AC", "air conditioner", "AC repair", "AC service", "AC maintenance",
    "AC installation", "split AC", "window AC", "AC parts",
    "refrigeration", "Bangladesh", "Dhaka", "cold flyer",
  ],
  authors: [{ name: "Cold Flyer" }],
  creator: "Cold Flyer",
  publisher: "Cold Flyer",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://coldflyer.com",
    siteName: "Cold Flyer",
    title: "Cold Flyer | AC Products & Repair Services in Bangladesh",
    description: "Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cold Flyer - AC Products & Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Flyer | AC Products & Repair Services in Bangladesh",
    description: "Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services.",
    images: ["/og-image.png"],
    creator: "@coldflyer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-BD" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://coldflyer.com" />
      </head>
      <body
        className={`${fontHeading.variable} ${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
