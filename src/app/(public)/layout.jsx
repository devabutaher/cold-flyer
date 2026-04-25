import Footer from "@/components/layout/footer/footer";
import Navbar from "@/components/layout/navbar/navbar";
import { TextSlider } from "@/components/ui/text-slider";

export default function layout({ children }) {
  return (
    <>
      <TextSlider />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
