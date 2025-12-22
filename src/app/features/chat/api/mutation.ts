import { createMessage } from "@/app/features/chat/api/chat-dal";
import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/app/shared/lib/queryClient";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { SendMessageOptions } from "../model/types";

const queryClient = getQueryClient();

export const sendMessageOptions = () =>
    mutationOptions({
       mutationKey: ["send-message"],
       mutationFn: async ({ receiverId, content, listingId }: SendMessageOptions) => {
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
 