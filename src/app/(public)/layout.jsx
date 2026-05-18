import Footer from "@/components/layout/footer/footer";
import Navbar from "@/components/layout/navbar/navbar";
import { TextSlider } from "@/components/ui/text-slider";
import { PageTransition } from "@/components/layout/page-transition";

export default function layout({ children }) {
  return (
    <>
      <TextSlider />
      <Navbar />
      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
