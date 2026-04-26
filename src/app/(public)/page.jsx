import About from "@/components/home/about";
import Blogs from "@/components/home/blogs";
import BrandsStrip from "@/components/home/brand-strip";
import Hero from "@/components/home/hero";
import Portfolio from "@/components/home/portfolio";
import ShopSection from "@/components/home/products/shop-section";
import PromoCards from "@/components/home/promo-cards";
import Services from "@/components/home/services";
import StatsStrip from "@/components/home/stats-strip";
import Testimonials from "@/components/home/testimonials";

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
      <Portfolio />
      <Testimonials />
      <Blogs />
    </>
  );
}
