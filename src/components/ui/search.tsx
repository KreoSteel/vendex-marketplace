"use client";
import { Input } from "./input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SearchBar({ className }: { className?: string }) {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get("search") as string;
        if (search) {
            router.push(`/listings?search=${search}&page=1&sortBy=createdAt&sortOrder=desc`);
        }
        else {
            router.push("/listings?page=1&sortBy=createdAt&sortOrder=desc");
        }
    }
    return (
            <form onSubmit={handleSearch} className="relative w-full">
                <Input type="text" name="search" placeholder="Search" className={cn("w-full pl-8 shadow-sm rounded-lg border border-neutral-200 h-10 font-medium bg-white", className)} />
                <SearchIcon className="size-4 absolute inset-y-0 left-2 my-auto text-neutral-600" />
            </form>
    )
}