import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActiveListingsTab from "../tabs/ActiveListingsTab";
import SoldItemsTab from "../tabs/SoldItemsTab";
import FavoritesListingsTab from "../tabs/FavoritesListingsTab";
import UserReviewsTab from "../tabs/UserReviewsTab";
import { useTranslations } from "next-intl";

interface ListingTabsProps {
    userId: string;
    reviewsCount: number;
    activeListingsCount: number;
    soldListingsCount: number;
    favoritesListingsCount: number;
    showFavorites: boolean;
}

export default function ListingTabs({ userId, reviewsCount, activeListingsCount, soldListingsCount, favoritesListingsCount, showFavorites }: ListingTabsProps) {
    const t = useTranslations("profilePage");
    return (
        <Tabs defaultValue="active">
            <TabsList className="mb-4">
                <TabsTrigger value="active">{t("activeListings")} ({activeListingsCount})</TabsTrigger>
                <TabsTrigger value="sold">{t("soldItems")} ({soldListingsCount})</TabsTrigger>
                {showFavorites && <TabsTrigger value="favorites">{t("favorites")} ({favoritesListingsCount})</TabsTrigger>}
                <TabsTrigger value="reviews">{t("reviews")} ({reviewsCount ?? 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
                <ActiveListingsTab userId={userId} />
            </TabsContent>
            <TabsContent value="sold">
                <SoldItemsTab userId={userId} />
            </TabsContent>
            {showFavorites && <TabsContent value="favorites">
                <FavoritesListingsTab userId={userId} />
            </TabsContent>}
            <TabsContent value="reviews">
                <UserReviewsTab userId={userId} />
            </TabsContent>
        </Tabs>
    )
}
