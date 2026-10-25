'use client';

import { dbCategory } from "@/types/type";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  category: dbCategory;
}

export const CategoryCard = ({ category }: Props) => {
  const { name, categoryImage, id, categoryUrl } = category;
  const validImage = categoryImage?.trim();
  const hasImage = Boolean(validImage);

  return (
    <Link href={`/categories/${categoryUrl}`} className="w-full h-full block group">
      <Card className="flex flex-col items-center p-4 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-gray-100 h-full justify-center">
        <CardContent className="flex flex-col items-center p-0">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                       rounded-full overflow-hidden relative 
                       bg-gray-100
                       transition-transform duration-300 
                       group-hover:scale-105 group-hover:shadow-md"
          >
            {hasImage && validImage && (
              <Image
                src={validImage}
                alt={name || ""}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-cover"
                priority
              />
            )}
          </div>

          <p
            className="mt-3 text-sm sm:text-base md:text-lg 
                       font-semibold text-gray-900 
                       group-hover:text-primary group-hover:underline transition-colors text-center line-clamp-1"
          >
            {name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
