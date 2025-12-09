import { Euro, PencilIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
   DialogClose,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useActionState, useEffect, useState, useTransition } from "react";
import { updateListingAction } from "@/app/actions/listings";
import { ListingCondition } from "@/utils/generated/enums";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "../ui/select";
import Image from "next/image";
import { TCategory } from "@/utils/zod-schemas/categories";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/lib/query-options/categories";

export type TEditListing = {
   id: string;
   title: string;
   description: string | null;
   price: number | null;
   location: string | null;
   condition: ListingCondition;
   category: TCategory | null;
   images?: (string | { url: string })[];
 };

export const conditions = {
   [ListingCondition.NEW]: "New - Brand new, never used",
   [ListingCondition.LIKE_NEW]: "Like New - Barely used, excellent condition",
   [ListingCondition.USED]: "Used - Used but in good condition",
   [ListingCondition.FOR_PARTS]: "For Parts - Not working, needs repair",
};


export default function EditListingForm({
   listing,
}: {
   listing: TEditListing;
}) {
   const tForms = useTranslations("forms");
   const tDialogs = useTranslations("dialogs.editListing");
   const tConditions = useTranslations("conditions");
   const tMedia = useTranslations("media");
   const tButtons = useTranslations("buttons");
   const [state, formAction] = useActionState(updateListingAction, undefined);
   const { data: categories } = useQuery(categoriesOptions);
   const [isPending, startTransition] = useTransition();
   
   const [existingImages, setExistingImages] = useState<string[]>(() => {
      if (listing.images && Array.isArray(listing.images)) {
          return listing.images
            .map((img: string | { url?: string }) =>
               typeof img === "string" ? img : img.url || ""
            )
            .filter((url: string) => url && url.trim() !== "") as string[];
      }
      return [];
   });
   const [newImages, setNewImages] = useState<File[]>([]);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      if (state?.success) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setOpen(false);
         setNewImages([]);
      }
   }, [state]);

   function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files || []);
      setNewImages((prev) => [...prev, ...files]);
      e.target.value = "";
   }

   function handleRemoveExistingImage(index: number) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
   }

   function handleRemoveNewImage(index: number) {
      setNewImages((prev) => {
         const newFiles = prev.filter((_, i) => i !== index);
         const fileToRemove = prev[index];
         if (fileToRemove) {
            const url = URL.createObjectURL(fileToRemove);
            URL.revokeObjectURL(url);
         }
         return newFiles;
      });
   }

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      existingImages.forEach((url) => formData.append("existingImages", url));
      newImages.forEach((file) => formData.append("images", file));

      startTransition(() => {
         formAction(formData);
      });
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               className="flex items-center gap-2 shadow-md">
               <PencilIcon className="w-4 h-4" />
               {tButtons("editListing")}
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  {tDialogs("title")}
               </DialogTitle>
               <DialogDescription className="text-sm text-muted-foreground">
                  {tDialogs("description")} <br />
                  {tDialogs("changesVisible")}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
               <input type="hidden" name="id" value={listing.id} />

               {!state?.success && (
                  <p className="text-red-500 text-sm">{state?.error}</p>
               )}

               <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                     {tForms("labels.title")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="title"
                     name="title"
                     placeholder="e.g. MacBook Pro 14'' M2, 16GB RAM"
                     defaultValue={listing.title}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                     {tForms("labels.price")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                     <Euro className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
                     <Input
                        id="price"
                        name="price"
                        type="number"
                        min={0}
                        step="0.01"
                        className="pl-8"
                        placeholder={tForms("placeholders.priceListingEdit")}
                        defaultValue={listing.price?.toString() ?? ""}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                     {tForms("labels.description")}
                  </Label>
                  <Textarea
                     id="description"
                     name="description"
                     rows={4}
                     className="resize-none"
                     placeholder="Briefly describe the condition, specs, and anything buyers should know."
                     defaultValue={listing.description ?? ""}
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-sm font-medium">
                     {tMedia("photosLabel")}
                  </Label>
                  <Input
                     type="file"
                     multiple
                     accept="image/*"
                     onChange={handleAddImages}
                     className="file:text-foreground file:bg-neutral-200 file:border-none file:px-3 file:py-1 file:rounded-md file:text-sm file:font-medium file:shadow-xs file:transition-[color,box-shadow] file:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                     {existingImages.map((imageUrl, index) => (
                        <div
                           key={`existing-${index}`}
                           className="relative w-[120px] h-[120px]">
                           <Image
                              src={imageUrl}
                              alt={tMedia("existingImage")}
                              fill
                              sizes="120px"
                              className="rounded-md object-cover"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 cursor-pointer"
                              onClick={() => handleRemoveExistingImage(index)}>
                              <X className="w-4 h-4 text-red-500" />
                           </Button>
                        </div>
                     ))}
                     {newImages.map((image, index) => {
                        const url = URL.createObjectURL(image);
                        return (
                           <div
                              key={`new-${index}`}
                              className="relative w-[120px] h-[120px]">
                              <Image
                                 src={url}
                                 alt={image.name}
                                 fill
                                 sizes="120px"
                                 className="rounded-md object-cover"
                              />
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="icon"
                                 className="absolute right-0 top-0 cursor-pointer"
                                 onClick={() => handleRemoveNewImage(index)}>
                                 <X className="w-4 h-4 text-red-500" />
                              </Button>
                           </div>
                        );
                     })}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                     {tForms("labels.location")}
                  </Label>
                  <Input
                     id="location"
                     name="location"
                     placeholder={tForms("placeholders.locationCity")}
                     defaultValue={listing.location ?? ""}
                  />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="condition" className="text-sm font-medium">
                        {tForms("labels.condition")}
                     </Label>
                     <Select
                        name="condition"
                        required
                        defaultValue={listing.condition}>
                        <SelectTrigger>
                           <SelectValue placeholder={tForms("placeholders.selectCondition")} />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(conditions).map(([key]) => (
                              <SelectItem key={key} value={key as ListingCondition}>
                                 {tConditions("descriptions." + key)}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="category" className="text-sm font-medium">
                        {tForms("labels.category")}
                     </Label>
                     <Select name="category" required defaultValue={listing.category?.id}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                           {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                 {cat.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                  <DialogClose asChild>
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        className="w-full sm:w-auto shadow-md">
                        {tButtons("cancel")}
                     </Button>
                  </DialogClose>
                  <Button
                     type="submit"
                     className="w-full sm:w-auto shadow-md"
                     disabled={isPending}>
                     {isPending ? tButtons("saving") : tButtons("saveChanges")}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
