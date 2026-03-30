import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGlobalSettings } from "@/app/lib/global-settings";
import { SanityLive } from "@/app/lib/sanity.live";
import { studioUrl } from "@/app/lib/sanity";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const draft = await draftMode();
  const globalSettings = await getGlobalSettings();

  const VisualEditingAny = VisualEditing as any;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
      >
        <Header settings={globalSettings} />
        {children}
        <Footer settings={globalSettings} />
        <SanityLive />
        {draft.isEnabled && <VisualEditingAny studioUrl={studioUrl} />}
      </body>
    </html>
  );
}
