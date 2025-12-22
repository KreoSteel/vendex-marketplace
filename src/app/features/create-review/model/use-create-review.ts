"use client";
import { useEffect, useTransition, useState } from "react";
import { toast } from "sonner";
import { createReviewAction } from "../api/create-review-action";
import { Result } from "@/types/result";


export const useCreateReview = (listingId: string, revieweeId: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<Result<string> | undefined>(undefined);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("listingId", listingId || "");
        formData.append("revieweeId", revieweeId);
        startTransition(async () => {
           const result = await createReviewAction(undefined, formData);
           setState(result as Result<string>);
        });
     }
  
     useEffect(() => {
      if (!state || typeof state !== "object") return;
      
      if ("success" in state && state.success && "data" in state && typeof state.data === "string") {
         toast.success(state.data);
         setTimeout(() => setIsOpen(false), 1000);
      }
      
      if ("success" in state && !state.success && "error" in state && typeof state.error === "string") {
         toast.error(state.error);
      }
   }, [state]);

     return {
        handleSubmit,
        isPending,
        isOpen,
        setIsOpen,
     };
};