"use client";
import {
   Button,
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogDescription,
   Label,
   Input,
   Textarea,
} from "@/app/shared/ui";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateReview } from "../model/use-create-review";
import { CreateReviewFormProps } from "../model/props";

export default function CreateReviewForm({
   listingId,
   revieweeId,
}: CreateReviewFormProps) {
   const tButtons = useTranslations("buttons");
   const tDialogs = useTranslations("dialogs.createReview");
   const tForms = useTranslations("forms");
   const tFormsPlaceholders = useTranslations("forms.placeholders");
   const { handleSubmit, isPending, isOpen, setIsOpen } = useCreateReview(
      listingId,
      revieweeId
   );

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                        max={5}
                        min={1}
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
                     maxLength={250}
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
