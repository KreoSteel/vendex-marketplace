import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, StarIcon } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "@/lib/data-access/profile";
import AvatarUpload from "./AvatarUpload";
import EditProfileForm from "./EditProfileForm";
import type { User } from "@/utils/generated/client";

interface ProfileCardProps {
   user: User;
   activeListingsCount: number;
   itemsSoldCount: number;
   totalReviewsCount: number;
}

export default async function ProfileCard({ user, activeListingsCount, itemsSoldCount, totalReviewsCount }: ProfileCardProps) {
   return (
      <Card className="w-full">
         <CardContent className="flex items-center gap-6 py-4 px-6">
            <div className="flex items-center gap-4">
               <AvatarUpload currentAvatarUrl={user.avatarImg} />
            </div>
            <div className="flex flex-col gap-2 w-full">
               <div className="flex items-center justify-between w-full">
                  <h2>{user.name}</h2>
                  <EditProfileForm user={user} />
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2  text-neutral-500">
                     <MapPinIcon className="size-4" />
                     <p>{user.location ?? "No location set"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                     <CalendarIcon className="size-4" />
                     <p>
                        {" "}
                        Joined{" "}
                            {format(user.createdAt || new Date(), "d MMM yyyy")}
                     </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                     <StarIcon className="size-4 text-yellow-500 fill-current" />
                     <p>Rating: 4.5</p>
                  </div>
               </div>
            </div>
         </CardContent>
         <Separator />
         <CardContent className="flex justify-evenly gap-4">
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">Active Listings</h3>
               <p>{activeListingsCount}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">Items Sold</h3>
               <p>{itemsSoldCount}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm text-neutral-500 font-medium">Total Reviews</h3>
               <p>{totalReviewsCount}</p>
            </div>
         </CardContent>
      </Card>
   );
}
