"use client";
import { mutationOptions } from "@tanstack/react-query";
import { changeMessageReadStatus } from "../api/chat-dal";
import { getQueryClient } from "@/app/shared/lib/queryClient";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";

const queryClient = getQueryClient();
 
 export const changeMessageReadStatusOptions = () =>
    mutationOptions({
       mutationKey: ["change-message-read-status"],
       mutationFn: async (otherUserId: string) => {
          return await changeMessageReadStatus(otherUserId);
       },
       onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
       },
       onError: (error) => {
          Sentry.captureException(error);
          toast.error(error instanceof Error ? error.message : "Unknown error");
       },
    });