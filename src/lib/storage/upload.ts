import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/utils/zod-schemas/env/server";
import { clientEnv } from "@/utils/zod-schemas/env/client";

const supabaseAdmin = createClient(
   clientEnv.NEXT_PUBLIC_SUPABASE_URL,
   serverEnv.SUPABASE_SERVICE_ROLE_KEY
);

export async function uploadListingImages(files: File[], userId: string) {
   const urls: string[] = [];

   for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      const fileName = `${userId}-${file.name}-${Date.now()}-${i}`;

      const { error } = await supabaseAdmin.storage
         .from("listing_images")
         .upload(fileName, file);

      if (error) {
         return { error: error.message };
      }
      const { data: urlData } = supabaseAdmin.storage
         .from("listing_images")
         .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
   }

   return { urls };
}

export async function uploadProfileImage(file: File, userId: string) {
   const fileName = `${userId}-${file.name}-${Date.now()}`;

   const { error } = await supabaseAdmin.storage
      .from("users_avatars")
      .upload(fileName, file);

   if (error) {
      return { error: error.message };
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

   return { url: urlData.publicUrl };
}
