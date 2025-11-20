"use client";
import { AllListingsParams } from "@/lib/data-access/listings";
import { useGetAllListings } from "@/hooks/useListing";
import SearchBar from "../ui/search";
import ListingCard from "./ListingCard";
import { TListing } from "@/utils/zod-schemas/listings";
import ListingsFilters from "./ListingsFilters";
import { Loader2 } from "lucide-react";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "../ui/pagination";
import { useRouter } from "next/navigation";

export default function ListingsPageClient({
   searchParams,
}: {
   searchParams: AllListingsParams;
}) {
   const { data, isLoading, error } = useGetAllListings(searchParams);
   const router = useRouter();

   const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/listings?${params.toString()}`);
   };

   return (
      <div className="w-full py-8">
         <div className="flex flex-col lg:flex-row gap-6 px-4 mx-auto">
            <div className="lg:w-64 shrink-0">
               <ListingsFilters />
            </div>

            <main className="flex-1 min-w-0 space-y-10 pb-10">
               <div className="mb-6">
                  <SearchBar className="w-full mb-4" />
                  <div className="text-sm text-gray-500">
                     {isLoading
                        ? "Loading..."
                        : `Results: ${data?.totalCount ?? 0}`}
                  </div>
               </div>

               {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12">
                     <Loader2 className="w-6 h-6 animate-spin" />
                     <span>Loading listings...</span>
                  </div>
               ) : error ? (
                  <div className="text-center py-12 text-red-500">
                     Error: {error.message}
                  </div>
               ) : !data || data.listings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                     No listings found
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {data.listings.map((listing: TListing, index: number) => (
                        <ListingCard
                           key={listing.id}
                           listing={listing}
                           preload={index < 4}
                        />
                     ))}
                  </div>
               )}
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious
                           onClick={() =>
                              handlePageChange(data?.currentPage ?? 0 - 1)
                           }
                           className={
                              data?.currentPage === 1
                                 ? "pointer-events-none opacity-50"
                                 : "cursor-pointer"
                           }
                        />
                     </PaginationItem>
                     {Array.from(
                        { length: data?.totalPages ?? 0 },
                        (_, i) => i + 1
                     ).map((page) => (
                        <PaginationItem key={page}>
                           <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={page === data?.currentPage}
                              className="cursor-pointer">
                              {page}
                           </PaginationLink>
                        </PaginationItem>
                     ))}
                     <PaginationItem>
                        <PaginationNext
                           onClick={() =>
                              handlePageChange(data?.currentPage ?? 0 + 1)
                           }
                           className={
                              data?.currentPage === data?.totalPages
                                 ? "pointer-events-none opacity-50"
                                 : "cursor-pointer"
                           }
                        />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </main>
         </div>
      </div>
   );
}
