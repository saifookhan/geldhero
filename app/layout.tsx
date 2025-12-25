import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeldHero - AI Financial Advisor",
  description:
    "Your digital AI financial advisor — one of its kind for goal-based financial planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-outfit antialiased">{children}</body>
    </html>
  );
}
