import { Input } from "./input";
import { SearchIcon } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="relative w-full max-w-xl shadow-sm rounded-lg border border-neutral-200">
            <Input type="text" placeholder="Search" className="w-full pl-8 relative py-6 font-semibold bg-white" />
            <SearchIcon className="size-4 absolute inset-y-0 left-2 my-auto text-neutral-600" />
        </div>
    )
}