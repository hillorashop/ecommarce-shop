import { HeadingTitle } from "@/components/heading-title";
import { BlogContent } from "./_components/blog-content";
import type { Metadata } from "next";
import { siteMeta } from "@/data";

export const metadata: Metadata = {
  title: "Browse Blogs",
  description: "Hillora Blogs: পড়ুন বিভিন্ন ব্লগ পোস্ট এবং আপডেট থাকুন।",
  keywords: siteMeta.keyWords,
  openGraph: {
    title: `Browse Blogs | ${siteMeta.siteName}`,
    description: "বিভিন্ন ব্লগ এক্সপ্লোর করুন এবং আপনার ইন্টারেস্টিং বিষয়গুলো সম্পর্কে জানুন।",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs`,
    siteName: siteMeta.siteName,
    images: [
      {
        url: siteMeta.openGraph.image,
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName} Browse Blogs`,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse Blogs - ${siteMeta.siteName}`,
    description: "Hillora-তে বিভিন্ন ব্লগ এক্সপ্লোর করুন এবং আপনার পছন্দের বিষয় সম্পর্কে পড়ুন।",
    images: [siteMeta.twitter.image],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs`
  }
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page || "1");

  return (
    <div className="min-h-screen py-10">
      <div className="px-4 w-full space-y-8">
        <HeadingTitle title="Browse Blogs" />
        <BlogContent initialPage={currentPage} />
      </div>
    </div>
  );
}