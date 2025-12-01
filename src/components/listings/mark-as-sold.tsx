"use client";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";
import { markListingAsSoldAction } from "@/app/actions/listings";

export default function MarkAsSold({ listingId }: { listingId: string }) {
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   function handleMarkAsSold() {
      startTransition(async () => {
         const result = await markListingAsSoldAction(listingId);
         if ("error" in result) {
            setError(result.error || null);
         } else {
            setSuccess(result.success);
         }
      });
   }

   if (error) {
      return <p className="text-red-500">{error}</p>;
   }
   if (success) {
      return <p className="text-green-500">{success}</p>;
   }

   return (
      <>
         {error && <p className="text-red-500">{error}</p>}
         {success && <p className="text-green-500">{success}</p>}
         <Button
            variant="outline"
            className="flex items-center gap-2 shadow-md"
            onClick={handleMarkAsSold}
            disabled={isPending}>
            <CheckIcon className="w-4 h-4 text-green-500" />
            {isPending ? "Marking as sold..." : "Mark as Sold"}
         </Button>
      </>
   );
}
