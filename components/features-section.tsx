import {
  Target,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Calculator,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Goal-Based Planning",
    description:
      "Set up to 3 financial goals and get a realistic assessment of their feasibility based on your current situation.",
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes your financial data to provide personalized recommendations and optimize your saving strategy.",
  },
  {
    icon: Calculator,
    title: "Instant Clarity",
    description:
      "Get immediate answers on what you can afford, how much to save, and realistic timelines for your goals.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "GDPR compliant with bank-level security. Your financial data is encrypted and never shared with third parties.",
  },
  {
    icon: Zap,
    title: "No Product Pressure",
    description:
      "Pure planning focus. No investment advice, no product recommendations, no sales pressure.",
  },
  {
    icon: Users,
    title: "Germany Focused",
    description:
      "Tailored for the German market with local financial products, tax implications, and regulatory compliance.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for smart financial planning
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with financial expertise to
            give you clear, actionable insights about your financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to take control of your financial future?
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of Germans who have already discovered what&apos;s
              financially possible with our AI-powered planning tool.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Free Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
