import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/config/envs/server";
import { clientEnv } from "@/config/envs/client";
import { Result } from "@/types/result";

const supabaseAdmin = createClient(
   clientEnv.NEXT_PUBLIC_SUPABASE_URL,
   serverEnv.SUPABASE_SERVICE_ROLE_KEY
);

export async function uploadListingImages(files: File[], userId: string): Promise<Result<string[]>> {
   const MAX_IMAGES_PER_LISTING = 10;
   const MAX_FILE_SIZE = 5 * 1024 * 1024;
   const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
   const urls: string[] = [];

   for (let i = 0; i < files.length; ++i) {
      if (i >= MAX_IMAGES_PER_LISTING) {
         return { success: false, error: `You can only upload up to ${MAX_IMAGES_PER_LISTING} images` };
      }

      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
         return { success: false, error: "File size must be less than 5MB" };
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
         return { success: false, error: "File type not allowed" };
      }

      const fileName = `${userId}-${file.name}-${Date.now()}-${i}`;

      const { error } = await supabaseAdmin.storage
         .from("listing_images")
         .upload(fileName, file);

      if (error) {
         return { success: false, error: error.message };
      }
      const { data: urlData } = supabaseAdmin.storage
         .from("listing_images")
         .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
   }

   return { success: true, data: urls };
}

export async function uploadProfileImage(file: File, userId: string): Promise<Result<string>> {
   const MAX_FILE_SIZE = 5 * 1024 * 1024;
   const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

   if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File size must be less than 5MB" };
   }

   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { success: false, error: "File type not allowed" };
   }

   const fileName = `${userId}-${file.name}-${Date.now()}`;

   const { error } = await supabaseAdmin.storage
      .from("users_avatars")
      .upload(fileName, file);

   if (error) {
      return { success: false, error: error.message };
   }
   const { data: urlData } = supabaseAdmin.storage
      .from("users_avatars")
      .getPublicUrl(fileName, {
         transform: {
            width: 100,
            height: 100,
            resize: "cover",
         },
      });

   return { success: true, data: urlData.publicUrl };
}
