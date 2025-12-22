import { X } from "lucide-react";
import { Button } from "@/app/shared/ui";
import Image from "next/image";

type PreviewImage = |
   { file: File; url: string; type: "new" } |
   { url: string; type: "existing" };

interface PreviewImagesProps {
    images: PreviewImage[];
    handleRemove: (index: number) => void;
    alt: string;
}

export default function PreviewImages({ images, handleRemove, alt }: PreviewImagesProps) {

   return (
      <div className="flex flex-wrap gap-2">
         {images.map((image, index) => {

            const imageAlt = image.type === "new" ? alt : image.url;
            
            const key = image.type === "new" ? image.file.name + image.file.size + image.file.lastModified : image.url;

         return (
            <div key={key} className="relative w-[120px] h-[120px]">
               <Image
                  src={image.url}
                  alt={imageAlt}
                  fill
                  sizes="120px"
                  className="rounded-md object-cover"
               />
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 cursor-pointer"
                  onClick={() => handleRemove(index)}>
                  <X className="w-4 h-4 text-red-500" />
               </Button>
            </div>
         );
         })}
      </div>
   );
}
