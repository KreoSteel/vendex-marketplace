"use client";
import { Label, Card, CardContent, CardHeader, CardTitle, Button, Slider } from "@/app/shared/ui";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { ListingCondition } from "@/utils/generated/enums";
import { useTranslations } from "next-intl";
import { useListingsFilters } from "@/app/pages/listings/hooks/use-listings-filters";
import { initialState } from "@/app/pages/listings/hooks/use-filters-reducer";
import { useRouter } from "@/pkg/i18n/navigation";
import { getMaxPriceForFiltersOptions } from "@/app/shared/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { Filters } from "@/lib/data-access/listings";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ListingsFilters() {
   const {
      state,
      categories,
      handleCategoryChange,
      handleConditionChange,
      handlePriceRangeChange,
      clearFilters,
   } = useListingsFilters();
   const searchParams = useSearchParams();
   const queryString = searchParams.toString();
   const urlCategory = searchParams.get("category")
      ? (searchParams.get("category")?.split(",") as string[])
      : [];
   const urlCondition = searchParams.get("condition")
      ? (searchParams.get("condition")?.split(",") as ListingCondition[])
      : [];
   const urlSearch = searchParams.get("search")
      ? searchParams.get("search")
      : null;

   const maxPriceParams: Filters = {
      categorySlugs: urlCategory.length > 0 ? urlCategory : undefined,
      conditions: urlCondition.length > 0 ? urlCondition : undefined,
      search: urlSearch,
   };

   const tCommon = useTranslations("common");
   const tSearchListingsPage = useTranslations("searchListingsPage");
   const router = useRouter();
   const { data: maxPrice } = useQuery({
      ...getMaxPriceForFiltersOptions(maxPriceParams),
      queryKey: ["max-price", queryString],
   });

   function handleApplyFilters() {
      const maxPriceValue = maxPrice ?? initialState.priceRange[1];
      const params = new URLSearchParams();
      if (state.categories.length > 0) {
         params.set("category", state.categories.join(","));
      }
      if (state.conditions.length > 0) {
         params.set("condition", state.conditions.join(","));
      }
      if (state.priceRange[0] > 0) {
         params.set("minPrice", state.priceRange[0].toString());
      }
      if (state.priceRange[1] < maxPriceValue) {
         params.set("maxPrice", state.priceRange[1].toString());
      }
      const queryString = params.toString();
      router.push(`/listings?${queryString}`);
   }

   useEffect(() => {
      const DEFAULT_MAX_PRICE = initialState.priceRange[1];
      if (!maxPrice || maxPrice <= 0) return;
      const needsClamp =
         state.priceRange[1] === DEFAULT_MAX_PRICE ||
         state.priceRange[1] > maxPrice;
      if (needsClamp) {
         handlePriceRangeChange([
            Math.min(state.priceRange[0], maxPrice),
            maxPrice,
         ]);
      }
   }, [maxPrice, state.priceRange, handlePriceRangeChange]);

   const filterConditions = [
      {
         value: ListingCondition.NEW,
         label: tSearchListingsPage("filters.conditions.new"),
      },
      {
         value: ListingCondition.LIKE_NEW,
         label: tSearchListingsPage("filters.conditions.likeNew"),
      },
      {
         value: ListingCondition.USED,
         label: tSearchListingsPage("filters.conditions.used"),
      },
      {
         value: ListingCondition.FOR_PARTS,
         label: tSearchListingsPage("filters.conditions.forParts"),
      },
   ];

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
               {categories?.map((category) => {
                  const isChecked = state.categories.includes(category.slug);
                  const handleChange = (checked: boolean) => {
                     if (checked) {
                        handleCategoryChange([
                           ...state.categories,
                           category.slug,
                        ]);
                     } else {
                        handleCategoryChange(
                           state.categories.filter((c) => c !== category.slug)
                        );
                     }
                  };
                  return (
                     <div
                        key={category.slug}
                        className="flex items-center gap-2">
                        <Checkbox
                           id={category.slug}
                           checked={isChecked}
                           onCheckedChange={handleChange}
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
                  );
               })}
            </div>
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">
                  {tSearchListingsPage("filters.conditionTitle")}
               </Label>
               {filterConditions.map((condition) => {
                  const isChecked = state.conditions.includes(condition.value);
                  const handleChange = (checked: boolean) => {
                     if (checked) {
                        handleConditionChange([
                           ...state.conditions,
                           condition.value,
                        ]);
                     } else {
                        handleConditionChange(
                           state.conditions.filter((c) => c !== condition.value)
                        );
                     }
                  };
                  return (
                     <div
                        key={condition.value}
                        className="flex items-center gap-2">
                        <Checkbox
                           id={condition.value}
                           checked={isChecked}
                           onCheckedChange={handleChange}
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
                  );
               })}
            </div>
            <div className="flex flex-col gap-1.5">
               <Label className="text-base font-medium pb-1.5">
                  {tCommon("price")}
               </Label>
               <Slider
                  value={state.priceRange}
                  onValueChange={handlePriceRangeChange}
                  min={0}
                  max={maxPrice ?? state.priceRange[1]}
                  step={maxPrice ? maxPrice / 100 : 1}
                  className="w-full"
               />
               <div className="flex justify-between text-sm text-gray-600">
                  <span>€{state.priceRange[0].toLocaleString()}</span>
                  <span>€{state.priceRange[1].toLocaleString()}</span>
               </div>
            </div>
            <div className="flex gap-2">
               <Button onClick={clearFilters} variant="outline">
                  {tSearchListingsPage("filters.clear")}
               </Button>
               <Button className="w-full max-w-26" onClick={handleApplyFilters}>
                  {tSearchListingsPage("filters.apply")}
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
