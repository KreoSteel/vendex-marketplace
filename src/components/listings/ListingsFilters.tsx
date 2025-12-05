"use client";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { ListingCondition } from "@/utils/generated/enums";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filters } from "@/lib/data-access/listings";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/hooks/useCategories";
import { getMaxPriceForFiltersOptions } from "@/lib/utils";

export default function ListingsFilters() {
   const { data: categories } = useQuery(categoriesOptions);
   const tConditions = useTranslations("conditions");
   const tSearchListingsPage = useTranslations("searchListingsPage");

   const searchParams = useSearchParams();

   const search = searchParams.get("search") || null;

   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedConditions, setSelectedConditions] = useState<
      ListingCondition[]
   >([]);
   const filterConditions = [
      { label: tConditions("labels.NEW"), value: ListingCondition.NEW },
      {
         label: tConditions("labels.LIKE_NEW"),
         value: ListingCondition.LIKE_NEW,
      },
      { label: tConditions("labels.USED"), value: ListingCondition.USED },
      {
         label: tConditions("labels.FOR_PARTS"),
         value: ListingCondition.FOR_PARTS,
      },
   ];

   const filters: Filters = {
      search: search,
      categorySlugs: selectedCategories.length > 0 ? selectedCategories : null,
      conditions: selectedConditions.length > 0 ? selectedConditions : null,
   };

   const { data: maxPrice, isLoading: isLoadingMaxPrice } =
      useQuery(getMaxPriceForFiltersOptions(filters));
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
         setPriceRange((prev) => {
            if (prev[0] === 0 && prev[1] === maxPrice) return prev;
            return [0, maxPrice];
         });
      }
   }, [maxPrice]);

   useEffect(() => {
      const categories = searchParams.get("category");
      if (categories) {
         const newCategories = categories.split(",");

         setSelectedCategories((prev) => {
            if (
               prev.length === newCategories.length &&
               prev.every((c) => newCategories.includes(c))
            )
               return prev;
            return newCategories;
         });
      } else {
         setSelectedCategories((prev) => (prev.length ? [] : prev));
      }

      const conditions = searchParams.get("condition");
      if (conditions) {
         const newConditions = conditions.split(",") as ListingCondition[];

         setSelectedConditions((prev) => {
            if (
               prev.length === newConditions.length &&
               prev.every((c) => newConditions.includes(c))
            )
               return prev;
            return newConditions;
         });
      } else {
         setSelectedConditions((prev) => (prev.length ? [] : prev));
      }

      const minPrice = searchParams.get("minPrice");
      const maxPriceParam = searchParams.get("maxPrice");
      if (minPrice || maxPriceParam) {
         const newRange = [
            minPrice ? parseInt(minPrice, 10) : 0,
            maxPriceParam ? parseInt(maxPriceParam, 10) : 1000,
         ];

         setPriceRange((prev) => {
            if (prev[0] === newRange[0] && prev[1] === newRange[1]) return prev;
            return newRange;
         });
      }
   }, [searchParams]);

   return (
      <Card className="w-full bg-surface">
         <CardHeader>
            <CardTitle className="text-lg">
               {tSearchListingsPage("filters.title")}
            </CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">
                  {tSearchListingsPage("filters.categories")}
               </Label>
               {categories?.map((category) => (
                  <div key={category.slug} className="flex items-center gap-2">
                     <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={(checked) =>
                           handleCategoryChange(category.slug, checked === true)
                        }
                        className="w-4 h-4 border-border rounded-sm border-2 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 shrink-0">
                        <CheckboxIndicator className="flex items-center justify-center">
                           <CheckIcon className="w-3 h-3 text-white" />
                        </CheckboxIndicator>
                     </Checkbox>
                     <Label
                        htmlFor={category.slug}
                        className="text-sm font-normal cursor-pointer select-none">
                        {category.name}
                     </Label>
                  </div>
               ))}
            </div>
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">
                  {tSearchListingsPage("filters.conditionTitle")}
               </Label>
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
                        className="w-4 h-4 border-border rounded-sm border-2 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 shrink-0">
                        <CheckboxIndicator className="flex items-center justify-center">
                           <CheckIcon className="w-3 h-3 text-white" />
                        </CheckboxIndicator>
                     </Checkbox>
                     <Label
                        htmlFor={condition.value}
                        className="text-sm font-normal cursor-pointer select-none">
                        {condition.label}
                     </Label>
                  </div>
               ))}
            </div>
            <div className="flex gap-2">
               <Button onClick={clearFilters} variant="outline">
                  {tSearchListingsPage("filters.clear")}
               </Button>
               <Button onClick={handleURLChange} className="w-full max-w-26">
                  {tSearchListingsPage("filters.apply")}
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
