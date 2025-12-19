import { queryOptions } from "@tanstack/react-query";
import { getAllCategories } from "@/app/api/category/data-access/category";


export const categoriesOptions = queryOptions({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 60 * 5 * 1000,
})
