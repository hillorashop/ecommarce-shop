import { HeadingTitle } from "@/components/heading-title";
import { siteMeta, } from "@/data";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `About Hillora`,
  description:
    "Hillora একটি অনলাইন প্ল্যাটফর্ম যা খাগড়াছড়ির পাহাড়ি ঐতিহ্যবাহী পণ্য, জৈব খাদ্য, ফ্যাশন এবং আধুনিক দৈনন্দিন জিনিস সরাসরি আপনার দোরগোড়ায় পৌঁছে দেয়।",
  keywords:siteMeta.keyWords,
  openGraph: {
    title: `About Hillora | ${siteMeta.siteName} -পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    description:
      "Hillora হল একটি অনলাইন শপিং প্ল্যাটফর্ম যেখানে খাগড়াছড়ির পাহাড়ি ঐতিহ্যের পণ্য, জৈব খাদ্য ও ফ্যাশন সামগ্রী পাওয়া যায়।",
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
    title: `About Hillora - ${siteMeta.siteName}`,
    description:
      "হিলোরা খাগড়াছড়ির পাহাড়ি ঐতিহ্যের পণ্য ও জৈব খাদ্যের বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম।",
    images: [siteMeta.twitter.image],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/about`,
  },
};



const AboutPage = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-4">
      <HeadingTitle title="About Hillora" />

      <Card>
        <CardContent className="space-y-6 leading-relaxed text-gray-800">
          <section className="mb-6">
            <p>
              <strong className="mr-1">হিলোরা-তে স্বাগতম!</strong>  
              খাগড়াছড়ির হৃদয় থেকে উঠে আসা পাহাড়ি ঐতিহ্য আর প্রকৃতির দানকে সবার
              ঘরে পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ। এখানে আপনি পাবেন অনন্য সব
              পাহাড়ি ঐতিহ্যবাহী পণ্য, স্বাস্থ্যসম্মত জৈব খাদ্য  এবং আধুনিক দৈনন্দিন
              প্রয়োজনীয় জিনিস।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">আমাদের জৈব ও পাহাড়ি খাদ্য</h2>
            <p>
              আমাদের নিবেদিতপ্রাণ কৃষক এবং পাহাড়ি জনগোষ্ঠী ভালোবাসা ও যত্ন দিয়ে
              তৈরি করেন জৈব ও পুষ্টিকর খাবার। পাহাড়ি আদা, হলুদ, মরিচ, চাল, ডাল,
              মধু সহ নানা ধরনের প্রাকৃতিক পণ্য আপনার জীবনে নিয়ে আসবে সুস্থতা ও
              প্রাণশক্তি।
            </p>
          </section>



          <section>
            <h2 className="text-lg font-semibold mb-2">আমাদের প্রতিশ্রুতি</h2>
            <p>
              আমরা শুধু একটি ই-কমার্স নয়, বরং একটি সেতু—যা পাহাড়ি ঐতিহ্য, প্রকৃতির
              বিশুদ্ধতা আর আধুনিক জীবনধারাকে একসাথে যুক্ত করছে।
            </p>
          </section>

          <section className="text-center">
            <p className="font-medium">
              হিলোরার এই যাত্রায় আমাদের সঙ্গে থাকুন।  
              অনুভব করুন খাগড়াছড়ির পাহাড়ি প্রকৃতির অনন্য স্বাদ ও সৌন্দর্য—
              <span className="font-bold">
                {" "}
                Hillora, আপনার ভরসার অনলাইন শপিং প্ল্যাটফর্ম।{" "}
              </span>
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
};

export default AboutPage;
