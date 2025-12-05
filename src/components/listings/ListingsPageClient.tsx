"use client";
import { AllListingsParams } from "@/lib/data-access/listings";
import SearchBar from "../ui/search";
import ListingCard from "../cards/ListingCard";
import { TListing, TListingsCard } from "@/utils/zod-schemas/listings";
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
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/utils/auth-client";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { allListingsOptions } from "@/lib/query-options/listings";

export default function ListingsPageClient({
   searchParams,
}: {
   searchParams: AllListingsParams;
}) {
   const tPagination = useTranslations("searchListingsPage.pagination");
   const tCommon = useTranslations("common");
   const tSearchListingsPage = useTranslations("searchListingsPage");
   const { data: session } = authClient.useSession();
   const { data: favorites } = useQuery({
      ...userFavoriteListingsOptions(session?.user?.id ?? ""),
      enabled: !!session?.user?.id,
   });
   const favoriteIds = new Set(favorites?.map(f => f.id) ?? []);

   const { data, isLoading, error } = useQuery(allListingsOptions(searchParams));
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
               <div className="mb-6 flex flex-col gap-3">
                  <SearchBar className="w-full" />
                  <div className="text-sm text-gray-500">
                     {isLoading
                        ? tCommon("loading")
                        : `${tSearchListingsPage("results")} ${data?.totalCount ?? 0}`}
                  </div>
               </div>

               {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12">
                     <Loader2 className="w-6 h-6 animate-spin" />
                     <span>{tCommon("loading")}</span>
                  </div>
               ) : error ? (
                  <div className="text-center py-12 text-red-500">
                     {tCommon("error")}: {error.message}
                  </div>
               ) : !data || data.listings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                     {tCommon("noListingsFound")}
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {data.listings.map((listing: TListingsCard, index: number) => (
                        <ListingCard
                           key={listing.id}
                           listing={listing as TListing}
                           preload={index < 4}
                           isFavorite={favoriteIds.has(listing.id)}
                        />
                     ))}
                  </div>
               )}
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious
                           tPagination={tPagination}
                           onClick={() =>
                              handlePageChange((data?.currentPage ?? 1) - 1)
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
                           tPagination={tPagination}
                           onClick={() =>
                              handlePageChange((data?.currentPage ?? 1) + 1)
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
