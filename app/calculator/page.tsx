import { CalculatorForm } from "@/components/calculator-form";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <CalculatorForm />
      </main>
      <Footer />
    </div>
  );
}
