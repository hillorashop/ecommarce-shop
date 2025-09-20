

import { HeadingTitle } from '@/components/heading-title';
import { Card, CardContent } from '@/components/ui/card';
import { siteMeta } from '@/data';
import { Metadata } from 'next';
import React from 'react';


export const metadata: Metadata = {
  title: `Return Policy`,
  description:
    "Hillora Return Policy: আমাদের পণ্য ফেরত, এক্সচেঞ্জ, ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ পণ্যের জন্য নির্দেশনা এবং রিফান্ড নীতি।",
  keywords:siteMeta.keyWords,
  openGraph: {
    title: `Return Policy | ${siteMeta.siteName} - পাহাড়ি ঐতিহ্যের ই-কমার্স`,
    description:
      "Hillora রিটার্ন পলিসি পেজে পণ্য ফেরত, এক্সচেঞ্জ এবং রিফান্ড সম্পর্কিত গুরুত্বপূর্ণ তথ্য খুঁজে পাবেন।",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/return-policy`,
    siteName: siteMeta.siteName,
    type: "website",
    images: [
      {
        url: siteMeta.openGraph.image,
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName} Return Policy`,
      },
    ],
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: `Return Policy - ${siteMeta.siteName}`,
    description:
      "Hillora Return Policy পেজে পণ্য ফেরত, এক্সচেঞ্জ এবং রিফান্ড সম্পর্কিত বিস্তারিত তথ্য।",
    images: [siteMeta.twitter.image],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/return-policy`,
  },
};

const ReturnPolicyPage = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-4">
     <HeadingTitle title='Return Policy'/>

<Card>
    <CardContent>
      <section className="mb-6">
        <p className="leading-relaxed">
          <strong>{siteMeta.siteName}-এ শপিং করার জন্য ধন্যবাদ।</strong> আমরা আপনাকে একটি সন্তোষজনক অনলাইন শপিং অভিজ্ঞতা দিতে সর্বোচ্চ চেষ্টা করি। 
          তবে, আপনি যদি আপনার ক্রয়কৃত পণ্য নিয়ে পুরোপুরি সন্তুষ্ট না হন, আমরা সাহায্য করতে প্রস্তুত।
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">রিটার্ন (Returns)</h2>
        <p className="text-lg leading-relaxed">
          দুঃখের সঙ্গে জানাচ্ছি যে, বর্তমানে আমরা কোনো পণ্য রিটার্ন বা এক্সচেঞ্জ গ্রহণ করি না। 
          এর ফলে কোনো অসুবিধার জন্য আমরা আন্তরিকভাবে ক্ষমা প্রার্থী।
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ পণ্য (Damaged or Defective Products)</h2>
        <p className="leading-relaxed">
          যদি আপনি কোনো ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ পণ্য পান, অনুগ্রহ করে সেটি <strong>প্রাপ্তির ২৪ ঘণ্টার মধ্যে</strong> আমাদের জানান। 
          আমরা একটি উপযুক্ত সমাধান খুঁজে বের করার জন্য কাজ করব, যা হতে পারে:
        </p>
        <ul className="list-disc list-inside mt-2 ml-4 text-lg leading-relaxed">
          <li>নতুন পণ্য প্রদান</li>
          <li>স্টোর ক্রেডিট দেওয়া</li>
        </ul>
        <p className="leading-relaxed mt-2">
          সমাধান প্রক্রিয়াটি দ্রুত করার জন্য দয়া করে পণ্যের বিস্তারিত তথ্য দিন এবং সম্ভব হলে ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ পণ্যের ছবি সংযুক্ত করুন।
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">রিফান্ড (Refunds)</h2>
        <p className="leading-relaxed">
          বর্তমানে আমরা কোনো পণ্যের জন্য রিফান্ড প্রদান করি না। সকল বিক্রয় চূড়ান্ত।
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">এক্সচেঞ্জ (Exchanges)</h2>
        <p className="leading-relaxed">
          বর্তমানে আমরা কোনো পণ্যের এক্সচেঞ্জ সুবিধা প্রদান করি না। 
          আপনি যদি ভিন্ন কোনো পণ্য কিনতে চান, অনুগ্রহ করে আমাদের ওয়েবসাইট থেকে নতুন অর্ডার করুন।
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">যোগাযোগ (Contact Us)</h2>
        <p className="leading-relaxed">
          যদি আমাদের রিটার্ন ও এক্সচেঞ্জ পলিসি সম্পর্কিত কোনো প্রশ্ন বা উদ্বেগ থাকে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন: 
          <strong> mail@hillora.com</strong>। আমরা আপনাকে সহায়তা করতে খুশি হব।
        </p>
      </section>

      <section>
        <p className="leading-relaxed italic">
          <strong>দয়া করে মনে রাখুন:</strong> এই নীতি পূর্ব-নোটিশ ছাড়াই পরিবর্তিত হতে পারে। নতুন আপডেটের জন্য নিয়মিত আমাদের রিটার্ন ও এক্সচেঞ্জ পলিসি পর্যালোচনা করা উচিত। আপনার বোঝাপড়ার জন্য ধন্যবাদ।
        </p>
      </section>

</CardContent>
</Card>
    </main>
  );
};

export default ReturnPolicyPage;
