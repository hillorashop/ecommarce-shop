"use client";

import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/data";
import { useBusinessInfo } from "@/hooks/use-business-info";
import { FacebookSvg, WhatsAppSvg, MessengerSvg, BRAND_COLORS } from "@/components/social-icons";
import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { getLogos, LogoResponse } from "@/actions/business-info";


export const  Footer = () =>  {

   const { data: businessInfo} = useBusinessInfo();
const { data: logos, isLoading: logosLoading } = useCustomQuery<LogoResponse>(
    ["get-logos"],
    () => getLogos()
  );
 
  const footerLogo =
    logos?.data?.secondaryLogo || logos?.data?.primaryLogo || "/logo.svg";

  const year = new Date().getFullYear();
  const quickLinks = [
    { label: "Faq", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "About", href: "/about" },
    { label: "Blogs", href: "/blogs" },
    { label: "Become a Seller", href: "/become-seller" },
  ];


  const payments = [
    "/logo/cod.png",
    "/logo/bkash.svg",
    "/logo/nagad.svg",
    "/logo/rocket.png",
  ];

  const socialLinks = [
    {
      id: "facebook",
      href: `https://www.facebook.com/${businessInfo?.data?.messengerUsername}`,
      bg: BRAND_COLORS.facebook,
    },
    {
      id: "whatsapp",
      href: `https://wa.me/+88${businessInfo?.data?.whatsappNumber}?text=${encodeURIComponent("হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।")}`,
      bg: BRAND_COLORS.whatsapp,
    },
    {
      id: "messenger",
      href: `https://m.me/${businessInfo?.data?.messengerUsername}?ref=order_now`,
      bg: BRAND_COLORS.messenger,
    },
  ];

  const renderGlyph = (id: string) => {
    switch (id) {
      case "facebook":
        return <FacebookSvg size={32} />;
      case "whatsapp":
        return <WhatsAppSvg size={32} />;
      case "messenger":
        return <MessengerSvg size={32} />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-[#353534] text-gray-200">
      <div className="py-4 lg:py-6 px-6">
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  
          <div className="space-y-2">
              {!logosLoading && (
              <Image
                src={footerLogo}
                alt={siteMeta.siteName}
                width={180}
                height={70}
                className="object-contain mb-4"
              />
            )}
            <p className="text-sm text-gray-200 leading-relaxed">
              Hillora works directly with local farmers and artisans in
              Khagrachari, bringing you authentic traditional goods while
              supporting the community.
            </p>

             
  
      <div className="space-y-2 text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">e-TIN:</span>
          <span className="">{businessInfo?.data?.eTinNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-200" />
          <span className="font-medium">Trade License No:</span>
          <span className="">{businessInfo?.data?.tradeLicenseNumber}</span>
        </div>
      </div>


      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
          Join Our Community
        </h3>

          <div className="flex space-x-4  mt-2">
            {socialLinks.map(({ id, href, bg }) => (
                  <a
                     key={id}
                     href={href}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label={id}
                     className="relative flex items-center justify-center w-8 h-8 z-50"
                   >
                     <span className="relative z-10 flex items-center justify-center w-full h-full rounded-full overflow-hidden">
                       {renderGlyph(id)}
                     </span>
                   </a>
            ))}
          </div>
      </div>

  
          </div>

       
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-3">
              Contact Info
            </h4>
    <ul className="space-y-3 text-sm text-gray-200">
  <li className="flex items-start gap-2">
    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
    <span>
      <span className="font-medium">Address:</span>{" "}
      {businessInfo?.data?.shopAddress}
    </span>
  </li>

  <li className="flex items-center gap-2">
    <Mail className="h-4 w-4 shrink-0 " />
    <span>
      <span className="font-medium">Email:</span>{" "}
      {businessInfo?.data?.infoEmail || "mail@hillora.com"}
    </span>
  </li>

  <li className="flex items-center gap-2">
    <Phone className="h-4 w-4 shrink-0 " />
    <span>
      <span className="font-medium">Mobile:</span>{" "}
      {businessInfo?.data?.whatsappNumber || "+880 1519-558558"}
    </span>
  </li>
</ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-primary transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

  
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-x-6 ">
          <p className="text-xs lg:text-sm  font-semibold text-center lg:text-left">
            © {year} {siteMeta.siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-4">
            {payments.map((p, index) => (
              <Image
                key={index}
                src={p}
                alt="Payment method"
                width={70}
                height={70}
                className="object-contain w-12 md:w-18"
              />
            ))}
          </div>

          <div className="flex space-x-4 lg:space-x-8">
          </div>
        </div>
      </div>
    </footer>
  );
}