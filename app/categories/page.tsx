import { HeadingTitle } from "@/components/heading-title";
import { CategoryContent } from "./_components/category-content";
import type { Metadata } from "next";
import { siteMeta } from "@/data";

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Hillora Categories: বিভিন্ন প্রোডাক্ট ক্যাটাগরি ব্রাউজ করুন।",
  keywords: siteMeta.keyWords,
  openGraph: {
    title: `Browse Categories | ${siteMeta.siteName}`,
    description: "বিভিন্ন ক্যাটাগরি এক্সপ্লোর করুন এবং যা আপনার ইন্টারেস্টিং খুঁজে বের করুন।",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
    siteName: siteMeta.siteName,
    images: [
      {
        url: siteMeta.openGraph.image,
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName}Browse Categories`,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse Categories - ${siteMeta.siteName}`,
    description: "Hillora-তে বিভিন্ন ক্যাটাগরি এক্সপ্লোর করুন এবং আপনার পছন্দের প্রোডাক্ট খুঁজে নিন।.",
    images: [siteMeta.twitter.image],
  },
}

export default async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page || "1");

  return (
    <div className="min-h-screen py-10">
      <div className="px-4 w-full space-y-8">
        <HeadingTitle title="Browse Categories" />
        <CategoryContent initialPage={currentPage} />
      </div>
    </div>
  );
}
