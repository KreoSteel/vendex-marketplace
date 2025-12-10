"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";
import { markListingAsSoldAction } from "@/app/actions/listings";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function MarkAsSold({ listingId }: { listingId: string }) {
   const [isPending, startTransition] = useTransition();
   const tButtons = useTranslations("buttons");

   function handleMarkAsSold() {
      startTransition(async () => {
         const result = await markListingAsSoldAction(listingId);
         if (result.success) {
            toast.success(result.data?.message);
         } else if (result.error) {
            toast.error(result.error);
         }
      });
   }

   return (
      <>
         <Button
            variant="outline"
            className="flex items-center gap-2 shadow-md"
            onClick={handleMarkAsSold}
            disabled={isPending}>
            <CheckIcon className="w-4 h-4 text-green-500" />
            {isPending ? tButtons("markingAsSold") : tButtons("markAsSold")}
         </Button>
      </>
   );
}
