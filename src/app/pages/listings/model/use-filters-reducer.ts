import { ListingCondition } from "@/utils/generated/enums";

export type FiltersState = {
   categories: string[];
   conditions: ListingCondition[];
   priceRange: [number, number];
};

export type FilterActions =
   | { type: "SET_CATEGORIES"; payload: string[] }
   | { type: "SET_CONDITIONS"; payload: ListingCondition[] }
   | { type: "SET_PRICE_RANGE"; payload: [number, number] }
   | { type: "CLEAR_FILTERS" };

export const initialState: FiltersState = {
   categories: [],
   conditions: [],
   priceRange: [0, 10000],
};

export function filtersReducer(
   state: FiltersState,
   action: FilterActions
): FiltersState {
   switch (action.type) {
      case "SET_CATEGORIES":
         return {
            ...state,
            categories: action.payload,
         };
      case "SET_CONDITIONS":
         return {
            ...state,
            conditions: action.payload,
         };
      case "SET_PRICE_RANGE":
         return {
            ...state,
            priceRange: action.payload,
         };
      case "CLEAR_FILTERS":
         return {
            ...initialState
         };
      default:
         return state;
   }
}
