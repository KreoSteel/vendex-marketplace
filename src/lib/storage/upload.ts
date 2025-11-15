import { supabase } from "@/utils/supabase";

export async function uploadImages(files: File[], userId: string) {
   const urls: string[] = [];

   for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      const fileName = `${userId}-${file.name}-${Date.now()}-${i}`;

      const { data, error } = await supabase.storage
         .from("listing_images")
         .upload(fileName, file);

      if (error) {
         return { error: error.message };
      }

      const { data: urlData } = supabase.storage
         .from("listing_images")
         .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
   }

   return { urls };
}
