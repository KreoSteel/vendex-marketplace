"use client";
import { createListingAction } from "@/app/actions/listings";
import {
   useActionState,
   useEffect,
   useRef,
   useState,
   useTransition,
} from "react";
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
import { ListingCondition } from "@/utils/generated/enums";
import { useRouter } from "@/pkg/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/lib/query-options/categories";
import { toast } from "sonner";

export default function CreateListingForm() {
   const tForms = useTranslations("forms");
   const tCreateListingForm = useTranslations("createListingForm");
   const tConditions = useTranslations("conditions");
   const tButtons = useTranslations("buttons");
   const router = useRouter();
   const [state, formAction] = useActionState(createListingAction, undefined);
   const [isPending, startTransition] = useTransition();
   const { data: categories } = useQuery(categoriesOptions);

   const [previewImages, setPreviewImages] = useState<
      { file: File; url: string }[]
   >([]);
   const previewImagesRef = useRef<{ file: File; url: string }[]>([]);

   useEffect(() => {
      previewImagesRef.current = previewImages;
   }, [previewImages]);

   useEffect(() => {
      return () => {
         previewImagesRef.current.forEach((image) => {
            URL.revokeObjectURL(image.url);
         });
      };
   }, []);

   useEffect(() => {
      if (state?.success) {
         router.push("/listings");
      } else if (state?.error) {
         toast.error(state.error);
      }
   }, [state, router]);

   function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files || []);
      const newImages = files.map((file) => ({
         file,
         url: URL.createObjectURL(file),
      }));
      setPreviewImages((prev) => [...prev, ...newImages]);
      e.target.value = "";
   }

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      previewImages.forEach((image) => formData.append("images", image.file));

      startTransition(() => {
         formAction(formData);
      });
   }

   function handleRemoveImage(index: number) {
      setPreviewImages((prev) => {
         const fileToRemove = prev[index];
         if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.url);
         }
         const newFiles = prev.filter((_, item) => item !== index);
         return newFiles;
      });
   }

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
               {tForms("labels.description")}{" "}
               <span className="text-red-500">*</span>
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
         <div className="flex flex-wrap gap-2">
            {previewImages.map((image, index) => {
               const url = image.url;
               return (
                  <div
                     key={
                        image.file.name +
                        image.file.size +
                        image.file.lastModified
                     }
                     className="relative h-32 w-32">
                     <Image
                        src={url}
                        alt={image.file.name}
                        fill
                        sizes="128px"
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
            <Label>
               {tForms("labels.price")} <span className="text-red-500">*</span>
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
