import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
   return (
      <div className="flex flex-col space-y-32 py-16">
         <section className="w-full">
            <div className="container mx-auto px-4">
               <div className="flex flex-col gap-3 items-center justify-center">
                  <Skeleton className="h-12 w-full max-w-2xl" />
                  <Skeleton className="h-5 w-full max-w-xl" />
                  <Skeleton className="h-12 w-full max-w-xl mt-10" />
               </div>
            </div>
         </section>
         <section className="w-full">
            <div className="container mx-auto">
               <Skeleton className="h-8 w-48 mx-auto mb-8" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
               {Array.from({ length: 7 }).map((_, index) => (
                  <div
                     key={index}
                     className="border rounded-lg p-6 h-full flex flex-col items-center">
                     <Skeleton className="h-14 w-14 rounded-full mb-2" />
                     <Skeleton className="h-5 w-20" />
                  </div>
               ))}
            </div>
         </section>

         <section className="py-16 w-full">
            <div className="container mx-auto px-4">
               <Skeleton className="h-8 w-48 mb-8" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                     <div
                        key={index}
                        className="border rounded-lg overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-3">
                           <Skeleton className="h-5 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                           <Skeleton className="h-6 w-1/3" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
}
