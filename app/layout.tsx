import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "GeldHero - AI Financial Advisor | Goal-Based Financial Planning",
  description:
    "Your digital AI financial advisor — one of its kind for goal-based financial planning. Turn your personal finances into a clear, achievable action plan with AI-powered insights.",
  keywords: [
    "AI financial advisor",
    "goal-based financial planning",
    "personal finance",
    "financial planning app",
    "savings goals",
    "financial advisor",
    "budgeting app",
    "financial insights",
    "money management",
    "financial goals",
  ],
  authors: [{ name: "GeldHero Team" }],
  creator: "GeldHero",
  publisher: "GeldHero",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://geldhero.com",
    siteName: "GeldHero",
    title: "GeldHero - AI Financial Advisor | Goal-Based Financial Planning",
    description:
      "Your digital AI financial advisor — one of its kind for goal-based financial planning. Turn your personal finances into a clear, achievable action plan with AI-powered insights.",
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "GeldHero AI Financial Advisor Dashboard",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@geldhero",
    creator: "@geldhero",
    title: "GeldHero - AI Financial Advisor | Goal-Based Financial Planning",
    description:
      "Your digital AI financial advisor — one of its kind for goal-based financial planning. Turn your personal finances into a clear, achievable action plan.",
    images: ["/hero.jpeg"],
  },
  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
