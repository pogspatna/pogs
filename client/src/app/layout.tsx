import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pogspatna.org'),
  title: "POGS - Patna Obstetrics & Gynaecological Society",
  description: "Official website of Patna Obstetrics & Gynaecological Society. Connecting medical professionals and advancing obstetrics and gynaecology in Bihar, India.",
  keywords: "POGS, Patna, Obstetrics, Gynaecology, Medical Society, Bihar, Healthcare, Medical Education",
  authors: [{ name: "POGS" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pogspatna.org",
    title: "POGS - Patna Obstetrics & Gynaecological Society",
    description: "Official website of Patna Obstetrics & Gynaecological Society",
    siteName: "POGS",
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'POGS Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POGS - Patna Obstetrics & Gynaecological Society",
    description: "Official website of Patna Obstetrics & Gynaecological Society",
    images: ['/web-app-manifest-512x512.png'],
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
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-gray-50`}>
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <Navbar />
        <main className="flex-1">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
