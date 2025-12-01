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
import { useActionState } from "react";
import { updateUserProfileAction } from "@/app/actions/profile";
import type { User } from "@/utils/generated/client";

export default function EditProfileForm({ user }: { user: User | null }) {
   const [state, formAction, isPending] = useActionState(updateUserProfileAction, {
      error: "",
   });

   if (!user) {
      return null;
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="default" size="sm">
               <PencilIcon className="size-4" />
               Edit Profile
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Edit Profile</DialogTitle>
               <DialogDescription className="text-sm text-neutral-500">
                  Edit your profile information.
               </DialogDescription>
            </DialogHeader>
            <form action={formAction}>
               {"error" in state && state.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
               )}
               {"success" in state && state.success && (
                  <p className="text-green-500 text-sm">{state.success}</p>
               )}
               <div className="flex flex-col gap-3 mt-4">
                  <div className="grid gap-2">
                     <Label>
                        Name<span className="text-red-500">*</span>
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
                        Location<span className="text-red-500">*</span>
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
                        Cancel
                     </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                     {isPending ? "Saving..." : "Save Changes"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
