import ListingsPageClient from "@/components/listings/ListingsPageClient";
import { AllListingsParams } from "@/lib/data-access/listings";
import { ListingCondition } from "@/utils/generated/enums";

interface ListingsPageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        search?: string;
        condition?: string;
        sortBy?: string;
        sortOrder?: string;
        minPrice?: string;
        maxPrice?: string;
    }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {    
    const params = await searchParams;
    
    const listingParams: AllListingsParams = {
        currentPage: params.page ? parseInt(params.page, 10) : 1,
        itemsPerPage: 20,
        categorySlugs: params.category ? params.category.split(",") : null,
        search: params.search || null,
        conditions: params.condition ? params.condition.split(",") as ListingCondition[] : null,
        minPrice: params.minPrice ? parseInt(params.minPrice, 10) : null,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : null,
        sortBy: (params.sortBy === "price" ? "price" : "createdAt"),
        sortOrder: (params.sortOrder === "asc" ? "asc" : "desc"),
    };

    return (
        <ListingsPageClient searchParams={listingParams} />
    );
}