import { useQuery, queryOptions } from "@tanstack/react-query";
import { getAllCategories } from "@/lib/data-access/category";


export const categoriesOptions = queryOptions({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 60 * 5 * 1000,
})

export const useGetCategories = () => {
    return useQuery(categoriesOptions);
}