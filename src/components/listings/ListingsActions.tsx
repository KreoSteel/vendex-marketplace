import { Link } from "@/pkg/i18n/navigation";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import ToggleFavorite from "../../app/features/favorites/ui/ToggleFavorite";
import CreateReviewForm from "../forms/CreateReviewForm";
import DeleteListing from "../../app/features/listings/ui/DeleteListing";
import EditListingForm, { TEditListing } from "../forms/EditListingForm";
import MarkAsSold from "./mark-as-sold";
import { Separator } from "../ui/separator";
import { MapPinIcon, StarIcon } from "lucide-react";
import { TListing } from "@/utils/zod-schemas/listings";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

interface ListingsActionsProps {
   listing: TListing;
   isOwner: boolean;
   currentUser: string;
}

export default function ListingsActions({
   listing,
   isOwner,
   currentUser,
}: ListingsActionsProps) {
   const t = useTranslations("listingDetailsPage");
   const userId = listing?.user?.id;
   if (!userId) {
      return notFound();
   }

   const isLoggedIn = currentUser && currentUser.trim() !== "";
   const isNotSold = listing.status !== "SOLD";
   const canInteract = isNotSold && isLoggedIn;

   return (
      <Card className="shadow-md flex flex-col gap-2">
         <CardHeader className="space-y-4">
            <div className="flex justify-between items-center gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                     {t("price")}
                  </p>
                  <h2 className="text-4xl font-bold text-green-600">
                     {listing?.price
                        ? `€${listing?.price.toLocaleString()}`
                        : "€0"}
                  </h2>
               </div>
               <div className="flex flex-col items-center gap-2">
                  {listing?.featured && (
                     <div className="flex items-center gap-2 text-gray-600">
                        <StarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                           {t("featured")}
                        </span>
                     </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                     <MapPinIcon className="w-4 h-4" />
                     <span className="text-sm font-medium">
                        {listing?.location}
                     </span>
                  </div>
               </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-2">
               {isOwner && (
                  <>
                     <EditListingForm
                        key={listing.updatedAt.toString()}
                        listing={listing as TEditListing}
                     />
                     <DeleteListing listingId={listing.id} />
                     <MarkAsSold listingId={listing.id} />
                  </>
               )}
               {!isOwner && (
                  <>
                     <CreateReviewForm
                        listingId={listing.id}
                        revieweeId={userId}
                     />
                     <ToggleFavorite
                        listingId={listing.id}
                        className="shadow-md"
                     />
                     <Link href={`/messages/${userId}`}>
                        <Button className="flex-1 shadow-md cursor-pointer">
                           {t("contactSeller")}
                        </Button>
                     </Link>
                  </>
               )}
            </div>
         </CardHeader>
      </Card>
   );
}
