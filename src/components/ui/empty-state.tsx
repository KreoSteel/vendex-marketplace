import { Package } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-8 text-neutral-700 flex flex-col items-center justify-center">
                <Package className="size-8 mb-2" />
                No listings found.
            </h2>
        </div>
    )
}