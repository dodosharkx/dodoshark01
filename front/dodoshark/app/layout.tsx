import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGlobalSettings } from "@/app/lib/global-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const FALLBACK_FAVICON_URL = "/favicon-fallback.png";

const defaultMetadata: Metadata = {
  title: "DoDoShark - Industrial Milling Systems",
  description: "Professional Crushing & Grinding Equipment Manufacturer",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const globalSettings = await getGlobalSettings();
  const faviconUrl =
    globalSettings?.favicon?.asset?.url?.trim() || FALLBACK_FAVICON_URL;

  return {
    ...defaultMetadata,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
