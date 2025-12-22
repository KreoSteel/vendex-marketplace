import { Button } from "@/app/shared/ui/button";
import { TrashIcon } from "lucide-react";
import { deleteListingAction } from "../api/delete-listing-action";
import { useTransition } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
   DialogTrigger,
   DialogClose,
} from "@/app/shared/ui/dialog";
import { useRouter } from "@/pkg/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteListing({ listingId }: { listingId: string }) {
   const [isPending, startTransition] = useTransition();
   const tButtons = useTranslations("buttons");
   const tDialogs = useTranslations("dialogs.deleteListing");
   const router = useRouter();

   function handleDelete() {
      startTransition(async () => {
         const result = await deleteListingAction(listingId);
         if (result.success) {
            toast.success(result.data);
            router.push("/profile");
         } else if (result.error) {
            toast.error(result.error);
         }
      });
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               className="flex items-center gap-2 shadow-md">
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
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild>
                  <Button
                     variant="outline"
                     disabled={isPending}
                     className="shadow-md">
                     {tButtons("cancel")}
                  </Button>
               </DialogClose>
               <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleDelete}
                  className="shadow-md">
                  {isPending ? tButtons("deleting") : tButtons("delete")}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
