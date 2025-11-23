import { getProduct} from "@/actions/product";
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
    description: plainDescription.slice(0, 400) || product.subDescription,
    openGraph: {
      title: product.name,
      description: plainDescription.slice(0, 400) || product.subDescription,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/products/${productUrl}`,
      type: "website",
      siteName: siteMeta.siteName,
      images: [
        {
          url: product.productImage || `${siteMeta.siteName}.png`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "bn_BD",
    },
  };
}

const ProductIdPage = async ({ params}: Props) => {
  const resolvedParams = await params;
  const productUrl = (resolvedParams.productUrl);

  const { data: product } = await getProduct(productUrl);
 

  if (!product) {
    return <p className="text-center py-10 sr-only">Product not found.</p>;
  }

  return (
    <div className="p-6 px-4 max-w-7xl w-full mx-auto">
      {/* ✅ Use productId for URL, not DB id */}
      <Script
        type="application/ld+json"
        id="product-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [product.productImage || `/${siteMeta.siteName}.png`],
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

      <ProductClient productUrl={productUrl}/>
    </div>
  );
};

export default ProductIdPage;
