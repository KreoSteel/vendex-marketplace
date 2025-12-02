"use client";

import { useGetChatWithUser, useSendMessage } from "@/hooks/useChat";
import { RealtimeChat } from "../../hooks/realtime-chat";
import { useMemo, useCallback } from "react";
import { ChatMessage } from "@/hooks/use-realtime-chat";
import { useTranslations } from "next-intl";

interface ChatProps {
   userId: string;
   username?: string;
   currentUserId: string;
}

export default function Chat({ userId, username, currentUserId }: ChatProps) {
   const { data: chat } = useGetChatWithUser(userId);
   const { mutateAsync: sendMessage } = useSendMessage();
   const tChatPage = useTranslations("chatPage");
   
   const handleSendMessage = useCallback(
      async (message: string) => {
         const createdMessage = await sendMessage({
            receiverId: userId,
            content: message,
            listingId: null,
         });
         return {
            id: createdMessage.id,
            content: createdMessage.content,
            user: {
               name: username ?? tChatPage("unknownUser"),
            },
            createdAt: createdMessage.createdAt.toISOString(),
         };
      },
      [userId, sendMessage, username]
   );

   const formattedMessages = useMemo<ChatMessage[] | undefined>(() => {
      if (!chat) return undefined;

      return chat.map((message) => ({
         id: message.id,
         content: message.content,
         user: {
            name: message.sender.name ?? tChatPage("unknownUser"),
         },
         createdAt: message.createdAt.toISOString(),
      }));
   }, [chat]);

   const roomName = useMemo(
      () => `chat-${[currentUserId, userId].sort().join("-")}`,
      [currentUserId, userId]
   );

   return (
      <RealtimeChat
         roomName={roomName}
         username={username ?? tChatPage("unknownUser")}
         messages={formattedMessages}
         onSendMessage={handleSendMessage}
      />
   );
}
