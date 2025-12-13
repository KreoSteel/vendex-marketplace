"use client";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogTitle,
   DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";
import { DialogDescription, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useActionState, useEffect } from "react";
import { updateUserProfileAction } from "@/app/actions/profile";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { TUserProfile } from "@/utils/zod-schemas/profile";

export default function EditProfileForm({ user }: { user: TUserProfile | null }) {
   const tDialogs = useTranslations("dialogs.editProfile");
   const tForms = useTranslations("forms.labels");
   const tButtons = useTranslations("buttons");
   const [state, formAction, isPending] = useActionState(updateUserProfileAction, undefined);
   
   useEffect(() => {
      if (state && "success" in state && state.success) {
         toast.success(state.data);
      }
      if (state && "error" in state && state.error) {
         toast.error(state.error);
      }
   }, [state]);

   if (!user) {
      return null;
   }


   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="default" size="sm">
               <PencilIcon className="size-4" />
               {tDialogs("title")}
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{tDialogs("title")}</DialogTitle>
               <DialogDescription className="text-sm text-neutral-500">
                  {tDialogs("description")}
               </DialogDescription>
            </DialogHeader>
            <form action={formAction}>
               <div className="flex flex-col gap-3 mt-4">
                  <div className="grid gap-2">
                     <Label>
                        {tForms("name")}<span className="text-red-500">*</span>
                     </Label>
                     <Input
                        name="name"
                        type="text"
                        placeholder="e.g. 'John Doe'"
                        defaultValue={user.name ?? ""}
                        disabled={isPending}
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label>
                        {tForms("location")}<span className="text-red-500">*</span>
                     </Label>
                     <Input
                        name="location"
                        type="text"
                        placeholder="e.g. 'New York, NY'"
                        defaultValue={user.location ?? ""}
                        disabled={isPending}
                     />
                  </div>
               </div>
               <DialogFooter className="mt-4">
                  <DialogClose asChild>
                     <Button variant="outline" disabled={isPending}>
                        {tButtons("cancel")}
                     </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                     {isPending ? tButtons("saving") : tButtons("saveChanges")}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
