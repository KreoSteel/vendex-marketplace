"use client";
import { TEditListing } from "../types";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/app/entities/category/model/queries";
import { useEditListing } from "../model/use-edit-listing-form";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
   DialogClose,
} from "@/app/shared/ui";
import {
   Button,
   Label,
   Input,
   Textarea,
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/app/shared/ui";
import { Euro, PencilIcon } from "lucide-react";
import { ListingCondition } from "@/utils/generated/enums";
import PreviewImages from "@/app/features/listings/ui/preview-images-component";
import { cn } from "@/app/shared/utils/utils";

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
   const { data: categories } = useQuery(categoriesOptions);
   const {
      isOpen,
      setIsOpen,
      handleSubmit,
      newImages,
      existingImages,
      handleAddImages,
      handleRemoveNewImage,
      handleRemoveExistingImage,
      isPending,
   } = useEditListing(listing);
   const newImagesPreview = newImages.map((image) => ({
      ...image,
      type: "new" as const,
   }));
   const existingImagesPreview = existingImages.map((image) => ({
      url: image,
      type: "existing" as const,
   }));
   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

               <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                     {tForms("labels.title")}{" "}
                     <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="title"
                     name="title"
                     placeholder="e.g. MacBook Pro 14'' M2, 16GB RAM"
                     defaultValue={listing.title}
                  />
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
                     className={cn(
                        "file:text-foreground",
                        "file:bg-neutral-200",
                        "file:border-none",
                        "file:px-3",
                        "file:py-1",
                        "file:rounded-md",
                        "file:text-sm",
                        "file:font-medium",
                        "file:shadow-xs",
                        "file:transition-[color,box-shadow]",
                        "file:cursor-pointer",
                        "disabled:pointer-events-none",
                        "disabled:cursor-not-allowed",
                        "disabled:opacity-50"
                     )}
                  />

                  {/* Existing images */}
                  {existingImagesPreview.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2">
                        <PreviewImages
                           images={existingImagesPreview}
                           handleRemove={handleRemoveExistingImage}
                           alt={tMedia("existingImage")}
                        />
                     </div>
                  )}

                  {/* New images */}
                  {newImagesPreview.length > 0 && (
                     <PreviewImages
                        images={newImagesPreview}
                        handleRemove={handleRemoveNewImage}
                        alt={newImages
                           .map(
                              (image) =>
                                 image.file.name +
                                 image.file.size +
                                 image.file.lastModified
                           )
                           .join(", ")}
                     />
                  )}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                     {tForms("labels.price")}{" "}
                     <span className="text-red-500">*</span>
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
                           <SelectValue
                              placeholder={tForms(
                                 "placeholders.selectCondition"
                              )}
                           />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.values(ListingCondition).map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                 {tConditions("descriptions." + condition)}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="category" className="text-sm font-medium">
                        {tForms("labels.category")}
                     </Label>
                     <Select
                        name="category"
                        required
                        defaultValue={listing.category?.id}>
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
