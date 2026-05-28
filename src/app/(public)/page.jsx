import About from "@/components/home/about";
import BrandsStrip from "@/components/home/brand-strip";
import Hero from "@/components/home/hero";
import ShopSection from "@/components/home/products/shop-section";
import PromoCards from "@/components/home/promo-cards";
import Services from "@/components/home/services";
import StatsStrip from "@/components/home/stats-strip";
import dynamic from "next/dynamic";

export const metadata = { title: "Home" };

const Testimonials = dynamic(() => import("@/components/home/testimonials"));
const Faq = dynamic(() => import("@/components/home/faq"));
const Contact = dynamic(() => import("@/components/home/contact"));
const Blogs = dynamic(() => import("@/components/home/blogs"));
const RecentWorks = dynamic(() => import("@/components/home/recent-works"));

function SectionSkeleton() {
  return (
    <div className="py-10 sm:py-14 md:py-16">
      <div className="container">
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <PromoCards />
      <ShopSection />
      <Services />
      <About />
      <StatsStrip />
      <BrandsStrip />
      <Testimonials loading={<SectionSkeleton />} />
      <Faq loading={<SectionSkeleton />} />
      <Contact loading={<SectionSkeleton />} />
      <RecentWorks loading={<SectionSkeleton />} />
      <Blogs loading={<SectionSkeleton />} />
    </>
  );
}
