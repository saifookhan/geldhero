import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your digital AI financial advisor
              <span className="block text-primary">
                — one of its kind for goal-based financial planning
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Turn your personal finances into a clear, achievable action plan.
              Get immediate clarity on what you can afford, how much to save,
              and when you&apos;ll reach your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" asChild>
                <Link href="/signup" className="flex flex-row">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 text-sm text-gray-500">
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
          </div>

          {/* Hero Image - Right Side */}
          <div className="relative">
            <div className="relative w-full h-[500px] lg:h-[600px] bg-white rounded-2xl">
              <Image
                src="/hero.jpeg"
                alt="GeldHero AI Financial Advisor Dashboard - Goal-based financial planning interface showing personalized insights and action plans"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>

            {/* Optional overlay with key features */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="bg-primary/10 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    Set Goals
                  </h3>
                  <p className="text-xs text-gray-600">
                    Define financial goals
                  </p>
                </div>
                <div>
                  <div className="bg-primary/10 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    AI Analysis
                  </h3>
                  <p className="text-xs text-gray-600">Get insights</p>
                </div>
                <div>
                  <div className="bg-primary/10 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    Take Action
                  </h3>
                  <p className="text-xs text-gray-600">Follow your plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
