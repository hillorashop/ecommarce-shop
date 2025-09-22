import { HeadingTitle } from "@/components/heading-title";
import { Card, CardContent } from "@/components/ui/card";
import { siteMeta } from "@/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy`,
  description:
    "Hillora Privacy Policy: আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি তা এখানে বর্ণনা করা হয়েছে। নিরাপদ ও স্বচ্ছ অনলাইন শপিং নিশ্চিত করতে Hillora-এর নীতি পড়ুন।",
  keywords:siteMeta.keyWords,
  openGraph: {
    title: `Privacy Policy | ${siteMeta.siteName} - পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    description:
      "Hillora Privacy Policy: কীভাবে আমরা আপনার ব্যক্তিগত তথ্য ব্যবহার করি এবং সুরক্ষিত রাখি।",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/privacy-policy`,
    siteName: siteMeta.siteName,
    type: "website",
    images: [
      {
        url: siteMeta.openGraph.image,
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName} Privacy Policy`,
      },
    ],
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy - ${siteMeta.siteName}`,
    description:
      "Hillora Privacy Policy: নিরাপদ অনলাইন শপিং এবং ব্যক্তিগত তথ্য সুরক্ষার জন্য আমাদের নীতি।",
    images: [siteMeta.twitter.image],
  },
  alternates: {
    canonical:`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/privacy-policy`,
  },
};

 const PrivacyPolicyPage = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <HeadingTitle title="Privacy Policy" />

      <Card>
        <CardContent className="space-y-6 text-gray-800 leading-relaxed">
          
          <section>
            <p>
              <strong>Hillora ("আমরা", "আমাদের")</strong> Hillora ওয়েবসাইট (Service) পরিচালনা করে। এই পেজে বর্ণনা করা হয়েছে কীভাবে আমরা ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করি, এবং আপনার তথ্য সংক্রান্ত বিকল্পসমূহ।
            </p>
            <p>
              আমরা আপনার তথ্য ব্যবহার করি Service প্রদানের জন্য এবং এটি উন্নত করার জন্য। Service ব্যবহারের মাধ্যমে আপনি এই নীতিমালা অনুযায়ী তথ্য সংগ্রহ এবং ব্যবহারে সম্মত হন।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তথ্য সংগ্রহ এবং ব্যবহার</h2>
            <p>
              আমরা বিভিন্ন উদ্দেশ্যে বিভিন্ন ধরনের তথ্য সংগ্রহ করি, যাতে আমরা আপনাকে একটি উন্নত এবং সুবিধাজনক Service দিতে পারি।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">সংগৃহীত তথ্যের ধরন</h2>

            <p className="font-semibold">ব্যক্তিগত তথ্য (Personal Data)</p>
            <p>
             Service ব্যবহারের সময়, আমরা আপনার কিছু ব্যক্তিগত তথ্য চাওয়ার সম্ভাবনা রাখি যা আপনার সাথে যোগাযোগ বা আপনাকে সনাক্ত করতে ব্যবহার করা যেতে পারে। ব্যক্তিগত তথ্যের মধ্যে থাকতে পারে:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>ইমেইল ঠিকানা</li>
              <li>নাম (প্রথম নাম এবং শেষ নাম)</li>
              <li>ফোন নম্বর</li>
              <li>ঠিকানা, জেলা/প্রদেশ, পোস্টাল কোড, শহর</li>
            </ul>

            <p className="font-semibold mt-3">ব্যবহার সম্পর্কিত তথ্য (Usage Data)</p>
            <p>
              আমরা Service কিভাবে ব্যবহার হচ্ছে তার তথ্যও সংগ্রহ করতে পারি। এতে অন্তর্ভুক্ত থাকতে পারে আপনার ডিভাইসের IP Address, Browser Type ও Storage, Visited Page, সময় ও সময়কাল, ডিভাইস শনাক্তকরণ এবং অন্যান্য ডায়াগনস্টিক তথ্য।
            </p>
<p className="font-semibold mt-3">ডেটা ক্যাশিং এবং ট্র্যাকিং তথ্য</p>
<p>
  আমরা আমাদের  Service পারফরম্যান্স উন্নত এবং ব্যবহারকারীর অভিজ্ঞতা সহজ করতে 
  Client এবং Server Side Cache ব্যবহার করি। এর মাধ্যমে আমাদের সাইট দ্রুত লোড হয় 
  এবং পুনরায় লোডের সময় কম হয়। এই প্রক্রিয়ায় কোনো ব্যক্তিগত তথ্য সংরক্ষিত হয় না। 
  আপনি চাইলে Browser's Cache বা Local Storage ম্যানেজ করতে পারেন, তবে কিছু 
  ফাংশনালিটি সীমিত হতে পারে।
</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তথ্য ব্যবহার</h2>
            <p>
              Hillora এই তথ্য ব্যবহার করে:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Service প্রদান এবং রক্ষণাবেক্ষণ করা</li>
              <li>আপনাকে Service সংক্রান্ত পরিবর্তন সম্পর্কে জানানো</li>
              <li>ইন্টারেক্টিভ ফিচার ব্যবহারে সহায়তা করা</li>
              <li>কাস্টমার সাপোর্ট এবং সহায়তা প্রদান</li>
              <li>Service উন্নত করতে বিশ্লেষণ এবং মূল্যবান তথ্য সংগ্রহ করা</li>
              <li>Service's ব্যবহার মনিটর করা</li>
              <li>প্রযুক্তিগত সমস্যার সনাক্তকরণ এবং প্রতিরোধ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তথ্য স্থানান্তর</h2>
            <p>
              আপনার তথ্য, ব্যক্তিগত তথ্যসহ, বাংলাদেশ বা অন্যান্য দেশের কম্পিউটারে স্থানান্তরিত হতে পারে এবং সেখানে প্রক্রিয়াকৃত হতে পারে। আপনি যদি বাংলাদেশে না থাকেন এবং আমাদের তথ্য দেন, তাহলে তা বাংলাদেশে স্থানান্তরিত হবে এবং প্রক্রিয়াকৃত হবে।
            </p>
            <p>
              আমরা নিশ্চিত করি যে আপনার তথ্য নিরাপদে এবং Privacy Policy অনুযায়ী ব্যবহৃত হয়। কোনো তথ্য স্থানান্তর করতে হলে যথাযথ সুরক্ষা নিশ্চিত করা হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তথ্য প্রকাশ</h2>
            <p>
              আইনগত কারণে, Hillora আপনার ব্যক্তিগত তথ্য প্রকাশ করতে পারে, যেমন:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>আইন অনুসরণ করা</li>
              <li>Hillora-এর অধিকার, সম্পদ বা নিরাপত্তা রক্ষা করা</li>
              <li>পরিচিত ত্রুটির তদন্ত বা প্রতিরোধ করা</li>
              <li>আইনি দায় থেকে সুরক্ষা নিশ্চিত করা</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তথ্যের সুরক্ষা</h2>
            <p>
              আমরা আপনার তথ্যের সুরক্ষার জন্য সর্বোচ্চ চেষ্টা করি, তবে কোনো ইন্টারনেট বা ইলেকট্রনিক সংরক্ষণের পদ্ধতি ১০০% নিরাপদ নয়। আমরা বাণিজ্যিকভাবে গ্রহণযোগ্য সুরক্ষা ব্যবহার করি কিন্তু সম্পূর্ণ নিরাপত্তা নিশ্চিত করা যায় না।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Service প্রদানকারী</h2>
            <p>
              আমরা তৃতীয় পক্ষের প্রতিষ্ঠান বা ব্যক্তিদের ব্যবহার করতে পারি Service প্রদান বা বিশ্লেষণের জন্য। তারা শুধুমাত্র আমাদের পক্ষ থেকে কাজ করবে এবং তথ্য অন্য কোনো উদ্দেশ্যে ব্যবহার করতে পারবে না।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">তৃতীয় পক্ষের লিঙ্ক</h2>
            <p>
              আমাদের Service's তৃতীয় পক্ষের লিঙ্ক থাকতে পারে। এগুলোর Privacy Policy আমরা নিয়ন্ত্রণ করি না। অনুগ্রহ করে প্রতিটি লিঙ্কের Privacy Policy নিজে পর্যালোচনা করুন।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">শিশুদের প্রাইভেসি</h2>
            <p>
              আমাদের Service ১৩ বছরের কম বয়সীদের জন্য নয়। আমরা সচেতনভাবে এই বয়সের শিশুর তথ্য সংগ্রহ করি না। কোনো শিশু যদি তথ্য প্রদান করে, অনুগ্রহ করে আমাদের জানাতে হবে এবং আমরা তা সার্ভার থেকে মুছে ফেলব।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">নীতি পরিবর্তন</h2>
            <p>
              আমরা Privacy Policy সময়ে সময়ে পরিবর্তন করতে পারি। কোনো পরিবর্তন হলে এই পেজে নতুন নীতি প্রকাশ করা হবে। পরিবর্তন কার্যকর হলে ইমেইল বা Service's বিজ্ঞপ্তি দেওয়া হবে। নিয়মিত এই পলিসি পর্যালোচনা করার জন্য অনুরোধ রইল।
            </p>
          </section>

        </CardContent>
      </Card>
    </main>
  );
};

export default PrivacyPolicyPage;
