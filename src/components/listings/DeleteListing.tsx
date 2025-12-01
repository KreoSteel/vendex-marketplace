import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { deleteListingAction } from "@/app/actions/listings";
import { useState, useTransition } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
   DialogTrigger,
   DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function DeleteListing({ listingId }: { listingId: string }) {
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const router = useRouter();


   function handleDelete() {
      startTransition(async () => {
         const result = await deleteListingAction(listingId);
         if ("error" in result) {
            setError(result.error || null);
         } else {
            setSuccess(result.success);
            router.push("/profile");
         }
      });
   }
   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 shadow-md">
               <TrashIcon className="w-4 h-4 text-red-500" />
               Delete Listing
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Delete Listing</DialogTitle>
               <DialogDescription>
                  Are you sure you want to delete this listing? <br />
                  This action cannot be undone.
               </DialogDescription>
               {error && <p className="text-red-500">{error}</p>}
               {success && <p className="text-green-500">{success}</p>}
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline" disabled={isPending} className="shadow-md">
                     Cancel
                  </Button>
               </DialogClose>
               <Button variant="destructive" disabled={isPending} onClick={handleDelete} className="shadow-md">
                  {isPending ? "Deleting..." : "Delete"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
