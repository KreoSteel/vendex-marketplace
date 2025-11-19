import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActiveListingsTab from "./tabs/ActiveListingsTab";
import SoldItemsTab from "./tabs/SoldItemsTab";
import FavoritesListingsTab from "./tabs/FavoritesListingsTab";

interface ListingTabsProps {
    userId: string;
    activeListingsCount: number;
    soldListingsCount: number;
    favoritesListingsCount: number;
}

export default function ListingTabs({ userId, activeListingsCount, soldListingsCount, favoritesListingsCount }: ListingTabsProps) {
    return (
        <Tabs defaultValue="active">
            <TabsList className="mb-4">
                <TabsTrigger value="active">Active Listings ({activeListingsCount})</TabsTrigger>
                <TabsTrigger value="sold">Sold Items ({soldListingsCount})</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({favoritesListingsCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
                <ActiveListingsTab userId={userId} />
            </TabsContent>
            <TabsContent value="sold">
                <SoldItemsTab userId={userId} />
            </TabsContent>
            <TabsContent value="favorites">
                <FavoritesListingsTab userId={userId} />
            </TabsContent>
        </Tabs>
    )
}
