import { ListingCondition } from "@/app/shared/lib/generated/enums";

export type AllListingsParams = {
    currentPage?: string | number;
    itemsPerPage?: string | number;
    categorySlugs?: string[] | null;
    condition?: ListingCondition | null;
    conditions?: ListingCondition[] | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    search?: string | null;
    sortBy?: "createdAt" | "price";
    sortOrder?: "asc" | "desc";
 };