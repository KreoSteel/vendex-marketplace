import { getChatWithUser } from "../api/chat-dal";
import { queryOptions } from "@tanstack/react-query";
import { Result } from "@/types/result";
import { Message } from "@/app/shared/lib/generated/client";

export const chatWithUserOptions = (otherUserId: string) =>
    queryOptions<Result<Message[]>>({
       queryKey: ["chat-with-user", otherUserId],
       queryFn: async () => {
          return await getChatWithUser(otherUserId);
       },
       refetchInterval: 3 * 1000,
       refetchOnWindowFocus: true,
    });
    