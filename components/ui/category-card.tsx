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

  return (
    <Link href={`/categories/${categoryUrl}/products`} className="w-full">
      <Card className="flex flex-col items-center p-4 cursor-pointer hover:shadow-lg transition-shadow rounded-none">
        <CardContent className="flex flex-col items-center p-0">
          
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                       rounded-full overflow-hidden relative 
                       transition-transform duration-300 
                       group-hover:scale-110 group-hover:shadow-lg"
          >
            <Image
              src={categoryImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-cover"
              loading="lazy"
            />
          </div>

          
          <p
            className="mt-3 text-sm sm:text-base md:text-lg 
                       font-medium text-gray-700 
                       group-hover:text-primary group-hover:underline transition-colors text-center"
          >
            {name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
