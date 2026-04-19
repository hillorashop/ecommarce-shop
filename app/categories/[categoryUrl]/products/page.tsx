
import { Metadata } from "next";
import Script from "next/script";
import { siteMeta } from "@/data";
import { getCategoryProducts } from "@/actions/category";
import { CategoryState } from "../../_components/category-state";


type Props = {
  params: Promise<{ categoryUrl: string }>;

};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryUrl } = await params;

  const res = await getCategoryProducts(categoryUrl);

  if (!res?.category) {
    return {
      title: `Category not found | ${siteMeta.siteName}`,
      description: "The category you're looking for does not exist.",
    };
  }

  const category = res.category;

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description || "",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/categories/${categoryUrl}/products`,
      type: "website",
      siteName: siteMeta.siteName,
      images: [
        {
          url: category.categoryImage || `${siteMeta.siteName}.png`,
          width: 800,
          height: 600,
          alt: category.name,
        },
      ],
      locale: "bn_BD",
    },
  };
}

const CategoryUrlPage = async ({ params }: Props) => {
  const { categoryUrl } = await params;

  const res = await getCategoryProducts(categoryUrl);

  if (!res?.category) {
    return <p className="text-center py-10 sr-only">Category not found.</p>;
  }

  const category = res.category;

  return (
    <div className="flex gap-x-2 w-full px-1">
      
      <Script
        type="application/ld+json"
        id="category-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: category.name,
            image: [category.categoryImage || `/${siteMeta.siteName}.png`],
            description: category.description,
            sku: category.id,
            brand: { "@type": "Brand", name: siteMeta.siteName },
          }),
        }}
      />

   <CategoryState categoryUrl={category.categoryUrl!} categoryName={category.name}/>
    </div>
  );
};

export default CategoryUrlPage;
