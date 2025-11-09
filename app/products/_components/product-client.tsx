"use client";

import { useCart } from "@/hooks/use-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareMore, Search, Star } from "lucide-react";
import RelatedProducts from "../_components/relatedProducts";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ONE_DAY, siteMeta } from "@/data";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { dbProductwihtoutAll, getProduct, ProductResponse } from "@/actions/product";
import { pushToDataLayer } from "@/lib/gtm";


interface Props {
  productUrl: string;
}

export const ProductClient = ({ productUrl }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { cartItems, addItem } = useCart();
  const { data: products, isLoading: productLoading } = useProducts({ page: 1 });
  const router = useRouter();

  const { data: product, isLoading } = useCustomQuery<ProductResponse>(
    ["product", productUrl],
    () => getProduct(productUrl),
    {
      staleTime: ONE_DAY,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );


  useEffect(() => {
  if (!product) return;

  const hasDiscount =
    product.data.discountPrice !== undefined &&
    product.data.discountPrice !== null &&
    product.data.discountPrice > 0 &&
    product.data.discountPrice < product.data.price;

  const displayPrice = hasDiscount ? product.data.discountPrice : product.data.price;
  const discountAmount = hasDiscount ? product.data.price - product.data.discountPrice! : 0;

  pushToDataLayer("view_item", {
    currency: "BDT",
    value: displayPrice,
    items: [
      {
        item_id: product.data.productId,
        item_name: product.data.name,
        price: displayPrice,
        discount: discountAmount,
        item_brand: siteMeta.siteName,
        item_category: product.data.category?.name || "Uncategorized",
        quantity: 1,
      },
    ],
  });
}, [product]);

  const handleAddToCart = (product:dbProductwihtoutAll ) => {
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const price = hasDiscount ? product.discountPrice : product.price;
  const discountAmount = hasDiscount ? product.price - product.discountPrice! : 0;

  // Fire add_to_cart event
  pushToDataLayer("add_to_cart", {
    currency: "BDT",
    value: price,
    items: [
      {
        item_id: product.productId,
        item_name: product.name,
        affiliation: siteMeta.siteName,
        discount: discountAmount,
        item_brand: siteMeta.siteName,
        price,
      },
    ],
  });

  // Add to cart
  addItem(product);
};



const handleBuyNow = (product:dbProductwihtoutAll) => {
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const price = hasDiscount ? product.discountPrice : product.price;
  const discountAmount = hasDiscount ? product.price - product.discountPrice! : 0;

  // Fire begin_checkout event
  pushToDataLayer("begin_checkout", {
    currency: "BDT",
    value: price,
    items: [
      {
        item_id: product.productId,
        item_name: product.name,
        affiliation: siteMeta.siteName,
        discount: discountAmount,
        item_brand: siteMeta.siteName,
        price,
      },
    ],
  });

  // Redirect to checkout page with productId
  router.push(`/checkout?productId=${product.id}`);
};

  if (isLoading || productLoading) {
    return (
      <div className="p-6 px-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Skeletons */}
        <Skeleton className="h-6 w-40 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-xl" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-52" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center py-10">Product not found.</p>;

  const productImages = product ? [product.data.productImage] : [`${siteMeta.siteName}`];
  const relatedProducts = products?.data?.filter((p) => p.productId !== product.data.productId).slice(0, 5);
  const isInCart = cartItems.some((item) => item.id === product.data.id);

  // ✅ Discount handling
  const hasDiscount =
    product.data.discountPrice !== undefined &&
    product.data.discountPrice !== null &&
    product.data.discountPrice > 0 &&
    product.data.discountPrice < product.data.price;

  const displayPrice = hasDiscount ? product.data.discountPrice : product.data.price;
  const savingsAmount = hasDiscount ? product.data.price - product.data.discountPrice! : 0;
  const discountPercentage = hasDiscount
    ? Math.round((savingsAmount / product.data.price) * 100)
    : null;



  return (
    <>
      <div className="mb-6">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          Product ID: {product.data.productId}
        </Badge>
      </div>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative rounded-2xl p-4 shadow-sm">
            <Image
              src={productImages[selectedImage]}
              alt={product.data.name}
              width={500}
              height={500}
              className="w-full h-auto rounded-xl object-cover"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-sm rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-xl p-1 transition ${
                  selectedImage === index
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <Image
                  src={image}
                  alt={`${siteMeta.siteName}`}
                  width={70}
                  height={70}
                  className="rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.data.name}</h1>
          <p className="flex gap-x-1 flex-wrap font-semibold">
            {product.data.packageQuantity} <span>{product.data.packageQuantityType}</span>
          </p>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold">BDT {displayPrice?.toLocaleString()}</span>
            {hasDiscount && (
              <span className="line-through text-muted-foreground">
                BDT {product.data.price.toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-green-600 font-medium">
              You save BDT {savingsAmount.toLocaleString()} ({discountPercentage}%)
            </span>
          )}

          <p className="text-gray-600 leading-relaxed">{product.data.subDescription}</p>

          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Category</h3>
            <Badge className="bg-green-600">{product.data.category?.name}</Badge>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
<Button
  onClick={() => handleAddToCart(product.data)}
  disabled={product.data.inStocks <= 0 || isInCart}
>
  {isInCart ? "Already in Cart" : "Add to Cart"}
</Button>

<Button
  variant="secondary"
  disabled={product.data.inStocks <= 0}
  onClick={() => handleBuyNow(product.data)}
>
  Buy Now
</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md gap-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
          <TabsTrigger value="comments">Comments (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="border-primary">
            <CardContent className="p-6">
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.data.description || "" }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
                <Star className="size-8 fill-primary stroke-primary" />
              </div>
              <p className="text-muted-foreground">No reviews yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
                <MessageSquareMore className="size-8 stroke-primary" />
              </div>
              <p className="text-muted-foreground">No comments yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <RelatedProducts products={relatedProducts || []} />
      </div>
    </>
  );
};
