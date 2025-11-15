import { useQuery, queryOptions } from "@tanstack/react-query";
import { getCategoryNames } from "@/lib/data-access/category";

export const getCategoriesNames = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    return data;
}

export const categoriesOptions = queryOptions({
    queryKey: ["categories-names"],
    queryFn: async () => {
        return await getCategoriesNames();
    },
    staleTime: 60 * 5,
})

export const useGetCategoriesNames = () => {
    return useQuery(categoriesOptions);
}