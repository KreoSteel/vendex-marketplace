"use client";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { useGetCategories } from "@/hooks/useCategories";
import { CheckIcon } from "lucide-react";
import { Slider } from "../ui/slider";
import { ListingCondition } from "@/utils/generated/enums";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filters } from "@/lib/data-access/listings";
import { useGetMaxPriceForFilters } from "@/hooks/useListing";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const filterConditions = [
   { label: "New", value: ListingCondition.NEW },
   { label: "Like New", value: ListingCondition.LIKE_NEW },
   { label: "Used", value: ListingCondition.USED },
   { label: "For Parts", value: ListingCondition.FOR_PARTS },
];

export default function ListingsFilters() {
   const { data: categories } = useGetCategories();
   const searchParams = useSearchParams();

   const search = searchParams.get("search") || null;

   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedConditions, setSelectedConditions] = useState<
      ListingCondition[]
   >([]);

   const filters: Filters = {
      search: search,
      categorySlugs: selectedCategories.length > 0 ? selectedCategories : null,
      conditions: selectedConditions.length > 0 ? selectedConditions : null,
   };

   const { data: maxPrice, isLoading: isLoadingMaxPrice } =
      useGetMaxPriceForFilters(filters);
   const [priceRange, setPriceRange] = useState([0, maxPrice || 1000]);
   const router = useRouter();

   const handleURLChange = () => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) {
         params.set("search", search);
      } else {
         params.delete("search");
      }

      if (selectedCategories.length > 0) {
         params.set("category", selectedCategories.join(","));
      } else {
         params.delete("category");
      }

      if (selectedConditions.length > 0) {
         params.set("condition", selectedConditions.join(","));
      } else {
         params.delete("condition");
      }

      if (priceRange[0] > 0 || (maxPrice && priceRange[1] < maxPrice)) {
         params.set("minPrice", priceRange[0].toString());
         params.set("maxPrice", priceRange[1].toString());
      } else {
         params.delete("minPrice");
         params.delete("maxPrice");
      }

      router.push(`/listings?${params.toString()}`);
   };

   const handleCategoryChange = (slug: string, checked: boolean) => {
      setSelectedCategories((prev) =>
         checked ? [...prev, slug] : prev.filter((sl) => sl !== slug)
      );
   };

   const handleConditionChange = (
      condition: ListingCondition,
      checked: boolean
   ) => {
      setSelectedConditions((prev) =>
         checked
            ? [...prev, condition]
            : prev.filter((cond) => cond !== condition)
      );
   };

   const clearFilters = () => {
      setSelectedCategories([]);
      setSelectedConditions([]);
      setPriceRange([0, maxPrice || 1000]);
      const params = new URLSearchParams(searchParams.toString());

      params.delete("category");
      params.delete("condition");
      params.delete("minPrice");
      params.delete("maxPrice");

      router.push(`/listings?${params.toString()}`);
   };

   useEffect(() => {
      if (maxPrice !== undefined && maxPrice > 0) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setPriceRange([0, maxPrice]);
      }
   }, [maxPrice]);

   useEffect(() => {
      const categories = searchParams.get("category");
      if (categories) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setSelectedCategories(categories.split(","));
      }

      const conditions = searchParams.get("condition");
      if (conditions) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setSelectedConditions(conditions.split(",") as ListingCondition[]);
      }

      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      if (minPrice || maxPrice) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setPriceRange([
            minPrice ? parseInt(minPrice, 10) : 0,
            maxPrice ? parseInt(maxPrice, 10) : 1000,
         ]);
      }
   }, [searchParams]);

   return (
      <Card className="w-full bg-surface">
         <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">Category</Label>
               {categories?.map((category) => (
                  <div key={category.slug} className="flex items-center gap-2">
                     <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={(checked) =>
                           handleCategoryChange(category.slug, checked === true)
                        }
                        className="w-4 h-4 border-border rounded-sm border-2 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500">
                        <CheckboxIndicator>
                           <CheckIcon className="w-3 h-3 text-white" />
                        </CheckboxIndicator>
                     </Checkbox>
                     <Label
                        htmlFor={category.slug}
                        className="text-sm font-normal">
                        {category.name}
                     </Label>
                  </div>
               ))}
            </div>
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">Condition</Label>
               {filterConditions.map((condition) => (
                  <div
                     key={condition.value}
                     className="flex items-center gap-2">
                     <Checkbox
                        id={condition.value}
                        checked={selectedConditions.includes(condition.value)}
                        onCheckedChange={(checked) =>
                           handleConditionChange(
                              condition.value,
                              checked === true
                           )
                        }
                        className="w-4 h-4 border-border rounded-sm border-2 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500">
                        <CheckboxIndicator>
                           <CheckIcon className="w-3 h-3 text-white" />
                        </CheckboxIndicator>
                     </Checkbox>
                     <Label
                        htmlFor={condition.value}
                        className="text-sm font-normal">
                        {condition.label}
                     </Label>
                  </div>
               ))}
            </div>
            <div className="flex flex-col gap-2 mt-2">
               <Label className="text-base font-medium">Price Range</Label>
               {isLoadingMaxPrice ? (
                  <div className="text-sm text-gray-500">
                     Loading price range...
                  </div>
               ) : maxPrice && maxPrice > 0 ? (
                  <>
                     <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        defaultValue={priceRange}
                        min={0}
                        max={maxPrice}
                        step={1}
                        className="w-full"
                     />
                     <div className="flex justify-between text-sm text-gray-600">
                        <span>€{priceRange[0].toLocaleString()}</span>
                        <span>€{priceRange[1].toLocaleString()}</span>
                     </div>
                  </>
               ) : (
                  <div className="text-sm text-gray-500">
                     {" "}
                     No price range found
                  </div>
               )}
            </div>
            <div className="flex gap-2">
               <Button onClick={clearFilters} variant="outline">
                  Clear
               </Button>
               <Button onClick={handleURLChange} className="w-2/3">
                  Apply
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
