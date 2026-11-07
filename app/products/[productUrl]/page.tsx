import { getProduct } from "@/actions/product";
import { getProductReviews } from "@/actions/review";
import { ProductClient } from "../_components/product-client";
import { Metadata } from "next";
import Script from "next/script";
import { siteMeta } from "@/data";

type Props = {
  params: Promise<{ productUrl: string }>;

};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export async function generateMetadata({ params}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const productUrl = resolvedParams.productUrl;
  const { data: product } = await getProduct(productUrl);
  if (!product) {
    return {
      title: `Product not found | ${siteMeta.siteName}`,
      description: "The product you're looking for does not exist.",
    };
  }

    const plainDescription = stripHtml(product.description || product.subDescription || '');

  return {
    title: product.name,
    description: plainDescription.slice(0, 400) || product.subDescription || undefined,
    openGraph: {
      title: product.name,
      description: plainDescription.slice(0, 400) || product.subDescription || undefined,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/products/${productUrl}`,
      type: "website",
      siteName: siteMeta.siteName,
      images: product.productImage
        ? [
            {
              url: product.productImage,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ]
        : [],
      locale: "bn_BD",
    },
  };
}

const ProductUrlPage = async ({ params}: Props) => {
  const resolvedParams = await params;
  const productUrl = (resolvedParams.productUrl);

  const productRes = await getProduct(productUrl);
  const product = productRes?.data;

  if (!product) {
    return <p className="text-center py-10 sr-only">Product not found.</p>;
  }

  // Pre-fetch reviews on server for SEO & hydration match
  const reviewsRes = product?.id
    ? await getProductReviews(product.id, 1, 6).catch(() => null)
    : null;

  return (
    <div className="p-6 px-4 max-w-7xl w-full mx-auto">
   
      <Script
        type="application/ld+json"
        id="product-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.productImage ? [product.productImage] : [],
            description: product.description,
            sku: product.id,
            brand: { "@type": "Brand", name: siteMeta.siteName },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.productId}`,
              priceCurrency: "BDT",
              price: product.price,
              availability: product.inStocks > 0 ? "InStock" : "OutOfStock",
              discountPrice: product.discountPrice,
            },
          }),
        }}
      />

      <ProductClient
        productUrl={productUrl}
        initialData={productRes}
        initialReviews={reviewsRes || undefined}
      />
    </div>
  );
};

export default ProductUrlPage;
