import { getConversationsWithUsers } from "../api/chat-dal";
import { queryOptions } from "@tanstack/react-query";
import { TConversation } from "@/app/entities/messages-(chat)";

export const conversationsWithUserOptions = () =>
   queryOptions<TConversation[]>({
      queryKey: ["conversations"],
      queryFn: async () => {
         return await getConversationsWithUsers();
      },
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
   });
