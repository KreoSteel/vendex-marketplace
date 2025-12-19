"use client";
import { Input } from "@/app/shared/ui/input";
import { CameraIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import useAvatarUpload from "../model/use-avatar-upload";

export default function AvatarUpload({
   currentAvatarUrl,
}: {
   currentAvatarUrl: string | null;
}) {
   const { fileInputRef, handleFileChange, isPending, handleClientClick } =
      useAvatarUpload({
         currentAvatarUrl,
      });
   return (
      <div className="relative">
         <button
            type="button"
            onClick={handleClientClick}
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
      </div>
   );
}
