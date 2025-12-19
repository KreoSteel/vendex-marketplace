import { toast } from "sonner";
import { updateListingAction } from "@/app/actions/listings";
import { useEffect, useState, useTransition } from "react";
import { TEditListing } from "../types";
import { useImagePreview } from "@/app/entities/listings/model/use-image-preview";
import { Result } from "@/types/result";

export const useEditListing = (listing: TEditListing) => {
   const [isOpen, setIsOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const [state, setState] = useState<Result<string> | undefined>(undefined);
   const {
      existingImages,
      newImages,
      handleAddImages,
      handleRemoveExistingImage,
      handleRemoveNewImage,
   } = useImagePreview(listing);

   useEffect(() => {
      if (state && typeof state === "object" && "success" in state) {
         if (
            state.success &&
            "data" in state &&
            typeof state.data === "string"
         ) {
            toast.success(state.data);
            setTimeout(() => setIsOpen(false), 1000);
         } else if (
            !state.success &&
            "error" in state &&
            typeof state.error === "string"
         ) {
            toast.error(state.error);
         }
      }
   }, [state]);

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      existingImages.forEach((url) => formData.append("existingImages", url));
      newImages.forEach(({ file }) => formData.append("images", file));

      startTransition(async () => {
         const result = await updateListingAction(undefined, formData);
         setState(result as Result<string>);
      });
   }

   return {
      existingImages,
      newImages,
      handleAddImages,
      handleRemoveExistingImage,
      handleRemoveNewImage,
      handleSubmit,
      isPending,
      isOpen,
      setIsOpen,
   };
};
