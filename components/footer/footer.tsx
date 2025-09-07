import Image from "next/image";
import Link from "next/link";
import { siteMeta } from "@/data";

export function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Faq", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Return Policy", href: "#" },
  ];

  const myAccount = [
    { label: "Sign In", href: "#" },
    { label: "Track Order", href: "#" },
  ];

  const payments = [
    "/logo/cod.png",
    "/logo/bkash.svg",
    "/logo/nagad.svg",
    "/logo/rocket.png",
  ];

  const socialLinks = [
    { href: "#", label: "Facebook", hover: "hover:text-blue-600" },
    { href: "#", label: "Twitter", hover: "hover:text-blue-500" },
    { href: "#", label: "Instagram", hover: "hover:text-pink-600" },
    { href: "#", label: "YouTube", hover: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-gray-200 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + description */}
          <div>
            <Image
              src="/logo.svg"
              alt={siteMeta.siteName}
              width={180}
              height={70}
              className="object-contain mb-4"
            />
            <p className="text-sm text-gray-700 leading-relaxed">
              Hellora works directly with local farmers and artisans in
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
                <span className="font-medium">Address:</span> Maitranga Bazar,
                Khagrachari, Bangladesh
              </li>
              <li>
                <span className="font-medium">Email:</span> mail@epahar.com
              </li>
              <li>
                <span className="font-medium">Phone:</span> (+88) 09613821316
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
                    className="text-gray-700 hover:text-yellow-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              My Account
            </h4>
            <ul className="space-y-1 text-sm">
              {myAccount.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-yellow-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-400 mt-10 pt-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-700 text-center lg:text-left">
            © {year} {siteMeta.siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {payments.map((p, index) => (
              <Image
                key={index}
                src={p}
                alt="Payment method"
                width={70}
                height={40}
                className="object-contain"
              />
            ))}
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className={`text-gray-600 ${s.hover} transition-colors`}
              >
                <span className="sr-only">{s.label}</span>
                <span className="w-5 h-5 inline-block bg-gray-500 rounded-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
