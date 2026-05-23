import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StepsSection from "@/components/StepsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content" className="bg-light min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StepsSection />
      <Footer />
    </main>
  );
}
