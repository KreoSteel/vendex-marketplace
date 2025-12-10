import { updateListingAction } from "@/app/actions/listings";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { TListing } from "@/utils/zod-schemas/listings";

export const useImagePreview = (listing: TListing) => {
   const [newImages, setNewImages] = useState<File[]>([]);
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

   return {
      newImages,
      existingImages,
      handleAddImages,
      handleRemoveExistingImage,
      handleRemoveNewImage,
   };
};

export const useEditListing = (listing: TListing) => {
   const [state, formAction, isPending] = useActionState(updateListingAction, undefined);
   const { existingImages, newImages } = useImagePreview(listing);

   useEffect(() => {
      if (state && "success" in state && state.success) {
         toast.success(state.data);
      }
      if (state && "error" in state && state.error) {
         toast.error(state.error);
      }
   }, [state]);


   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      existingImages.forEach((url) => formData.append("existingImages", url));
      newImages.forEach((file) => formData.append("images", file));

      startTransition(() => {
         formAction(formData);
      });
   }

   return {
      existingImages,
      newImages,
      handleSubmit,
      isPending,
   };
};
