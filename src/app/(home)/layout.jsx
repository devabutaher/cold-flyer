import Navbar from "@/components/layout/Navbar/Navbar";

export default function layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
