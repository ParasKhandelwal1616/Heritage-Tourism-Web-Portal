import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { getGlobalSettings } from "@/app/actions/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heritage & Tourism Club | Explore India's Treasures",
  description: "Experience the timeless beauty and vibrant culture of global heritage.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextAuthSessionProvider>
          <Navbar settings={settings} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer settings={settings} />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
