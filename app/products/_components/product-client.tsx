'use client';

import { useCart } from "@/hooks/use-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  MessageSquareMore, Search, Star,} from "lucide-react";
import RelatedProducts from "../_components/relatedProducts";
import { useProducts } from "@/hooks/use-products";
import { dbProduct } from "@/types/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { siteMeta } from "@/data";

interface Props {
  productId:string;
}

export const ProductClient = ({productId}:Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: products, isLoading } = useProducts();
  const { cartItems, addItem } = useCart();
  const { data: categories, isLoading: categoryLoading } = useCategories();
  const router = useRouter();

  const product: dbProduct | undefined = products?.data?.find(
    (p) =>p.productId === productId
  );


    if (isLoading || categoryLoading) {
    return (
       <div className="p-6 px-8 max-w-7xl w-full mx-auto space-y-8">
      {/* Product ID Skeleton */}
      <Skeleton className="h-6 w-40 rounded" />

      {/* Product Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <Skeleton className="w-full h-[400px] rounded-xl" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Details */}
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

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-md" />
      </div>

      {/* Related Products Skeleton */}
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

  const productImages = product.productImage
    ? [product.productImage]
    : [`${siteMeta.siteName}`];

  const productCategory = categories?.data.find(
    (c) => c.id === product.categoryId
  );

  const relatedProducts = products?.data?.filter((p) => p.productId !== productId).slice(0, 5)


  const isInCart = cartItems.some((item) => item.id === product.id);


  

    return (
        <>
              <div className="mb-6">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          Product ID: {productId}
        </Badge>
      </div>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative  rounded-2xl p-4 shadow-sm">
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
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
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold">
              BDT {product.discountPrice ?? product.price}
            </span>
            {product.discountPrice && (
              <span className="line-through text-gray-400">
                BDT {product.price}
              </span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">
            {product.subDescription}
          </p>

          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Category</h3>
            <Badge className="bg-green-600">{productCategory?.name}</Badge>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              onClick={() => addItem(product)}
              disabled={product.inStocks <= 0 || isInCart} 
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </Button>
            <Button
              variant="secondary"
              disabled={product.inStocks <= 0 }
              onClick={() => router.push(`/checkout?productId=${product.id}`)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>


 <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md gap-4">
          <TabsTrigger value="description">
            Description
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
          <TabsTrigger value="comments">Comments (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="border-primary">
            <CardContent className="p-6">
               <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
                  <div className="flex items-center gap-x-4 w-full justify-center">
 <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
  <Star className="size-8 fill-primary stroke-primary" />
</div>


                     <p className="text-muted-foreground"> No reviews yet.</p></div>
         
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent className="p-6">
                            <div className="flex items-center gap-x-4 w-full justify-center">
 <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
  <MessageSquareMore className="size-8  stroke-primary" />
</div>
              <p className="text-muted-foreground"> No comments yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <RelatedProducts products={relatedProducts || []}/>
      </div>
        </>
    )
}