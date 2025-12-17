import { Skeleton, Card, CardContent, CardHeader } from "@/app/shared/ui";

export default function ReviewCardSkeleton() {
   return (
      <Card className="h-full border-neutral-200 flex flex-col py-3">
         <CardHeader className="p-4 flex flex-row items-start gap-3 space-y-0">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col min-w-0 flex-1 gap-2">
               <div className="flex justify-between items-start gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20 shrink-0" />
               </div>
               <Skeleton className="h-3 w-32" />
            </div>
         </CardHeader>
         <CardContent className="p-4 pt-0 space-y-2 flex-1">
            <div className="flex gap-0.5">
               {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="size-4" />
               ))}
            </div>
            <Skeleton className="h-16 w-full" />
         </CardContent>
      </Card>
   );
}

