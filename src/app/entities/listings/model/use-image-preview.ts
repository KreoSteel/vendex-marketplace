import { useEffect, useRef, useState } from "react";

type ListingWithImages = {
   images?: (string | { url?: string })[];
};

export function useImagePreview(listing: ListingWithImages) {
   const [newImages, setNewImages] = useState<{ file: File; url: string }[]>(
      []
   );
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
}
