import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BharatClean | Professional Cleaning Services in India",
  description: "Join thousands of homes and offices that trust BharatClean for reliable, subscription-based cleaning services. Book your first session today.",
  keywords: ["cleaning service", "home cleaning", "office cleaning", "India", "subscription cleaning"],
  authors: [{ name: "BharatClean Team" }],
  openGraph: {
    title: "BharatClean | Professional Cleaning Services",
    description: "Subscription-based professional cleaning for a spotless life.",
    url: "https://bharatclean.com",
    siteName: "BharatClean",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t py-8 bg-muted/50">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © 2026 BharatClean. All rights reserved. Built for India with ❤️
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
