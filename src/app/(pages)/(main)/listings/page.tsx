import ListingsPageClient from "@/components/listings/ListingsPageClient";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AllListingsParams } from "@/lib/data-access/listings";
import { allListingsOptions } from "@/lib/queries/listings";
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
    const queryClient = getQueryClient();
    
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

    await queryClient.prefetchQuery(allListingsOptions(listingParams));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ListingsPageClient searchParams={listingParams} />
        </HydrationBoundary>
    );
}