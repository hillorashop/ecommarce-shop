import { HeadingTitle } from "@/components/heading-title";
import { siteMeta, siteMetaAbout } from "@/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${siteMeta.siteName}`,
  description:
    "",
  openGraph: {
    title: `About Us | ${siteMeta.siteName} - Online Tribal E-commarce of Bangladesh`,
    description:siteMetaAbout.desc,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    siteName: siteMeta.siteName,
    type: "website",
    images: [
      {
        url: siteMetaAbout.image, 
        width: 1200,
        height: 630,
        alt: `${siteMeta.siteName}`,
      },
    ],
    locale: "bn_BD",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    languages: {
      en: "https://yourdomain.com/en/about",
      bn: "https://yourdomain.com/bn/about",
    },
  },
};

const AboutPage = () => {
  return (
    <main className="p-4 flex flex-col items-center gap-y-6 max-w-7xl mx-auto">
      <HeadingTitle title="About Us"/>

      <section className="lg:px-10 p-4 text-gray-700 leading-relaxed text-justify space-y-6">
        <p>
          Welcome to <strong>Hillora</strong>, a unique online shopping platform
          that offers a vast array of high-quality products to meet your needs.
          Whether you're seeking nutritious organic food, fashionable clothing,
          or modern daily essentials, ePahar has got you covered. Our dedicated
          team of conscious farmers and skilled professionals work tirelessly to
          bring you the best products, ensuring quality and customer satisfaction.
        </p>

        <p>
          Our extensive selection of organic food promotes a healthy lifestyle,
          from fresh produce to pantry staples. We also offer fashionable
          clothing that combines style with comfort, catering to diverse tastes
          and preferences. Stay ahead of trends with ePahar's curated collections.
        </p>

        <p>
          Hillora is committed to providing a seamless, user-friendly online
          shopping experience. Leveraging cutting-edge technology, we ensure
          convenience and efficiency in every order, delivering directly to your
          doorstep.
        </p>

        <p className="font-semibold text-lg">
          Join us on this exciting journey and discover the difference with
          <strong> Hillora</strong>, your powerful online shopping platform in
          Bangladesh.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
