import { TListing } from "@/utils/zod-schemas/listings";
import Image from "next/image";
import { HeartIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
   listing: TListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
   return (
      <div className="flex flex-col bg-white hover:bg-neutral-100/50 rounded-lg overflow-hidden shadow-md hover:translate-y-[-4px] transition-all duration-300">
         <div className="relative w-full h-[200px] overflow-hidden">
            <Image
               src={listing.images[0].url}
               alt={listing.title}
               fill
               className=""
            />
         </div>
         <div className="flex flex-col gap-2 p-4 min-h-[180px] justify-between">
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                     {listing.title}
                  </h3>
                  <h2 className="text-lg font-bold text-gray-900">
                     {listing.price.toLocaleString()} €
                  </h2>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                     <HeartIcon className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                  </Button>
               </div>
            </div>
            <div className="text-xs text-gray-500 flex justify-between items-center">
               <span className="truncate">{listing.location}</span>
               <span className="shrink-0 ml-2">{format(listing.createdAt, "d MMM yyyy")}</span>
            </div>
         </div>
      </div>
   );
}
