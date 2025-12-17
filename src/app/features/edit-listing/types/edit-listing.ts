import { TCategory } from "@/utils/zod-schemas/categories";
import { ListingCondition } from "@/utils/generated/enums";

export type TEditListing = {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    location: string | null;
    condition: ListingCondition;
    category: TCategory | null;
    images?: (string | { url: string })[];
 };