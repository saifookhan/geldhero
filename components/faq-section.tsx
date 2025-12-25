"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does GeldHero work?",
    answer:
      "Simply enter your basic financial information (income, expenses, assets) and define up to 3 financial goals. Our AI analyzes your data and provides instant feedback on goal feasibility, required savings, and realistic timelines.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use bank-level encryption and are fully GDPR compliant. Your data is never shared with third parties, and we don't sell financial products or services.",
  },
  {
    question: "Do you provide investment advice?",
    answer:
      "No, we focus purely on financial planning. We help you understand what's possible with your current finances and create realistic saving plans. We don't recommend specific investments or financial products.",
  },
  {
    question: "What makes this different from other financial apps?",
    answer:
      "GeldHero is goal-focused, not product-focused. Instead of trying to sell you investments or insurance, we help you understand if your goals are realistic and create actionable plans to achieve them.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Our basic planning tool is completely free during the MVP phase. We want to validate demand for goal-based financial planning before introducing any premium features.",
  },
  {
    question: "Is this only for Germany?",
    answer:
      "Yes, our MVP is specifically designed for the German market, including local financial regulations, tax implications, and available financial products.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about GeldHero
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="mailto:support@geldhero.com"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
