import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActiveListingsTab from "../tabs/ActiveListingsTab";
import SoldItemsTab from "../tabs/SoldItemsTab";
import FavoritesListingsTab from "../tabs/FavoritesListingsTab";
import UserReviewsTab from "../tabs/UserReviewsTab";

interface ListingTabsProps {
    userId: string;
    reviewsCount: number;
    activeListingsCount: number;
    soldListingsCount: number;
    favoritesListingsCount: number;
    showFavorites: boolean;
}

export default function ListingTabs({ userId, reviewsCount, activeListingsCount, soldListingsCount, favoritesListingsCount, showFavorites }: ListingTabsProps) {
    return (
        <Tabs defaultValue="active">
            <TabsList className="mb-4">
                <TabsTrigger value="active">Active Listings ({activeListingsCount})</TabsTrigger>
                <TabsTrigger value="sold">Sold Items ({soldListingsCount})</TabsTrigger>
                {showFavorites && <TabsTrigger value="favorites">Favorites ({favoritesListingsCount})</TabsTrigger>}
                <TabsTrigger value="reviews">Reviews ({reviewsCount ?? 0})</TabsTrigger>
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
