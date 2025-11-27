import { useQuery, useMutation } from "@tanstack/react-query";
import {
   chatWithUserOptions,
   conversationsWithUserOptions,
   sendMessageOptions,
   changeMessageReadStatusOptions,
} from "@/lib/queries/messages";
export const useGetChatWithUser = (otherUserId: string) => {
   return useQuery(chatWithUserOptions(otherUserId));
};

export const useGetConversations = () => {
   return useQuery(conversationsWithUserOptions());
};

export const useSendMessage = () => {
   return useMutation(sendMessageOptions());
};

export const useChangeMessageReadStatus = () => {
   return useMutation(changeMessageReadStatusOptions());
};