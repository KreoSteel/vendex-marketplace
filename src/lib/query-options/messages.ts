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
      refetchInterval: 3 * 1000,
      refetchOnWindowFocus: true,
   });
   

export const conversationsWithUserOptions = () =>
   queryOptions({
      queryKey: ["conversations"],
      queryFn: async () => {
         return await getConversationsWithUsers();
      },
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
   });


