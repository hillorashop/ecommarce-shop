import { getAboutInfo } from "@/actions/business-info";
import { HeadingTitle } from "@/components/heading-title";
import { siteMeta } from "@/data";
import type { Metadata } from "next";
import { AboutClient } from "./_components/about-client";



export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getAboutInfo();

    const title = data?.metaTitle || `About Hillora | ${siteMeta.siteName}`;
    const description =
      data?.metaDescription ||
      "Hillora একটি অনলাইন প্ল্যাটফর্ম যা খাগড়াছড়ির পাহাড়ি ঐতিহ্যবাহী পণ্য, জৈব খাদ্য, ফ্যাশন এবং আধুনিক দৈনন্দিন জিনিস সরাসরি আপনার দোরগোড়ায় পৌঁছে দেয়।";
    const keywords = data?.metaKeyWords?.join(", ") || siteMeta.keyWords;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title: title,
        description: description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/about`,
        siteName: siteMeta.siteName,
        type: "website",
        images: [
          {
            url: siteMeta.openGraph.image,
            width: 1200,
            height: 630,
            alt: `${siteMeta.siteName} About Page`,
          },
        ],
        locale: "bn_BD",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [siteMeta.twitter.image],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/about`,
      },
    };
  } catch (error) {
    console.error("Failed to fetch about metadata:", error);

    return {
      title: `About Hillora | ${siteMeta.siteName}`,
      description:
        "Hillora একটি অনলাইন প্ল্যাটফর্ম যা খাগড়াছড়ির পাহাড়ি ঐতিহ্যবাহী পণ্য, জৈব খাদ্য, ফ্যাশন এবং আধুনিক দৈনন্দিন জিনিস সরাসরি আপনার দোরগোড়ায় পৌঁছে দেয়।",
      keywords: siteMeta.keyWords,
    };
  }
}

const AboutPage = async () => {

  return <AboutClient/>;
};

export default AboutPage;