import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Legal Information & Disclaimer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Important legal information about the use of GeldHero platform
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <strong>Important Notice:</strong> This platform is not
                  operated by financial advisors, investment advisors, banks, or
                  brokers. All information, insights, simulations, and outputs
                  provided by this platform are generated using automated
                  calculation logic and artificial intelligence (AI) based
                  solely on the data entered by the user. Artificial
                  intelligence can make mistakes, produce incomplete results, or
                  generate inaccurate interpretations. Outputs should therefore
                  be treated as informational and illustrative only, not as
                  professional advice. By using this platform, you acknowledge
                  and accept these limitations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Impressum */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              1. Impressum (Legal Notice)
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800">Provider:</h3>
                <p className="text-gray-600">GeldHero</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Contact:</h3>
                <p className="text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:geldhero@xyz.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    geldhero@xyz.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: No Financial Advice */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              2. No Financial, Investment, Tax, or Legal Advice
            </h2>
            <p className="text-gray-600 mb-4">
              The platform provides financial planning simulations and
              educational information only.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Specifically:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    We are not financial advisors within the meaning of German
                    or EU financial regulation.
                  </li>
                  <li>
                    We do not provide investment advice, tax advice, legal
                    advice, or individualized financial recommendations.
                  </li>
                  <li>
                    We do not assess suitability or appropriateness of financial
                    products.
                  </li>
                  <li>
                    We do not recommend buying, selling, holding, or avoiding
                    any specific financial instrument or product.
                  </li>
                  <li>
                    All outputs are generic in nature, even if they appear
                    personalized.
                  </li>
                  <li>
                    Users should consult licensed professionals before making
                    any financial decisions.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Use of AI */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              3. Use of Artificial Intelligence
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  This platform uses artificial intelligence to:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Summarize financial inputs</li>
                  <li>Generate explanations</li>
                  <li>Simulate scenarios</li>
                  <li>
                    Translate numerical results into plain-language insights
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  Important limitations:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-700 ml-4">
                  <li>
                    AI outputs are based on statistical models and predefined
                    rules
                  </li>
                  <li>
                    AI does not understand your full personal, legal, or
                    financial context
                  </li>
                  <li>
                    AI may produce errors, oversimplifications, or misleading
                    conclusions
                  </li>
                  <li>
                    We make no guarantees regarding the correctness,
                    completeness, or suitability of AI-generated content.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Scope of Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              4. Scope of the Service
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  This platform provides:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li>
                    Financial snapshots (income, expenses, surplus/deficit)
                  </li>
                  <li>Goal feasibility assessments</li>
                  <li>Scenario-based planning simulations</li>
                  <li>Educational explanations of financial concepts</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  This platform explicitly does not:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  <li>Execute financial transactions</li>
                  <li>Hold or manage user funds</li>
                  <li>Provide access to financial products</li>
                  <li>Act as an intermediary or distributor</li>
                  <li>Replace professional financial advice</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: User Responsibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              5. User Responsibility
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Users are solely responsible for:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>
                    The accuracy and completeness of the data they provide
                  </li>
                  <li>Interpreting the results appropriately</li>
                  <li>Any decisions made based on the platform's outputs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  We are not responsible for consequences arising from:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Incorrect user input</li>
                  <li>Misinterpretation of results</li>
                  <li>
                    Reliance on AI-generated insights without professional
                    verification
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              6. Limitation of Liability
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">
                To the maximum extent permitted by law, we disclaim all
                liability for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Financial losses or missed opportunities</li>
                <li>Direct or indirect damages</li>
                <li>Decisions made based on platform outputs</li>
                <li>Errors arising from AI-generated content</li>
              </ul>
              <p className="text-gray-700 mt-3 font-semibold">
                Use of the platform is entirely at the user's own risk.
              </p>
            </div>
          </section>

          {/* Section 7: Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              7. Data Protection & Privacy (GDPR Compliance)
            </h2>
            <p className="text-gray-600 mb-4">
              We process personal data in accordance with the EU General Data
              Protection Regulation (GDPR).
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Data collected:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>
                    Personal and demographic information voluntarily provided by
                    users
                  </li>
                  <li>Financial data necessary for planning simulations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Purpose of processing:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Generating personalized planning outputs</li>
                  <li>Improving platform functionality</li>
                  <li>Ensuring system security</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">We do not:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Sell personal data</li>
                  <li>Share data with third parties for marketing</li>
                  <li>
                    Collect bank account credentials or payment data in the MVP
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Users have the right to:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Access their data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of their data at any time</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                Full details are available in the Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 8: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              8. Data Security
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Data is stored using industry-standard security measures</li>
              <li>Encryption is applied where appropriate</li>
              <li>Access is restricted to authorized systems only</li>
            </ul>
            <p className="text-gray-600 mt-3 italic">
              Despite these measures, no system can be guaranteed to be
              completely secure.
            </p>
          </section>

          {/* Section 9: External Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              9. External Links & Third-Party Content
            </h2>
            <p className="text-gray-600 mb-3">
              This platform may contain links to external websites for
              educational purposes.
            </p>
            <div>
              <h3 className="font-semibold text-gray-800">We:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Do not control external content</li>
                <li>Do not endorse third-party opinions or products</li>
                <li>
                  Are not responsible for external site availability or accuracy
                </li>
              </ul>
            </div>
          </section>

          {/* Section 10: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              10. Intellectual Property
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">
                  All content on this platform, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Text</li>
                  <li>Calculations</li>
                  <li>Visualizations</li>
                  <li>AI-generated summaries</li>
                  <li>Design elements</li>
                </ul>
              </div>
              <p className="text-gray-600">
                is protected by intellectual property laws. Unauthorized
                reproduction, distribution, or use is prohibited.
              </p>
            </div>
          </section>

          {/* Section 11: Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              11. Changes to This Legal Information
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                We reserve the right to update or modify this legal information
                at any time to reflect:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Legal or regulatory changes</li>
                <li>Product evolution</li>
                <li>Technical developments</li>
              </ul>
              <p className="text-gray-600">
                Continued use of the platform constitutes acceptance of the
                updated terms.
              </p>
            </div>
          </section>

          {/* Section 12: Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              12. Governing Law & Jurisdiction
            </h2>
            <p className="text-gray-600">
              This platform is governed by the laws of the Federal Republic of
              Germany.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-3">
              Questions about this legal information?
            </h2>
            <p className="text-blue-800">
              If you have any questions about this legal information, please
              contact us at{" "}
              <a
                href="mailto:geldhero@xyz.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                geldhero@xyz.com
              </a>
            </p>
          </section>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: December 25, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
