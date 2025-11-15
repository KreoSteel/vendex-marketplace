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

