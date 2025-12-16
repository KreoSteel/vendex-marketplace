"use client";

import { RealtimeChat } from "../../../../hooks/realtime-chat";
import { useMemo, useCallback } from "react";
import { ChatMessage } from "@/hooks/use-realtime-chat";
import { useTranslations } from "next-intl";
import { chatWithUserOptions } from "@/lib/query-options/messages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendMessageOptions } from "@/lib/mutation-options/messages";
import { Message } from "@/utils/generated/client";

interface ChatProps {
   userId: string;
   username?: string;
   currentUserId: string;
}

interface MessageWithSender {
   sender: { id: string; name: string | null; avatarImg: string | null }
}

export default function Chat({ userId, username, currentUserId }: ChatProps) {
   const { data: chat } = useQuery(chatWithUserOptions(userId));
   const { mutateAsync: sendMessage } = useMutation(sendMessageOptions());
   const tChatPage = useTranslations("chatPage");
   
   const handleSendMessage = useCallback(
      async (message: string) => {
         const createdMessage = await sendMessage({
            receiverId: userId,
            content: message,
            listingId: null,
         });
         if (!createdMessage.success) {
            return undefined;
         }
         return {
            id: createdMessage.data.id,
            content: createdMessage.data.content,
            user: {
               name: username ?? tChatPage("unknownUser"),
            },
            createdAt: createdMessage.data.createdAt.toISOString(),
         } as ChatMessage;
      },
      [userId, sendMessage, username, tChatPage]
   );

   const formattedMessages = useMemo<ChatMessage[] | undefined>(() => {
      if (!chat) return undefined;
      // If query returned an error Result shape
      if (!Array.isArray(chat)) {
         if (chat.success === false) {
            return [];
         }
         // If success is true, access the data property
         if (chat.success === true) {
            return chat.data.map((message) => {
               const messageWithSender = message as Message & MessageWithSender;
               return {
                  id: message.id,
                  content: message.content,
                  user: {
                     name: messageWithSender.sender.name ?? tChatPage("unknownUser"),
                  },
                  createdAt: message.createdAt.toISOString(),
               };
            });
         }
         return undefined;
      }

      return chat.map((message) => {
         const messageWithSender = message as Message & MessageWithSender;
         return {
            id: message.id,
            content: message.content,
            user: {
               name: messageWithSender.sender.name ?? tChatPage("unknownUser"),
            },
            createdAt: message.createdAt.toISOString(),
         };
      });
   }, [chat, tChatPage]);

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
