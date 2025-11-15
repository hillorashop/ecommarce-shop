import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/data";

export function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Faq", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Return Policy", href: "/return-policy" },
  ];



  const payments = [
    "/logo/cod.png",
    "/logo/bkash.svg",
    "/logo/nagad.svg",
    "/logo/rocket.png",
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/hillorashop", Icon: "/icons/facebook.svg", bg:"#1d4ed8",},
    { href: "https://wa.me/8801516194716?text=হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।", Icon: "/icons/whatsapp.svg", bg:"#16a34a",},
    {
    href: "https://m.me/hillorashop?ref=order_now",
    Icon: "/icons/messenger.svg.webp",
    bg: "#be123c",
  },
   
  ];

  return (
    <footer className="bg-gray-200 border-t border-gray-100">
      <div className="py-4 lg:py-1 px-6">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20">
          {/* Logo + description */}
          <div className="relative mt-8">
            <Image
              src="/logo.svg"
              alt={siteMeta.siteName}
              width={180}
              height={70}
              className="object-contain  absolute -translate-20 left-8"
            />
            <p className="text-sm text-gray-700 leading-relaxed">
              Hillora works directly with local farmers and artisans in
              Khagrachari, bringing you authentic traditional goods while
              supporting the community.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Contact Info
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                <span className="font-medium">Address: </span>Shop No:06 Sohag Complex, 2nd Floor Chengi Square, khagachari Sadar Chittagong.
              </li>
              <li>
                <span className="font-medium">Email:</span> mail@hillora.com
              </li>
              <li>
                <span className="font-medium">Mobile:</span> +880 1519558558
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-yellow-600 transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

    

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-400 my-10 pt-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-x-6 ">
          <p className="text-xs lg:text-sm text-muted-foreground text-center lg:text-left">
            © {year} {siteMeta.siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-4">
            {payments.map((p, index) => (
              <Image
                key={index}
                src={p}
                alt="Payment method"
                width={70}
                height={40}
                className="object-contain w-12 md:w-18"
              />
            ))}
          </div>

          <div className="flex space-x-4 lg:space-x-8">
            {socialLinks.map((s, i) => (
                  <a
                     key={i}
                     href={s.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="relative flex items-center justify-center w-8 h-8 z-50"
                   >
                     <Image
                       src={s.Icon}
                       alt={siteMeta.siteName}
                       width={24}
                       height={24}
                       className="rounded-full overflow-hidden z-10"
                     />
                     <div
                       className="absolute inset-1 border-2 rounded-full animate-ping duration-200"
                       style={{ borderColor: s.bg }}
                     />
                         <div
                       className="absolute -inset-0.5 border-2 rounded-full animate-ping duration-100"
                       style={{ borderColor: s.bg }}
                     />
                   </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
