"use client";

import dynamic from "next/dynamic";

const Cart = dynamic(
  () => import("@/components/cart").then((module) => module.Cart),
  { ssr: false }
);
const StyleMobileFooterNavbar = dynamic(
  () =>
    import("@/components/footer/style-mobile-footer-navbar").then(
      (module) => module.StyleMobileFooterNavbar
    ),
  { ssr: false }
);
const FloatingContactIcons = dynamic(
  () =>
    import("@/components/footer/floating-contact-button").then(
      (module) => module.FloatingContactIcons
    ),
  { ssr: false }
);

export function CartWidget() {
  return <Cart />;
}

export function FooterWidgets() {
  return (
    <>
      <FloatingContactIcons />
      <StyleMobileFooterNavbar />
    </>
  );
}
