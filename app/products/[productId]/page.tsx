import { getProducts } from "@/actions/product";
import { ProductClient } from "../_components/product-client";
import { Metadata } from "next";
import Script from "next/script";
import { siteMeta } from "@/data";

type Props = {
  params: Promise<{ productId: string }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: products } = await getProducts()
  const resolvedParams = await params
  const productId = resolvedParams.productId
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return {
      title: `Product not found | ${siteMeta.siteName}`,
      description: "The product you're looking for does not exist.",
    }
  }

  return {
    title: `${product.name}`,
    description: product.subDescription || product.description?.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.subDescription || product.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`,
      type: "website", 
      siteName: `${siteMeta.siteName}`,
      images: [
        {
          url: product.productImage || `${siteMeta.siteName}.png`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  }
}


const ProductIdPage = async({ params }: Props) => {

  const resolvedParams = await params
  const productId = resolvedParams.productId 
  
  const { data: products } = await getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p className="text-center py-10 sr-only">Product not found.</p>;
  }


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
            image: [product.productImage || `/${siteMeta.siteName}.png`],
            description: product.description,
            sku: product.id,
            brand: { "@type": "Brand", name: `${siteMeta.siteName}` },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`,
              priceCurrency: "BDT",
              price: product.price,
              availability: product.inStocks,
              discountPrice:product.discountPrice,
            },
          }),
        }}
      />

    <ProductClient productId={productId}/>

    </div>
  );
};

export default ProductIdPage;
