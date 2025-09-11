import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQITEMS, siteMeta} from "@/data";
import { MailOpen } from "lucide-react";
import Script from "next/script";
import { HeadingTitle } from "@/components/heading-title";
import Link from "next/link";

export const metadata: Metadata = {
  title: `FAQ`,
  description:
    "Hillora FAQ: আমাদের প্রায়শই জিজ্ঞাসিত প্রশ্ন এবং উত্তর। অর্ডার, পেমেন্ট, ডেলিভারি, প্রোডাক্ট এবং অন্যান্য সেবা সম্পর্কিত তথ্য।",
  keywords:siteMeta.keyWords,
  openGraph: {
    title: `FAQ | ${siteMeta.siteName} - পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    description:
      "Hillora FAQ পেজে খুঁজুন অর্ডার, পেমেন্ট, ডেলিভারি ও প্রোডাক্ট সম্পর্কিত গুরুত্বপূর্ণ তথ্য।",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/faq`,
    siteName: siteMeta.siteName,
    type: "website",
    images: [
      {
        url: siteMeta.openGraph.image, 
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName} FAQ`,
      },
    ],
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ - ${siteMeta.siteName}`,
    description:
      "Hillora FAQ পেজে আপনার প্রায়শই জিজ্ঞাসিত প্রশ্নের উত্তর খুঁজে পাবেন। অর্ডার, পেমেন্ট, ডেলিভারি ও প্রোডাক্ট সম্পর্কিত তথ্য।",
    images: [siteMeta.twitter.image],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/faq`,
  },
};

const FaqPage = () => {

    const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };


  return (
    <main className="p-4 lg:px-8 flex flex-col items-center gap-y-6 max-w-7xl mx-auto">
      <HeadingTitle title="FAQ"/>

      <Accordion
        type="multiple"
        defaultValue={FAQITEMS.map((_, index) => `item-${index}`)}
        className="w-full max-w-5xl space-y-6"
      >
        {FAQITEMS.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="bg-primary px-4 py-3 text-white lg:text-lg rounded-lg shadow-md">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-gray-700 lg:text-base">
              <p>{item.answer}</p>
              {item.mail && (
                <p className="mt-2 flex gap-x-2 flex-wrap items-center">
                  <MailOpen className="w-4 h-4" />
                  <a
                    href={`mailto:${item.mail}`}
                    className="text-blue-600 underline"
                  >
                    {item.mail}
                  </a>
                </p>
              )}
              {item.link && (
                <Link href={item.link} className="underline text-blue-600">{item.linkName}</Link>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

     <Script
        type="application/ld+json"
        id="faq-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

    </main>

    
  );

  
};

export default FaqPage;
