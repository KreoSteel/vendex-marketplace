import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import DateFormatter from "../../../shared/lib/date-formatter";
import { TListing } from "@/utils/zod-schemas/listings";
import { useRouter } from "@/pkg/i18n/navigation";

interface SellerCardProps {
   listing: TListing;
   activeListingsCount: number;
   itemsSoldCount: number;
   averageRating: number;
}

export default function SellerCard({
   listing,
   activeListingsCount,
   itemsSoldCount,
   averageRating,
}: SellerCardProps) {
   const t = useTranslations("listingDetailsPage");
   const router = useRouter();
   const handleViewProfile = () => {
      router.push(`/profile/${listing?.user.id}`);
   };
   
   return (
      <Card className="shadow-md flex flex-col gap-2">
         <CardHeader>
            <CardTitle>
               <h2 className="text-2xl font-bold">{t("sellerInformation")}</h2>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex items-center gap-3">
               <Avatar className="w-14 h-14">
                  <AvatarImage src={listing?.user.avatarImg || ""} />
                  <AvatarFallback>
                     {listing?.user.name?.charAt(0) || t("unknownUser")}
                  </AvatarFallback>
               </Avatar>
               <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900">
                     {listing?.user.name}
                  </h3>
                  <p className="text-base text-gray-500">
                     {t("memberSince")}:{" "}
                     {listing?.user.createdAt
                        ? DateFormatter({
                             date: listing.user.createdAt,
                          })
                        : t("unknownUser")}
                  </p>
               </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
               <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-600">
                     {t("activeListings")}
                  </p>
                  <p>{activeListingsCount}</p>
               </div>
               <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-600">{t("itemsSold")}</p>
                  <p>{itemsSoldCount}</p>
               </div>
               <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-600">
                     {t("overallRating")}
                  </p>
                  <div className="flex items-center gap-2">
                     <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                     <span>{averageRating || t("noRating")}</span>
                  </div>
               </div>
               <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-600">{t("location")}</p>
                  <p>{listing?.user.location}</p>
               </div>
            </div>

            <Separator className="mt-4 mb-6" />

            <Button
               variant="outline"
               className="w-full shadow-md cursor-pointer"
               onClick={handleViewProfile}>
               {t("viewProfile")}
            </Button>
         </CardContent>
      </Card>
   );
}
