import Footer from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";


export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer/>
    </div>
  );
}