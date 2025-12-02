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
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function DeleteListing({ listingId }: { listingId: string }) {
   const [isPending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const tButtons = useTranslations("buttons");
   const tDialogs = useTranslations("dialogs.deleteListing");
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
               {tButtons("deleteListing")}
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{tDialogs("title")}</DialogTitle>
               <DialogDescription>
                  {tDialogs("description")} <br />
                  {tDialogs("cannotUndo")}
               </DialogDescription>
               {error && <p className="text-red-500">{error}</p>}
               {success && <p className="text-green-500">{success}</p>}
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline" disabled={isPending} className="shadow-md">
                     {tButtons("cancel")}
                  </Button>
               </DialogClose>
               <Button variant="destructive" disabled={isPending} onClick={handleDelete} className="shadow-md">
                  {isPending ? tButtons("deleting") : tButtons("delete")}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
