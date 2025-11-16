"use client";
import { createListingAction } from "@/app/actions/listings";
import { useActionState, useState, useTransition } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Euro, X } from "lucide-react";
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
   const [state, formAction] = useActionState(createListingAction, {
      error: "",
   });
   const [isPending, startTransition] = useTransition();
   const { data: categoriesNames } = useGetCategoriesNames();

   const [previewImages, setPreviewImages] = useState<File[]>([]);

   function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files || []);
      setPreviewImages((prev) => [...prev, ...files]);
      e.target.value = "";
   }

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      previewImages.forEach((file) => formData.append("images", file));
      
      startTransition(() => {
         formAction(formData);
      });
   }

   function handleRemoveImage(index: number) {
      setPreviewImages((prev) => {
         const newImages = prev.filter((_, item) => item !== index);
         URL.revokeObjectURL(URL.createObjectURL(prev[index]));
         return newImages;
      });
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         {"error" in state && state.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
         )}
         {"success" in state && state.success && (
            <p className="text-green-500 text-sm">{state.success}</p>
         )}
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
               type="file"
               multiple
               accept="image/*"
               onChange={handleAddImages}
               required={previewImages.length === 0}
               className="file:text-foreground file:bg-neutral-200 file:border-none file:px-3 file:py-1 file:rounded-md file:text-sm file:font-medium file:shadow-xs file:transition-[color,box-shadow] file:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
         </div>
         <div className="flex flex-wrap gap-2">
            {previewImages.map((image, index) => {
               const url = URL.createObjectURL(image);
               return (
                  <div key={index} className="relative">
                     <img
                        src={url}
                        alt={image.name}
                        width={150}
                        height={150}
                        className="rounded-md object-cover"
                     />
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 cursor-pointer"
                        onClick={() => handleRemoveImage(index)}>
                        <X className="w-4 h-4 text-red-500" />
                     </Button>
                  </div>
               );
            })}
         </div>
         <div className="grid gap-2">
            <Label>Price</Label>
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
         <Button type="submit" disabled={isPending} className="w-fit mx-auto">
            {isPending ? "Creating listing..." : "Create listing"}
         </Button>
      </form>
   );
}
