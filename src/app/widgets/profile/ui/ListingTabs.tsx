"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/shared/ui/tabs";
import ActiveListingsTab from "./tabs/ActiveListingsTab";
import SoldItemsTab from "./tabs/SoldItemsTab";
import FavoritesListingsTab from "./tabs/FavoritesListingsTab";
import UserReviewsTab from "./tabs/UserReviewsTab";
import { useTranslations } from "next-intl";
import { useProfileContext } from "@/app/widgets/profile";

interface ListingTabsProps {
   stats: {
      reviewsCount: number;
      activeListingsCount: number;
      soldListingsCount: number;
      favoritesListingsCount: number;
   };
   showFavorites: boolean;
}

export default function ListingTabs({
   stats,
   showFavorites,
}: ListingTabsProps) {
   const t = useTranslations("profilePage");
   const { userId } = useProfileContext()

   return (
      <Tabs defaultValue="active">
         <TabsList className="mb-4">
            <TabsTrigger value="active">
               {t("activeListings")} ({stats.activeListingsCount})
            </TabsTrigger>
            <TabsTrigger value="sold">
               {t("soldItems")} ({stats.soldListingsCount})
            </TabsTrigger>
            {showFavorites && (
               <TabsTrigger value="favorites">
                  {t("favorites")} ({stats.favoritesListingsCount})
               </TabsTrigger>
            )}
            <TabsTrigger value="reviews">
               {t("reviews")} ({stats.reviewsCount})
            </TabsTrigger>
         </TabsList>
         <TabsContent value="active">
            <ActiveListingsTab userId={userId ?? ""} />
         </TabsContent>
         <TabsContent value="sold">
            <SoldItemsTab userId={userId ?? ""} />
         </TabsContent>
         {showFavorites && (
            <TabsContent value="favorites">
               <FavoritesListingsTab userId={userId ?? ""} />
            </TabsContent>
         )}
         <TabsContent value="reviews">
            <UserReviewsTab userId={userId ?? ""} />
         </TabsContent>
      </Tabs>
   );
}
