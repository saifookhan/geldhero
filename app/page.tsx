import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
