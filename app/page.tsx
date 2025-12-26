import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { CalculatorForm } from "@/components/calculator-form";

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <div className="bg-blue-50 p-4" id="calculator">
        <CalculatorForm />
      </div>
      <FAQSection />
      <Footer />
    </main>
  );
}
