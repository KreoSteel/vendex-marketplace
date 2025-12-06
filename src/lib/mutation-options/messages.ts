import { mutationOptions } from "@tanstack/react-query";
import { changeMessageReadStatus, createMessage } from "../data-access/chat";
import { getQueryClient } from "../queryClient";


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
          console.error(error.message);
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
          console.error(error.message);
       },
    });