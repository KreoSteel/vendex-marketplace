import { Card, CardContent } from "@/app/shared/ui/card";
import { Separator } from "@/app/shared/ui/separator";
import { Skeleton } from "@/app/shared/ui/skeleton";
import ListingPageSkeleton from "@/app/pages/listings/ui/listing-page-skeleton";

export default function ProfileLoading() {
   return (
      <div className="container max-w-6xl mx-auto py-6 flex flex-col gap-6">
         <Card className="w-full">
            <CardContent className="flex items-center gap-6 py-4 px-6">
               <div className="flex items-center gap-4">
                  <Skeleton className="size-20 rounded-full" />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full">
                     <Skeleton className="h-7 w-48" />
                     <Skeleton className="h-9 w-24" />
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                     </div>
                     <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-40" />
                     </div>
                     <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                     </div>
                     <div className="ml-auto">
                        <Skeleton className="h-9 w-32" />
                     </div>
                  </div>
               </div>
            </CardContent>
            <Separator />
            <CardContent className="flex justify-evenly gap-4">
               <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-8" />
               </div>
               <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-8" />
               </div>
               <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-8" />
               </div>
            </CardContent>
         </Card>

         <div className="flex flex-col gap-4">
            <div className="bg-muted inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] gap-1">
               <Skeleton className="h-[calc(100%-1px)] w-32 rounded-md" />
               <Skeleton className="h-[calc(100%-1px)] w-28 rounded-md" />
               <Skeleton className="h-[calc(100%-1px)] w-24 rounded-md" />
               <Skeleton className="h-[calc(100%-1px)] w-20 rounded-md" />
            </div>
            <ListingPageSkeleton />
         </div>
      </div>
   );
}