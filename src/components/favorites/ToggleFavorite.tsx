"use client";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useIsListingFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { authClient } from "@/utils/auth-client";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

interface ToggleFavoriteProps {
    listingId: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    initialFavorite?: boolean;
}

export default function ToggleFavorite({ 
    listingId, 
    className, 
    variant = "ghost", 
    size = "icon",
    initialFavorite 
}: ToggleFavoriteProps) {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    
    const { data: isFavoriteQuery, isLoading } = useIsListingFavorite(
        listingId, 
        initialFavorite === undefined && !!session?.user
    );
    
    const isFavorite = initialFavorite ?? isFavoriteQuery;
    
    const { mutate: toggle, isPending } = useToggleFavorite();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!session?.user) {
            router.push("/auth/login");
            return;
        }
        toggle(listingId);
    };

    return (
        <Button 
            variant={variant}
            size={size}
            className={cn("cursor-pointer group", className)} 
            onClick={handleToggle}
            disabled={isPending}
            type="button"
        >
            <HeartIcon 
                className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    (isFavorite) ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500",
                    isLoading && "opacity-50"
                )} 
            />
        </Button>
    )
}
