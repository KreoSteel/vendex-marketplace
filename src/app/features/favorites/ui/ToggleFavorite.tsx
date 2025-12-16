"use client";
import { Button } from "@/app/shared/ui/button";
import { HeartIcon } from "lucide-react";
import { useIsListingFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { cn } from "@/app/shared/utils/utils";

interface ToggleFavoriteProps {
   listingId: string;
   className?: string;
   initialFavorite?: boolean;
}

export default function ToggleFavorite({
   listingId,
   className,
   initialFavorite,
}: ToggleFavoriteProps) {
   const { data: isFavoriteQuery, isLoading } = useIsListingFavorite(
      listingId,
      initialFavorite === undefined
   );
   const { mutate: toggleFav, isPending } = useToggleFavorite();
   const isFavorite = initialFavorite ?? isFavoriteQuery;

   const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFav(listingId);
   };

   return (
      <Button
         variant="outline"
         size="default"
         className={cn("cursor-pointer group", className)}
         onClick={handleToggle}
         disabled={isPending}
         type="button">
         <HeartIcon
            className={cn(
               "w-5 h-5 shrink-0 transition-colors",
               isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 group-hover:text-red-500",
               isLoading && "opacity-50"
            )}
         />
      </Button>
   );
}
