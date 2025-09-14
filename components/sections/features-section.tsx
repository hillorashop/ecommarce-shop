"use client";

import { siteMeta } from "@/data";
import { ShieldCheck, Headphones, Truck } from "lucide-react";
import Image from "next/image";

export function FeaturesSection() {
  const features = [
    {
      title: "Authentic Local Products",
      description:
        "Experience the true essence of Khagrachari with our carefully selected traditional goods crafted by local artisans.",
      icon: ShieldCheck,
    },
    {
      title: "Friendly Support",
      description:
        "Have questions? Our dedicated Hillora support team is always here to guide you with care and respect.",
      icon: Headphones,
    },
    {
      title: "Fast & Affordable Delivery",
      description:
        "Get Khagrachari’s finest products delivered straight to your doorstep quickly and affordably.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-4 lg:py-10 bg-gray-50">
      <div className=" px-6 text-center">
        {/* Section Heading */}
<h2 className="relative flex flex-col lg:flex-row items-center justify-center text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
  <span className="text-gray-700 mb-6">Welcome to</span>
  <Image
    src="/logo.svg"
    alt={siteMeta.siteName}
    width={200}
    height={100}
    className="object-contain w-36 drop-shadow-sm -top-0.5 absolute  lg:translate-x-28  lg:top-6 lg:-translate-y-1/2 overflow-hidden"
  />
</h2>


        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-base">
          Your trusted marketplace for <span className="font-semibold">Khagrachari traditional goods</span> and cultural products — connecting heritage with modern shopping convenience.
        </p>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl shadow-lg flex flex-col items-center bg-white border border-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-center size-12 rounded-full bg-yellow-400 text-white mb-6 shadow-md">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
