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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag} from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";

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

export const Filter = ({
    sortBy,
  sortOrder,
  onSortChange,
  minPrice = 0,
  maxPrice = 5000,
  onPriceChange,
  categoryIds = [],
  onCategoryChange,
  onReset
}:Props) => {


      const { data: categories, isLoading } = useCategories();
 // 👇 Local slider state
  const [price, setPrice] = useState<[number, number]>([minPrice, maxPrice]);

  // Sync local price when parent props change (e.g. on reset)
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
    if (value === "category") onSortChange("category", "asc");
  };


  const toggleCategory = (id: string, checked: boolean) => {
    const newCategories = checked
      ? [...categoryIds, id]
      : categoryIds.filter((c) => c !== id);
    onCategoryChange?.(newCategories);
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
                <SelectItem value="category">Category</SelectItem>
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

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="flex items-center gap-2">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {isLoading ? (
                <div className=" flex items-center space-x-2">
                    <Skeleton className="size-5 rounded-md"/>
                    <Skeleton className="w-14 h-4 rounded-md"/>
                </div>
              ) : categories?.data?.length ? (
                categories.data.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat.id}
                      checked={categoryIds.includes(cat.id)}
                      onCheckedChange={(checked) => toggleCategory(cat.id, checked === true)}
                    />
                    <Label htmlFor={cat.id} className="text-sm text-gray-700">
                      {cat.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No categories found</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
        </>
    )
}