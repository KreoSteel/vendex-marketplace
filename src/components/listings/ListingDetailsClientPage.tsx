"use client";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { notFound } from "next/navigation";
import { useRouter } from "@/pkg/i18n/navigation";
import ImageSlider from "../ui/image-slider";
import { useTranslations } from "next-intl";
import { TListing } from "@/utils/zod-schemas/listings";
import ListingInfo from "./ListingInfo";
import ListingsActions from "./ListingsActions";
import SellerCard from "../../app/entities/listings/ui/SellerCard";

interface ListingDetailsClientPageProps {
   listing: TListing;
   stats: {
      activeListingsCount: number;
      itemsSoldCount: number;
      averageRating: number;
   }
   currentUser: string;
}

export default function ListingDetailsClientPage({
   listing,
   stats,
   currentUser,
}: ListingDetailsClientPageProps) {
   const t = useTranslations("listingDetailsPage");
   const userId = listing?.user?.id;
   const isOwner = userId === currentUser;
   const router = useRouter();

   if (!listing) {
      return notFound();
   }

   if (!userId) {
      return notFound();
   }

   return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
         <Button
            variant="outline"
            className="w-fit shadow-md cursor-pointer mb-4"
            onClick={() => router.back()}>
            <ArrowLeftIcon className="w-4 h-4" />
            {t("backToListings")}
         </Button>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="relative w-full aspect-3/2 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                  <ImageSlider
                     slides={listing?.images.map((image) => image.url).filter((url) => typeof url === "string" && url.trim() !== "") || []}
                  />
               </div>
               <ListingInfo listing={listing} />
            </div>
            <div className="lg:col-span-1">
               <div className="sticky top-18 space-y-4">
                  <ListingsActions
                     listing={listing}
                     isOwner={isOwner}
                     currentUser={currentUser}
                  />
                  <SellerCard
                     listing={listing}
                     activeListingsCount={stats.activeListingsCount}
                     itemsSoldCount={stats.itemsSoldCount}
                     averageRating={stats.averageRating}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
