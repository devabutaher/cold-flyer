import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons";
import { ServiceOfferPopup } from "@/components/layout/service-offer-popup";
import Footer from "@/components/layout/footer/footer";
import Navbar from "@/components/layout/navbar/navbar";
import { TextSlider } from "@/components/ui/text-slider";
import { PageTransition } from "@/components/layout/page-transition";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import Script from "next/script";

export default function layout({ children }) {
  return (
    <>
      <Script
        id="register-sw"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .then(() => {})
                  .catch(() => {});
              });
            }
          `,
        }}
      />
      <TextSlider />
      <Navbar />
      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingContactButtons />
      <ServiceOfferPopup />
      <PWAInstallPrompt />
    </>
  );
}
