import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/headers/navbar";
import { Footer } from "@/components/footer/footer";
import { FeaturesSection } from "@/components/sections/features-section";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";
import { Cart } from "@/components/cart";
import { MobileFooterNavbar } from "@/components/footer/mobile-footer-navbar";
import { siteMeta } from "@/data";
import { ReactQueryClientProvider } from "@/provider/queryClient-provider";
import TopLoadingBar from "@/components/top-loading-bar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteMeta.siteName} | Your Trust`,
    template: `%s | ${siteMeta.siteName}`,
  },
  icons:[{url:"/logo.svg",sizes: "32x32", href:"/"}],
  description: siteMeta.desc,
  keywords: siteMeta.keyWords,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    title: siteMeta.openGraph.title,
    description: siteMeta.openGraph.desc,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: siteMeta.siteName,
    locale: "bn_BD",
    type: "website",
    images: [
      {
                url: `${siteMeta.openGraph.image}`, 
                width: 1200,
                height: 630,
      }
    ],
  },
  twitter: {
    card:"summary_large_image",
    title: siteMeta.twitter.title,
    description: siteMeta.twitter.description,
    creator: siteMeta.twitter.creator,
    images: siteMeta.twitter.image,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
    languages: {
      en: "https://your-domain.com/en",
      bn: "https://your-domain.com/bn",
    },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* ✅ Bangladesh SEO specific */}
        <meta name="google-site-verification" content="WjC9PZ6_fnkB0mYfs3I9mr3CVQgeauW-japi-LW31cM" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Khagrachari" />
        <meta name="geo.position" content="23.1193;91.9847" />
        <meta name="ICBM" content="23.1193, 91.9847" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <TopLoadingBar />
         <ReactQueryClientProvider>
        <UserProvider>
          <main className="max-w-[120rem] mx-auto">
            <Navbar />
            <div className="mt-16 lg:mt-40">
              {children}
              <Cart />
            </div>
            <FeaturesSection />
            <Footer />
          </main>
          <Toaster />
          <MobileFooterNavbar />
        </UserProvider>
       </ReactQueryClientProvider>
      </body>
    </html>
  );
}
