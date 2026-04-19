import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IoFilterCircle } from "react-icons/io5";

import { useState } from "react";
import { CategoryFilter } from "./category-filter";



interface Props {
  sortBy: "price" |  "createdAt";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "price" |  "createdAt",
    sortOrder: "asc" | "desc"
  ) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  onReset: () => void;
}


export const CategoryMobileFilterSideBar = ({

  sortBy,
  sortOrder,
  onSortChange,
  minPrice,
  maxPrice ,
  onPriceChange,
  onReset

}:Props) => {
    const [open, setOpen] = useState(false);
    
    return (
              <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden fixed z-50 top-28 -left-1">
            <IoFilterCircle className="size-12 fill-primary"/>
            </SheetTrigger>
            <SheetContent className="px-4 max-w-48">
          <SheetHeader className="mb-2"> <SheetTitle className="sr-only"> Filter Product </SheetTitle></SheetHeader>
          <aside className="py-4">
                <CategoryFilter 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(...args) => {
              onSortChange(...args);
              setOpen(false);
            }}
         
            onPriceChange={(min, max) => {
              onPriceChange?.(min, max);
              setOpen(false); 
            }}
       
            minPrice={minPrice}
            maxPrice={maxPrice}
                onReset={onReset}
                />
          </aside>
            </SheetContent>
              </Sheet>
    )
}