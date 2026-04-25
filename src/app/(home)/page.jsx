import About from "@/components/home/about";
import BrandsStrip from "@/components/home/brand-strip";
import Hero from "@/components/home/hero";
import Portfolio from "@/components/home/portfolio";
import PromoCards from "@/components/home/promo-cards";
import Services from "@/components/home/services";
import Shop from "@/components/home/shop/shop";
import StatsStrip from "@/components/home/stats-strip";
import Testimonials from "@/components/home/testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <PromoCards />
      <Shop />
      <Services />
      <About />
      <StatsStrip />
      <BrandsStrip />
      <Portfolio />
      <Testimonials />
    </div>
  );
}
