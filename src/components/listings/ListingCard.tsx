import { TListing } from "@/utils/zod-schemas/listings";
import Image from "next/image";
import ToggleFavorite from "@/components/favorites/ToggleFavorite";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ListingCardProps {
   listing: TListing;
   preload?: boolean;
}

export default function ListingCard({ listing, preload = false }: ListingCardProps) {
   return (
      <Link href={`/listings/${listing.id}`}>
      <div className="flex flex-col bg-white hover:bg-neutral-100/50 rounded-lg overflow-hidden shadow-md hover:translate-y-[-4px] transition-all duration-300 group/card">
         <div className="relative w-full h-[200px] overflow-hidden">
            <Image 
               src={listing.images[0].url}
               alt={listing.title}
               fill
               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
               className="object-cover"
               loading={preload ? "eager" : "lazy"}
               fetchPriority={preload ? "high" : "auto"}
            />
         </div>
         <div className="flex flex-col gap-2 p-4 min-h-[180px] justify-between">
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                     {listing.title}
                  </h3>
                  <h2 className="text-lg font-bold text-gray-900">
                     {listing.price ? `${listing.price.toLocaleString()} €` : "0 €"}
                  </h2>
               </div>
               <div className="flex items-center gap-2 relative z-10" onClick={(e) => e.preventDefault()}>
                  <ToggleFavorite listingId={listing.id} className="hover:bg-transparent" />
               </div>
            </div>
            <div className="text-xs text-gray-500 flex justify-between items-center">
               <span className="truncate">{listing.location || "Location not specified"}</span>
               <span className="shrink-0 ml-2">
                  {listing.createdAt ? format(new Date(listing.createdAt), "d MMM yyyy") : "N/A"}
               </span>
            </div>
            </div>
         </div>
      </Link>
   );
}
