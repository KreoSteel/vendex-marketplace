import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileLoading() {
   return (
      <div className="flex flex-col gap-4">
         <Card className="w-full">
            <CardContent className="flex items-center gap-6 py-4 px-6">
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-6">
                     <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                     <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
               </div>
            </CardContent>
            <div className="h-px bg-gray-200" />
            <CardContent className="flex justify-evenly gap-4 py-4">
               <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
               <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
               <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
         </Card>


         <div className="flex flex-col gap-4">
            <div className="flex gap-4 border-b">
               <div className="h-10 w-32 bg-gray-200 rounded-t animate-pulse" />
               <div className="h-10 w-32 bg-gray-200 rounded-t animate-pulse" />
               <div className="h-10 w-32 bg-gray-200 rounded-t animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-2 py-16">
               <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
               <span className="text-gray-500">Loading profile...</span>
            </div>
         </div>
      </div>
   );
}