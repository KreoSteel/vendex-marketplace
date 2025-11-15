"use client";
import { createListingAction } from "@/app/actions/listings";
import { useActionState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Euro } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ListingCondition } from "@prisma/client";
import { useGetCategoriesNames } from "@/hooks/useCategories";
import { TCategory } from "@/utils/zod-schemas/categories";

export default function CreateListingForm() {
   const [state, formAction, isPending] = useActionState(createListingAction, {
      error: "",
   });

   const { data: categoriesNames } = useGetCategoriesNames();

   return (
      <form action={formAction} className="flex flex-col gap-4">
         {"error" in state && state.error && <p className="text-red-500 text-sm">{state.error}</p>}
         {"success" in state && state.success && <p className="text-green-500 text-sm">{state.success}</p>}
         <div className="grid gap-2">
            <Label htmlFor="title">
               Title <span className="text-red-500">*</span>
            </Label>
            <Input
               name="title"
               type="text"
               required
               placeholder="e.g. 'iPhone 16 Pro Max, Honda Accord 2025'"
            />
         </div>
         <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
               name="description"
               placeholder="Describe the item in detail..."
               rows={4}
               maxLength={1000}
               className="resize-none"
            />
         </div>
         <div className="grid gap-2">
            <Label>Photos (up to 10)</Label>
            <Input
               name="images"
               type="file"
               multiple
               accept="image/*"
               required
               className="file:text-foreground file:bg-neutral-200 file:border-none file:px-3 file:py-1 file:rounded-md file:text-sm file:font-medium file:shadow-xs file:transition-[color,box-shadow] file:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
         </div>
         <div className="grid gap-2">
            <Label>
               Price
            </Label>
            <div className="relative">
               <Euro className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
               <Input
                  name="price"
                  type="number"
                  placeholder="e.g. 1000"
                  className="pl-8"
               />
            </div>
         </div>
         <div className="grid gap-2">
            <Label>
               Category <span className="text-red-500">*</span>
            </Label>
            <Select name="category" required>
               <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
               </SelectTrigger>
               <SelectContent>
                  {categoriesNames?.map((cat: TCategory) => (
                     <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>
         <div className="grid gap-2">
            <Label>
               Location <span className="text-red-500">*</span>
            </Label>
            <Input
               name="location"
               type="text"
               required
               placeholder="e.g. 'New York, NY'"
            />
         </div>
         <div className="grid gap-2">
            <Label>
               Condition <span className="text-red-500">*</span>
            </Label>
            <Select name="condition" required>
               <SelectTrigger>
                  <SelectValue placeholder="Select a condition" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value={ListingCondition.NEW}>
                     New - Brand new, never used
                  </SelectItem>
                  <SelectItem value={ListingCondition.LIKE_NEW}>
                     Like new - Barely used, excellent condition
                  </SelectItem>
                  <SelectItem value={ListingCondition.USED}>
                     Used - Used but in good condition
                  </SelectItem>
                  <SelectItem value={ListingCondition.FOR_PARTS}>
                     For parts - Not working, needs repair
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>
         <Button type="submit" disabled={isPending}>
            {isPending ? "Creating listing..." : "Create listing"}
         </Button>
      </form>
   );
}
