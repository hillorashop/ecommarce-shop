import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { Button } from "@/components/ui/button";
import { Tag} from "lucide-react";



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

export const CategoryFilter = ({
    sortBy,
  sortOrder,
  onSortChange,
  minPrice = 0,
  maxPrice = 5000,
  onPriceChange,
  

  onReset
}:Props) => {


     
  const [price, setPrice] = useState<[number, number]>([minPrice, maxPrice]);


  useEffect(() => {
    setPrice([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);


  // Sort dropdown value
  const sortValue =
    sortBy === "price" && sortOrder === "desc"
      ? "price-high"
      : sortBy === "price" && sortOrder === "asc"
      ? "price-low"
      : sortBy === "createdAt"
      ? "createdAt"
      : "category";

  const applySort = (value: string) => {
    if (value === "price-low") onSortChange("price", "asc");
    if (value === "price-high") onSortChange("price", "desc");
    if (value === "createdAt") onSortChange("createdAt", "desc");
  };



  const resetFilters = () => {
    onReset()
    setPrice([0, 5000])
  }

    return (
        <>
            <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" /> Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-red-500 font-semibold bg-gray-100 hover:bg-green-600 hover:text-white"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["sort", "price", "categories"]} className="space-y-3">
        {/* Sort */}
        <AccordionItem value="sort">
          <AccordionTrigger className="flex items-center gap-2">Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sortValue} onValueChange={applySort}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="createdAt">Newest</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="flex items-center gap-2">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
      <Slider
                value={price}
                onValueChange={(val: number[]) => setPrice([val[0], val[1]])}
                min={0}
                max={5000}
                step={50}
              />


              <div className="flex justify-between text-sm text-gray-600">
                <span>Tk {price[0]}</span>
                <span>Tk {price[1]}</span>
              </div>
               <Button
                className="w-full mt-1 rounded-xl"
                size="sm"
                onClick={() => onPriceChange?.(price[0], price[1])}
              >
                Apply Range
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

  
      </Accordion>
        </>
    )
}