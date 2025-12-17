import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, Label, Input, Textarea } from "@/app/shared/ui";
import { createReviewAction } from "@/app/actions/reviews";
import { useActionState, useEffect, useTransition } from "react";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface CreateReviewFormProps {
   listingId: string;
   revieweeId: string;
}

export default function CreateReviewForm({
   listingId,
   revieweeId,
}: CreateReviewFormProps) {
   const [isPending, startTransition] = useTransition();
   const [state, formAction] = useActionState(createReviewAction, undefined);
   const tButtons = useTranslations("buttons");
   const tDialogs = useTranslations("dialogs.createReview");
   const tForms = useTranslations("forms");
   const tFormsPlaceholders = useTranslations("forms.placeholders");

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

   useEffect(() => {
      if (state && "success" in state && state.success) {
         toast.success(state.data);
      }
      if (state && "error" in state && state.error) {
         toast.error(state.error);
      }
   }, [state]);

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
               <StarIcon className="w-4 h-4" /> {tButtons("writeReview")}
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  {tDialogs("title")}
               </DialogTitle>
               <DialogDescription className="text-base text-gray-600">
                  {tDialogs("description")}
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
               <div className="space-y-3">
                  <Label htmlFor="rating" className="text-base font-medium">
                     {tForms("labels.rating")}{" "}
                     <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                     <Input
                        type="number"
                        name="rating"
                        placeholder={tFormsPlaceholders("ratingExample")}
                        required
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <Label htmlFor="comment" className="text-base font-medium">
                     {tForms("labels.comment")}{" "}
                     <span className="text-gray-400 text-sm">
                        {tForms("optional")}
                     </span>
                  </Label>
                  <Textarea
                     id="comment"
                     name="comment"
                     rows={5}
                     placeholder={tFormsPlaceholders("commentReview")}
                     className="resize-none"
                  />
               </div>

               <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isPending} className="flex-1">
                     {isPending
                        ? tButtons("submitting")
                        : tButtons("submitReview")}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
