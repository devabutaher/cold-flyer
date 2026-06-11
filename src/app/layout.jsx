import { NextIntlProvider, Providers } from "@/components/providers";
import "./globals.css";

import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { getLocale, getMessages } from "next-intl/server";
import { DM_Sans, Geist_Mono, Noto_Sans_Bengali, Outfit } from "next/font/google";

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

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "optional",
});

const fontBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  preload: true,
});

export async function generateMetadata() {
  const locale = await getLocale();
  const messages = await getMessages();
  const common = messages.common || {};
  const siteName = common.siteName || "Cold Flyer";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.vercel.app"),
    title: {
      default:
        locale === "bn"
          ? "কোল্ড ফ্লায়ার | এসি পণ্য ও সার্ভিস বাংলাদেশ"
          : "Cold Flyer | AC Products & Repair Services in Bangladesh",
      template: `%s | ${siteName}`,
    },
    description:
      locale === "bn"
        ? "কোল্ড ফ্লায়ার - বাংলাদেশের শীর্ষস্থানীয় এসি সরবরাহকারী এবং সার্ভিস প্রদানকারী। এসি ইউনিট ও যন্ত্রাংশ কিনুন, মেরামত ও মেইনটেন্যান্স সার্ভিস বুক করুন।"
        : "Cold Flyer - Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services.",
    keywords: [
      "AC",
      "air conditioner",
      "AC repair",
      "AC service",
      "AC maintenance",
      "AC installation",
      "split AC",
      "window AC",
      "AC parts",
      "refrigeration",
      "Bangladesh",
      "Dhaka",
      "cold flyer",
    ],
    authors: [{ name: "Cold Flyer" }],
    creator: "Cold Flyer",
    publisher: "Cold Flyer",
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: locale === "bn" ? "bn_BD" : "en_BD",
      url: "https://coldflyer.vercel.app",
      siteName,
      title:
        locale === "bn"
          ? "কোল্ড ফ্লায়ার | এসি পণ্য ও সার্ভিস বাংলাদেশ"
          : "Cold Flyer | AC Products & Repair Services in Bangladesh",
      description:
        locale === "bn"
          ? "বাংলাদেশের শীর্ষস্থানীয় এসি সরবরাহকারী। এসি ইউনিট ও যন্ত্রাংশ কিনুন, মেরামত ও মেইনটেন্যান্স সার্ভিস বুক করুন।"
          : "Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services.",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${siteName} - AC Products & Services` }],
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "bn"
          ? "কোল্ড ফ্লায়ার | এসি পণ্য ও সার্ভিস বাংলাদেশ"
          : "Cold Flyer | AC Products & Repair Services in Bangladesh",
      description:
        locale === "bn"
          ? "বাংলাদেশের শীর্ষস্থানীয় এসি সরবরাহকারী। এসি ইউনিট ও যন্ত্রাংশ কিনুন, মেরামত ও মেইনটেন্যান্স সার্ভিস বুক করুন।"
          : "Leading AC supplier and service provider in Bangladesh. Shop AC units & parts, book repair & maintenance services.",
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
}

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale === "bn" ? "bn-BD" : "en-BD"} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://coldflyer.vercel.app" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4600a" />
        {/* TODO: replace with CSS variable when supported */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cold Flyer" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${fontHeading.variable} ${fontSans.variable} ${fontMono.variable} ${fontBengali.variable} antialiased overflow-x-hidden`}
      >
        <NextIntlProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlProvider>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        <Analytics />
      </body>
    </html>
  );
}
