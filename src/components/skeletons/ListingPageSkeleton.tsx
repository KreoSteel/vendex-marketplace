import { Skeleton } from "@/app/shared/ui";

export default function ListingPageSkeleton() {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {Array.from({ length: 12 }).map((_, index) => (
            <div
               key={index}
               className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md">
               <Skeleton className="w-full h-[200px]" />

               <div className="flex flex-col gap-2 p-4 min-h-[180px] justify-between">
                  <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/3 mt-1" />
                     </div>

                     <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  </div>

                  <div className="flex justify-between items-center">
                     <Skeleton className="h-3 w-24" />
                     <Skeleton className="h-3 w-20" />
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}