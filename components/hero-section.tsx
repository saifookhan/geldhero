import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your digital AI financial advisor
            <span className="block text-primary">
              — one of its kind for goal-based financial planning
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn your personal finances into a clear, achievable action plan.
            Get immediate clarity on what you can afford, how much to save, and
            when you&apos;ll reach your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Planning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Goal-Based Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>AI-Powered Insights</span>
            </div>
          </div>

          {/* Hero illustration placeholder */}
          <div className="bg-gray-100 rounded-2xl p-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Set Goals
                  </h3>
                  <p className="text-sm text-gray-600">
                    Define up to 3 financial goals
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI Analysis
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get personalized insights
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Take Action
                  </h3>
                  <p className="text-sm text-gray-600">
                    Follow your custom plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
