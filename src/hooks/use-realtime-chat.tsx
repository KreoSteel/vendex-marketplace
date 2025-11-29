"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseRealtimeChatProps {
   roomName: string;
   username: string;
}

export interface ChatMessage {
   id: string;
   content: string;
   user: {
      name: string;
   };
   createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
   const supabase = useMemo(() => createClient(), []);
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const addedMessageIds = useRef<Set<string>>(new Set());

   useEffect(() => {
      setMessages([]);
      addedMessageIds.current.clear();

      const newChannel = supabase.channel(roomName);

      newChannel
         .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
            const message = payload.payload as ChatMessage;
            // Only add if we haven't seen this message ID before
            if (!addedMessageIds.current.has(message.id)) {
               addedMessageIds.current.add(message.id);
               setMessages((current) => [...current, message]);
            }
         })
         .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
               setIsConnected(true);
            } else {
               setIsConnected(false);
            }
         });

      channelRef.current = newChannel;

      return () => {
         supabase.removeChannel(newChannel);
      };
   }, [roomName, supabase]);

   const sendMessage = useCallback(
      async (content: string, messageId: string, createdAt: string) => {
         if (!channelRef.current || !isConnected) return;

         const message: ChatMessage = {
            id: messageId,
            content,
            user: {
               name: username,
            },
            createdAt: new Date().toISOString(),
         };

         // Track this message ID to prevent duplicate from broadcast
         addedMessageIds.current.add(message.id);

         // Update local state immediately for the sender
         setMessages((current) => [...current, message]);

         await channelRef.current.send({
            type: "broadcast",
            event: EVENT_MESSAGE_TYPE,
            payload: message,
         });
      },
      [isConnected, username]
   );

   return { messages, sendMessage, isConnected };
}
