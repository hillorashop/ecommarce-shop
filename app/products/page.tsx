import { Metadata } from "next";
import { ProductState } from "./_components/product-state";
import { siteMeta } from "@/data";

interface Props {
  searchParams: Promise<{productName:string, categoryId:string}>
}


// ✅ Dynamic metadata
export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { productName = "", categoryId = "" } = await searchParams;

  const title = productName
    ? `${productName}`
    : "Products";

  const description = productName
    ? `${productName}-এর বিস্তারিত তথ্য এবং বিকল্পসমূহ আমাদের স্টোরে দেখুন।`
    : "বিভিন্ন ক্যাটাগরির প্রোডাক্টস এক্সপ্লোর করুন এবং আপনার প্রয়োজনীয় পণ্য সহজেই খুঁজে নিন।";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products?productName=${productName}&categoryId=${categoryId}`,
      siteName: siteMeta.siteName,
      images: [
        {
          url: siteMeta.openGraph.image,
          width: 1200,
          height: 630,
          alt: productName || siteMeta.siteName,
        },
      ],
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: siteMeta.twitter.image,
    },
  };
}

const ProductsPage = async({searchParams}:Props) => {
  const { productName = "", categoryId = "" } = await searchParams;
  return (
    <div className="flex gap-x-2 w-full px-1">
      <ProductState productName={productName || ""} categoryId={categoryId || ""}/>
    </div>
  );
};

export default ProductsPage;
