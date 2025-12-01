import {
   getChatWithUser,
   getConversationsWithUsers,
} from "../data-access/chat";
import { queryOptions } from "@tanstack/react-query";

export const chatWithUserOptions = (otherUserId: string) =>
   queryOptions({
      queryKey: ["chat-with-user", otherUserId],
      queryFn: async () => {
         return await getChatWithUser(otherUserId);
      },
      enabled: !!otherUserId,
      staleTime: 5 * 1000,
      refetchInterval: 3 * 1000,
   });
   

export const conversationsWithUserOptions = () =>
   queryOptions({
      queryKey: ["conversations"],
      queryFn: async () => {
         return await getConversationsWithUsers();
      },
      refetchInterval: 5000,
   });


