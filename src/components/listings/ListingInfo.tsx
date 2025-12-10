import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { TListing } from "@/utils/zod-schemas/listings";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";

export default function ListingInfo({ listing }: { listing: TListing }) {
   const t = useTranslations("listingDetailsPage");
   const tConditions = useTranslations("conditions");
   return (
    <Card className="shadow-sm">
    <CardHeader className="space-y-4">
       <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
             {listing?.title}
          </h1>
       </div>

       <Separator />

       <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
             {t("description")}
          </h2>
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
             {listing?.description}
          </p>

          <Separator className="my-6" />

          <div className="space-y-4">
             <h2 className="text-lg font-semibold text-gray-900">
                {t("details")}
             </h2>
             <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                   <p className="text-sm font-medium text-gray-500">
                      {t("condition")}
                   </p>
                   <p className="text-base font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-lg border border-primary-200 inline-block">
                      {tConditions(
                         "labels." + listing?.condition
                      )}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-gray-500">
                      {t("category")}
                   </p>
                   <p className="text-base font-medium text-gray-900">
                      {listing?.category?.name}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-gray-500">
                      {t("location")}
                   </p>
                   <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4 text-gray-600" />
                      <p className="text-base font-medium text-gray-900">
                         {listing?.location}
                      </p>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-gray-500">
                      {t("posted")}
                   </p>
                   <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-gray-600" />
                      <p className="text-base font-medium text-gray-900">
                         {listing?.createdAt.toLocaleDateString()}
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </CardHeader>
 </Card>
   );
}