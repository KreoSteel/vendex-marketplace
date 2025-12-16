import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Smartphone,
  Car,
  Home,
  Shirt,
  Sprout,
  Dumbbell,
  Book,
  Dog,
  Wrench,
  Briefcase,
  Building2,
  Baby,
  Package,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { Filters, getMaxPrice } from "../../../lib/data-access/listings";
import { queryOptions } from "@tanstack/react-query";

export const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Car,
  Home,
  Shirt,
  Sprout,
  Dumbbell,
  Book,
  Dog,
  Wrench,
  Briefcase,
  Building2,
  Baby,
  Package,
  Gift,
};


export function getIconForCategory(iconName: string | null | undefined) {
  if (!iconName) return Package;

  return iconMap[iconName] || Package;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMaxPriceForFiltersOptions(params: Filters) {
  return queryOptions({
    queryKey: ["max-price", params],
    queryFn: () => getMaxPrice(params),
    staleTime: 60 * 5 * 1000,
  });
}