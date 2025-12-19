import ListingsPageClient from "@/app/pages/listings/listings-client-page";
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

export const revalidate = 120;

export default async function ListingsPage({ searchParams }: ListingsPageProps) {    
    const params = await searchParams;
    const minPrice = params.minPrice ? Number(params.minPrice) : null;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;
    
    const listingParams: AllListingsParams = {
        currentPage: params.page ? parseInt(params.page, 10) : 1,
        itemsPerPage: 20,
        categorySlugs: params.category ? params.category.split(",") : null,
        search: params.search || null,
        conditions: params.condition ? params.condition.split(",") as ListingCondition[] : null,
        minPrice: minPrice !== null && Number.isFinite(minPrice) ? minPrice : null,
        maxPrice: maxPrice !== null && Number.isFinite(maxPrice) ? maxPrice : null,
        sortBy: (params.sortBy === "price" ? "price" : "createdAt"),
        sortOrder: (params.sortOrder === "asc" ? "asc" : "desc"),
    };

    return (
        <ListingsPageClient searchParams={listingParams} />
    );
}