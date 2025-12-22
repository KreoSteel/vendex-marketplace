import { updateAvatarAction } from "@/app/features/avatar-upload/api/update-avatar-action";
import { useRouter } from "@/pkg/i18n/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

export default function useAvatarUpload() {
   const [isPending, startTransition] = useTransition();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const router = useRouter();

   const handleClientClick = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      startTransition(async () => {
         const formData = new FormData();
         formData.append("avatarImg", file);

         const result = await updateAvatarAction(undefined, formData);
         if (result.success) {
            router.refresh();
         } else if (result.error) {
            toast.error(result.error);
         }

         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      });
   };

   return {
      isPending,
      fileInputRef,
      handleClientClick,
      handleFileChange,
   };
}
