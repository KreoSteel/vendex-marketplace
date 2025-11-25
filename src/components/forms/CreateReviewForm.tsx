import { Button } from "../ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createReviewAction } from "@/app/actions/reviews";
import { useActionState, useTransition } from "react";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";

interface CreateReviewFormProps {
   listingId: string;
   revieweeId: string;
}

export default function CreateReviewForm({
   listingId,
   revieweeId,
}: CreateReviewFormProps) {
   const [isPending, startTransition] = useTransition();
   const [state, formAction] = useActionState(createReviewAction, null);

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append("rating", formData.get("rating") as string);
      formData.append("listingId", listingId || "");
      formData.append("revieweeId", revieweeId);
      startTransition(() => {
         formAction(formData);
      });
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
               <StarIcon className="w-4 h-4" /> Write Review
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  Rate this seller
               </DialogTitle>
               <DialogDescription className="text-base text-gray-600">
                  Share your experience with this seller
               </DialogDescription>
               {state && "error" in state && state.error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3">
                     <p className="text-red-700 text-sm font-medium">
                        {state.error}
                     </p>
                  </div>
               )}
               {state && "success" in state && state.success && (
                  <div className="rounded-md bg-green-50 border border-green-200 p-3">
                     <p className="text-green-700 text-sm font-medium">
                        {state.success}
                     </p>
                  </div>
               )}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
               <div className="space-y-3">
                  <Label htmlFor="rating" className="text-base font-medium">
                     Rating <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                     <Input
                        type="number"
                        name="rating"
                        placeholder="e.g. 5"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <Label htmlFor="comment" className="text-base font-medium">
                     Comment{" "}
                     <span className="text-gray-400 text-sm">(optional)</span>
                  </Label>
                  <Textarea
                     id="comment"
                     name="comment"
                     rows={5}
                     placeholder={
                        "Tell others about your experience with this seller..."
                     }
                     className="resize-none"
                  />
               </div>

               <div className="flex gap-3 pt-2">
                  <Button
                     type="submit"
                     disabled={isPending}
                     className="flex-1">
                     {isPending ? "Submitting..." : "Submit Review"}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
