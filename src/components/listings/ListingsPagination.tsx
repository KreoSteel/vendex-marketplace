"use client";

import { useTranslations } from "next-intl";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "../ui/pagination";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function ListingsPagination({
   currentPage,
   totalPages,
}: {
   currentPage: number;
   totalPages: number;
}) {
   const tPagination = useTranslations("searchListingsPage.pagination");
   const searchParams = useSearchParams();
   const router = useRouter();
   
   const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/listings?${params.toString()}`);
   };

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <PaginationPrevious
                  tPagination={tPagination}
                  onClick={() => handlePageChange((currentPage ?? 1) - 1)}
                  className={
                     currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                  }
               />
            </PaginationItem>
            {Array.from({ length: totalPages ?? 0 }, (_, i) => i + 1).map(
               (page) => (
                  <PaginationItem key={page}>
                     <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer">
                        {page}
                     </PaginationLink>
                  </PaginationItem>
               )
            )}
            <PaginationItem>
               <PaginationNext
                  tPagination={tPagination}
                  onClick={() => handlePageChange((currentPage ?? 1) + 1)}
                  className={
                     currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                  }
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
}
