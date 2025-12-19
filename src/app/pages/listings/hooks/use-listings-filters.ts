"use client";
import { useReducer } from "react";
import { filtersReducer, initialState } from "./use-filters-reducer";
import { categoriesOptions } from "@/app/entities/category/model/queries";
import { useQuery } from "@tanstack/react-query";
import { ListingCondition } from "@/utils/generated/enums";
import { useRouter } from "@/pkg/i18n/navigation";


export function useListingsFilters() {
    const [state, dispatch] = useReducer(filtersReducer, initialState);
    const { data: categories } = useQuery(categoriesOptions);
    const router = useRouter();

    function handleCategoryChange(categorySlugs: string[]) {
        dispatch({ type: "SET_CATEGORIES", payload: categorySlugs})
    }

    function handleConditionChange(conditions: ListingCondition[]) {
        dispatch({ type : "SET_CONDITIONS", payload: conditions})
    }

    function handlePriceRangeChange(priceRange: [number, number]) {
        dispatch({ type: "SET_PRICE_RANGE", payload: priceRange})
    }

    function clearFilters() {
        dispatch({ type: "CLEAR_FILTERS"})
        router.push("/listings");
    }

    return {
        state,
        dispatch,
        categories,
        handleCategoryChange,
        handleConditionChange,
        handlePriceRangeChange,
        clearFilters,
    }
}