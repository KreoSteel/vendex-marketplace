import { toast } from "sonner";
import { updateListingAction } from "@/app/actions/listings";
import { startTransition, useActionState, useEffect, useState } from "react";
import { TEditListing } from "../types";
import { useImagePreview } from "@/app/entities/listings/model/use-image-preview";

export const useEditListing = (listing: TEditListing) => {
    const [isOpen, setIsOpen] = useState(false);
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
          setIsOpen(false);
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
       isOpen,
       setIsOpen,
    };
 };
