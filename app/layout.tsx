import type { Metadata } from "next";
import {  Open_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/headers/navbar";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";
import { Cart } from "@/components/cart";
import { siteMeta } from "@/data";
import { ReactQueryClientProvider } from "@/provider/queryClient-provider";
import TopLoadingBar from "@/components/top-loading-bar";
import Script from "next/script";
import { StyleMobileFooterNavbar } from "@/components/footer/style-mobile-footer-navbar";
import { TrackingProvider } from "@/provider/tracking-provider";
import { FloatingContactIcons } from "@/components/footer/floating-contact-button";




const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

type SiteLogos = {
  primaryLogo: string;
  secondaryLogo?: string;
  favicon: string;
};

const getSiteLogos = async (): Promise<SiteLogos | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/logos`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Failed to load site logos:", error);
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const logos = await getSiteLogos();
  const favicon = logos?.favicon || "/fevicon.png";

  return {
    title: {
      default: `${siteMeta.siteName} | পাহাড়ি ঐতিহ্যের ই-কমার্স`,
      template: `%s | ${siteMeta.siteName} - পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    },
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon }],
    },
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logos = await getSiteLogos();

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="WjC9PZ6_fnkB0mYfs3I9mr3CVQgeauW-japi-LW31cM"
        />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Khagrachari" />
        <meta name="geo.position" content="23.1193;91.9847" />
        <meta name="ICBM" content="23.1193, 91.9847" />

     
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteMeta.siteName,
              url: process.env.NEXT_PUBLIC_BASE_URL,
              logo: logos?.primaryLogo || `${process.env.NEXT_PUBLIC_BASE_URL}/fevicon.png`,
            }),
          }}
        />


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
        className={`${openSans.className}  antialiased`}
      >
       
        <TopLoadingBar />
        <ReactQueryClientProvider>
        <TrackingProvider>
          <UserProvider>
            <main className="max-w-7xl mx-auto">
              <Navbar />
              <div className="mt-16 lg:mt-34">
                {children}
                <Cart />
              </div>
              <Footer />
            </main>
            <Toaster />
            <FloatingContactIcons/>
            <StyleMobileFooterNavbar/>
            {/* <MobileFooterNavbar /> */}
          </UserProvider>
          </TrackingProvider>
        </ReactQueryClientProvider>
     
      </body>
    </html>
  );
}