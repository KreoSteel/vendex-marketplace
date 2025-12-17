"use client";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/app/entities/category/model/queries";
import { Label, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from "@/app/shared/ui";
import { Euro } from "lucide-react";
import { ListingCondition } from "@/utils/generated/enums";
import { useCreateListing } from "../model/use-create-listing-form";
import PreviewImages from "@/app/features/listings/ui/preview-images-component";

export default function CreateListingForm() {
    const tForms = useTranslations("forms");
    const tCreateListingForm = useTranslations("createListingForm");
    const tConditions = useTranslations("conditions");
    const tMedia = useTranslations("media");
    const tButtons = useTranslations("buttons");
    const { data: categories } = useQuery(categoriesOptions);
    const { handleSubmit, previewImages, handleAddImages, handleRemoveImage, isPending } = useCreateListing();
 
    return (
       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
             <Label htmlFor="title">
                {tForms("labels.title")} <span className="text-red-500">*</span>
             </Label>
             <Input
                name="title"
                type="text"
                required
                placeholder={tForms("placeholders.titleListing")}
             />
          </div>
          <div className="grid gap-2">
             <Label htmlFor="description">
                {tForms("labels.description")}
             </Label>
             <Textarea
                name="description"
                required
                placeholder={tForms("placeholders.descriptionDetail")}
                rows={4}
                maxLength={1000}
                className="resize-none"
             />
          </div>
          <div className="grid gap-2">
             <Label>
                {tForms("labels.photos")} <span className="text-red-500">*</span>
             </Label>
             <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                required={previewImages.length === 0}
                placeholder={tCreateListingForm("photosPlaceholder")}
                className="file:text-foreground file:bg-neutral-200 file:border-none file:px-3 file:py-1 file:rounded-md file:text-sm file:font-medium file:shadow-xs file:transition-[color,box-shadow] file:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
             />
          </div>

          <PreviewImages images={previewImages.map((image) => ({ ...image, type: "new" as const }))} handleRemove={handleRemoveImage} alt={tMedia("photosLabel")} />

          <div className="grid gap-2">
             <Label>
                {tForms("labels.price")}
             </Label>
             <div className="relative">
                <Euro className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
                <Input
                   name="price"
                   type="number"
                   placeholder={tForms("placeholders.priceListing")}
                   className="pl-8"
                />
             </div>
          </div>
          <div className="grid gap-2">
             <Label>
                {tForms("labels.category")}{" "}
                <span className="text-red-500">*</span>
             </Label>
             <Select name="category" required>
                <SelectTrigger>
                   <SelectValue
                      placeholder={tForms("placeholders.selectCategory")}
                   />
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
          <div className="grid gap-2">
             <Label>
                {tForms("labels.location")}{" "}
                <span className="text-red-500">*</span>
             </Label>
             <Input
                name="location"
                type="text"
                required
                placeholder={tForms("placeholders.locationExample")}
             />
          </div>
          <div className="grid gap-2">
             <Label>
                {tForms("labels.condition")}{" "}
                <span className="text-red-500">*</span>
             </Label>
             <Select name="condition" required>
                <SelectTrigger>
                   <SelectValue
                      placeholder={tForms("placeholders.selectCondition")}
                   />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value={ListingCondition.NEW}>
                      {tConditions("descriptions.NEW")}
                   </SelectItem>
                   <SelectItem value={ListingCondition.LIKE_NEW}>
                      {tConditions("descriptions.LIKE_NEW")}
                   </SelectItem>
                   <SelectItem value={ListingCondition.USED}>
                      {tConditions("descriptions.USED")}
                   </SelectItem>
                   <SelectItem value={ListingCondition.FOR_PARTS}>
                      {tConditions("descriptions.FOR_PARTS")}
                   </SelectItem>
                </SelectContent>
             </Select>
          </div>
          <Button type="submit" disabled={isPending} className="w-fit mx-auto">
             {isPending
                ? tButtons("creatingListing")
                : tButtons("createListing")}
          </Button>
       </form>
    );
 }