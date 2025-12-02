"use client";
import { useRef, useTransition, useState } from "react";
import { Input } from "../ui/input";
import { updateUserProfileImageAction } from "@/app/actions/profile";
import { CameraIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";

interface AvatarUploadProps {
   currentAvatarUrl: string | null;
}

export default function AvatarUpload({ currentAvatarUrl }: AvatarUploadProps) {
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const router = useRouter();

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      startTransition(async () => {
         const formData = new FormData();
         formData.append("avatarImg", file);

         const result = await updateUserProfileImageAction(formData);
         if ("success" in result) {
            router.refresh();
         } else if ("error" in result) {
            setError(result.error);
         }

         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      });
   };

   return (
      <div className="relative">
         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="size-20 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden relative">
            {isPending ? (
               <Loader2 className="size-6 text-neutral-500 animate-spin" />
            ) : currentAvatarUrl ? (
               <Image
                  src={currentAvatarUrl}
                  alt="Avatar"
                  fill
                  sizes="80px"
                  className="object-cover rounded-full"
                  priority
               />
            ) : (
               <CameraIcon className="size-6 text-neutral-500" />
            )}
         </button>
         <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
         />
         {error && (
            <p className="mt-2 text-sm text-red-500">
               {error}
            </p>
         )}
      </div>
   );
}
