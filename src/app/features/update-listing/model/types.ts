import { TCategory } from "@/app/entities/category";
import { ListingCondition } from "@/app/shared/lib/generated/enums";

export type TEditListing = {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    location: string | null;
    condition: ListingCondition;
    category?: TCategory | null;
    images?: (string | { url: string })[];
 };