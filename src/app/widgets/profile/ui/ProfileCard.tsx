"use client";
import { CalendarIcon, StarIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { Button, Card, CardContent, Separator, Avatar, AvatarFallback, AvatarImage } from "@/app/shared/ui";
import { TUserProfile } from "@/app/features/edit-profile/types/edit-profile-types";
import AvatarUpload from "@/app/features/avatar-upload/ui/avatar-upload";
import EditProfileForm from "@/app/features/edit-profile/ui/edit-profile-form";
import DateFormatter from "@/app/shared/lib/date-formatter";
import { useTranslations } from "next-intl";
import { Link } from "@/pkg/i18n/navigation";

interface ProfileCardProps {
   user: TUserProfile;
   isOwner: boolean;
   stats: {
      averageRating: number;
      activeListingsCount: number;
      itemsSoldCount: number;
      totalReviewsCount: number;
   }
}

export default function ProfileCard({
   user,
   stats,
   isOwner,
}: ProfileCardProps) {
   const t = useTranslations("profilePage");
   const tCommon = useTranslations("common");
   return (
      <Card className="w-full">
         <CardContent className="flex items-center gap-6 py-4 px-6">
            <div className="flex items-center gap-4">
               {isOwner && <AvatarUpload currentAvatarUrl={user.avatarImg} />}

               {!isOwner && (
                  <Avatar className="size-20 rounded-full shadow-sm">
                     <AvatarImage
                        src={user.avatarImg || ""}
                        className="rounded-full"
                     />
                     <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
               )}
            </div>
            <div className="flex flex-col gap-2 w-full">
               <div className="flex items-center justify-between w-full">
                  <h2>{user.name}</h2>
                  <div className="flex items-center gap-2">
                     {isOwner && <EditProfileForm user={user} />}
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2  text-neutral-500">
                     <MapPinIcon className="size-4" />
                     <p>{user.location ?? tCommon("noLocationSet")}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                     <CalendarIcon className="size-4" />
                     <p>
                        {tCommon("joined")}: {" "}
                        {user.createdAt ? DateFormatter({ date: user.createdAt }) : "N/A"}
                     </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                     <StarIcon className="size-4 text-yellow-500 fill-current" />
                     <p>
                        {tCommon("rating")}{" "}
                        {stats.averageRating
                           ? stats.averageRating.toFixed(1)
                           : tCommon("noReviews")}
                     </p>
                  </div>
                  {!isOwner && (
                  <div className="ml-auto">
                     <Link href={`/messages/${user.id}`}>
                        <Button>
                           <MessageCircleIcon className="size-4" />
                           {t("sendMessage")}
                        </Button>
                     </Link>
                     </div>
                     )}
               </div>
            </div>
         </CardContent>
         <Separator />
         <CardContent className="flex justify-evenly gap-4">
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">
                  {t("activeListings")}
               </h3>
               <p>{stats.activeListingsCount}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">
                  {t("itemsSold")}
               </h3>
               <p>{stats.itemsSoldCount}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">
                  {t("totalReviews")}
               </h3>
               <p>{stats.totalReviewsCount}</p>
            </div>
         </CardContent>
      </Card>
   );
}
