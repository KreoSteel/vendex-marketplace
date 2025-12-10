"use client";
import { mutationOptions } from "@tanstack/react-query";
import { changeMessageReadStatus, createMessage } from "../data-access/chat";
import { getQueryClient } from "../queryClient";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";

export interface ISendMessageOptions {
   receiverId: string;
   content: string;
   listingId?: string | null;
}

const queryClient = getQueryClient();

export const sendMessageOptions = () =>
    mutationOptions({
       mutationKey: ["send-message"],
       mutationFn: async ({ receiverId, content, listingId }: ISendMessageOptions) => {
          return await createMessage(receiverId, content, listingId);
       },
       onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
       },
       onError: (error) => {
          Sentry.captureException(error);
          toast.error(error instanceof Error ? error.message : "Unknown error");
       },
    });
 
 
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