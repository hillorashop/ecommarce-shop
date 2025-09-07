import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQITEMS, siteMeta, siteMetaFaq } from "@/data";
import { MailOpen } from "lucide-react";
import Script from "next/script";
import { HeadingTitle } from "@/components/heading-title";

export const metadata: Metadata = {
  title: `FAQ | ${siteMeta.siteName}`,
  description:
    "",
  openGraph: {
    title: `FAQ | ${siteMeta.siteName}`,
    description:siteMetaFaq.desc,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/faq`,
    siteName: `${siteMeta.siteName}`,
    type: "website",
    images: [
      {
        url: `${siteMetaFaq.image}`, 
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName} FAQ`,
      },
    ],
    locale: "bn_BD",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/faq`,
    languages: {
      en: "https://yourdomain.com/en/faq",
      bn: "https://yourdomain.com/bn/faq",
    },
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
        className="w-full max-w-2xl space-y-6"
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
