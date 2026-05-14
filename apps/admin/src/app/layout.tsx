import type { Metadata } from "next";
import "./globals.css";
import "aos/dist/aos.css";
import { AosInit } from "@/components/AosInit";

export const metadata: Metadata = {
  title: "SAT Admin",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <AosInit />
        {children}
      </body>
    </html>
  );
}

