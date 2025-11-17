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
import Script from "next/script";

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
    default: `${siteMeta.siteName} | পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    template: `%s | ${siteMeta.siteName} - পাহাড়ি ঐতিহ্যের ই-কমার্স`,
  },
  icons: [
    { rel: "icon", url: "/meta-icon.jpg", type:"image/svg+xml", sizes: "180x180"},
    { rel: "apple-touch-icon", url: "/meta-icon.jpg", sizes: "180x180" },
  ],
  description: siteMeta.desc,
  keywords: siteMeta.keyWords,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL! || process.env.NEXT_PUBLIC_BASE_WWW_URL!),
  openGraph: {
    title: siteMeta.openGraph.title,
    description: siteMeta.openGraph.desc,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}`,
    siteName: siteMeta.siteName,
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: `${siteMeta.openGraph.image}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.twitter.title,
    description: siteMeta.twitter.description,
    creator: siteMeta.twitter.creator,
    images: siteMeta.twitter.image,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}`,
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
        {/* ✅ Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />

        {/* ✅ Bangladesh SEO specific */}
        <meta
          name="google-site-verification"
          content="WjC9PZ6_fnkB0mYfs3I9mr3CVQgeauW-japi-LW31cM"
        />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Khagrachari" />
        <meta name="geo.position" content="23.1193;91.9847" />
        <meta name="ICBM" content="23.1193, 91.9847" />

        {/* ✅ Organization Schema (so Google shows Hillora, not Vercel) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteMeta.siteName,
              url: process.env.NEXT_PUBLIC_BASE_URL,
              logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`,
            }),
          }}
        />

        {/* ✅ Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}'+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopLoadingBar />
        <ReactQueryClientProvider>
          <UserProvider>
            <main className="max-w-[120rem] mx-auto">
              <Navbar />
              <div className="mt-22 lg:mt-34">
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
