import { updateListingAction } from "@/app/actions/listings";
import {
   startTransition,
   useActionState,
   useEffect,
   useRef,
   useState,
} from "react";
import { toast } from "sonner";
import { TEditListing } from "@/components/forms/EditListingForm";

type ListingWithImages = {
   images?: (string | { url?: string })[];
};

export const useImagePreview = (listing: ListingWithImages) => {
   const [newImages, setNewImages] = useState<
      { file: File; url: string }[]
   >([]);
   const previewImagesRef = useRef<{ file: File; url: string }[]>([]);
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

   useEffect(() => {
      previewImagesRef.current = newImages;
   }, [newImages]);

   useEffect(() => {
      return () => {
         previewImagesRef.current.forEach((image) => {
            URL.revokeObjectURL(image.url);
         });
      };
   }, []);

   function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files || []);
      const newEntries = files.map((file) => ({
         file,
         url: URL.createObjectURL(file),
      }));
      setNewImages((prev) => [...prev, ...newEntries]);
      e.target.value = "";
   }

   function handleRemoveExistingImage(index: number) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
   }

   function handleRemoveNewImage(index: number) {
      setNewImages((prev) => {
         const imageToRemove = prev[index];
         if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.url);
         }
         return prev.filter((_, i) => i !== index);
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

export const useEditListing = (listing: TEditListing) => {
   const [state, formAction, isPending] = useActionState(updateListingAction, undefined);
   const {
      existingImages,
      newImages,
      handleAddImages,
      handleRemoveExistingImage,
      handleRemoveNewImage,
   } = useImagePreview(listing);

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
      newImages.forEach(({ file }) => formData.append("images", file));

      startTransition(() => {
         formAction(formData);
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
   };
};
