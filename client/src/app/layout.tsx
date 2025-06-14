import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POGS - Patna Obstetrics & Gynaecological Society",
  description: "Official website of Patna Obstetrics & Gynaecological Society. Connecting medical professionals and advancing obstetrics and gynaecology in Bihar, India.",
  keywords: "POGS, Patna, Obstetrics, Gynaecology, Medical Society, Bihar, Healthcare, Medical Education",
  authors: [{ name: "POGS" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pogspatna.org",
    title: "POGS - Patna Obstetrics & Gynaecological Society",
    description: "Official website of Patna Obstetrics & Gynaecological Society",
    siteName: "POGS",
  },
  twitter: {
    card: "summary_large_image",
    title: "POGS - Patna Obstetrics & Gynaecological Society",
    description: "Official website of Patna Obstetrics & Gynaecological Society",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-gray-50`}>
        <Navbar />
        <main className="flex-1">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
