import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IoFilterCircle } from "react-icons/io5";
import { Filter } from "./filter";
import { useState } from "react";



interface Props {
  sortBy: "price" | "category" | "createdAt";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "price" | "category" | "createdAt",
    sortOrder: "asc" | "desc"
  ) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  categoryIds?: string[];
  onCategoryChange?: (ids: string[]) => void;
  onReset: () => void;
}


export const MobileFilterSideBar = ({

  sortBy,
  sortOrder,
  onSortChange,
  minPrice,
  maxPrice ,
  onPriceChange,
  categoryIds,
  onCategoryChange,
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
                <Filter 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(...args) => {
              onSortChange(...args);
              setOpen(false); // ✅ close after sort
            }}
            onCategoryChange={(ids) => {
              onCategoryChange?.(ids);
              setOpen(false); // ✅ close after category select
            }}
            onPriceChange={(min, max) => {
              onPriceChange?.(min, max);
              setOpen(false); // ✅ close after price apply
            }}
            categoryIds={categoryIds}
            minPrice={minPrice}
            maxPrice={maxPrice}
                onReset={onReset}
                />
          </aside>
            </SheetContent>
              </Sheet>
    )
}