import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "@/pkg/i18n/navigation";
import { toast } from "sonner";
import { createListingAction } from "@/app/actions/listings";
import { useImagePreview } from "@/app/entities/listings/model/use-image-preview";

export const useCreateListing = () => {
    const [state, formAction, isPending] = useActionState(createListingAction, undefined);
    const { newImages, handleAddImages, handleRemoveNewImage } = useImagePreview({});
    const handleRemoveImage = handleRemoveNewImage;
    const previewImages = newImages
    const router = useRouter();
    
    useEffect(() => {
       if (state?.success) {
          router.push("/listings");
       } else if (state?.error) {
          toast.error(state.error);
       }
    }, [state, router]);
 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
       e.preventDefault();
       const formData = new FormData(e.currentTarget);
       previewImages.forEach(({ file }) => formData.append("images", file));
 
       startTransition(() => {
          formAction(formData);
       });
    }
 
    return {
       previewImages,
       handleAddImages,
       handleRemoveImage,
       handleSubmit,
       isPending
    };
 };