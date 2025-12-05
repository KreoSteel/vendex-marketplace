"use client";
import { conversationsWithUserOptions } from "@/lib/query-options/messages";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { changeMessageReadStatusOptions } from "@/lib/mutations/messages";
import { TConversation } from "@/utils/zod-schemas/chat";

export default function ChatSidebar({ conversations }: { conversations: TConversation[] }) {
   const tChat = useTranslations("chat");
   const pathname = usePathname();

   const { mutate: changeMessageReadStatus } = useMutation(
      changeMessageReadStatusOptions()
   );

   const markedAsReadRef = useRef<Set<string>>(new Set());

   useEffect(() => {
      if (!conversations) return;

      const activeConversations = conversations.find(
         (conversation) => pathname === `/messages/${conversation.otherUser.id}`
      );

      if (
         activeConversations &&
         !activeConversations.read &&
         !markedAsReadRef.current.has(activeConversations.otherUser.id)
      ) {
         changeMessageReadStatus(activeConversations.otherUser.id);
         markedAsReadRef.current.add(activeConversations.otherUser.id);
      }
   }, [conversations, changeMessageReadStatus, pathname]);

   return (
      <div className="flex flex-col h-full w-full md:w-80 lg:w-96 border-r bg-white">
         <div className="p-4 border-b">
            <h2 className="text-xl font-bold">{tChat("messages")}</h2>
         </div>
         <div className="flex-1 overflow-y-auto">
            {conversations?.map((conversation) => {
               const { otherUser, lastMessage, lastMessageAt, read } =
                  conversation;
               const isActive = pathname === `/messages/${otherUser.id}`;
               return (
                  <Link
                     key={otherUser.id}
                     href={`/messages/${otherUser.id}`}
                     className={cn(
                        "flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50",
                        isActive &&
                           "bg-blue-50 hover:bg-blue-50 border-l-4 border-l-blue-500"
                     )}>
                     <div className="relative shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                           {otherUser.avatarImg ? (
                              <Image
                                 src={otherUser.avatarImg}
                                 alt={otherUser.name || "User"}
                                 width={48}
                                 height={48}
                                 className="object-cover h-full w-full"
                              />
                           ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                 {otherUser.name?.charAt(0).toUpperCase()}
                              </div>
                           )}
                        </div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="font-medium truncate text-gray-900">
                              {otherUser.name}
                           </span>
                           <span className="text-xs text-gray-500 shrink-0">
                              {new Date(lastMessageAt).toLocaleDateString()}
                           </span>
                        </div>
                        <p
                           className={cn(
                              "text-sm truncate",
                              !read
                                 ? "font-semibold text-black"
                                 : "text-gray-500"
                           )}>
                           {lastMessage?.length > 0
                              ? lastMessage
                              : tChat("noMessagesYet")}
                        </p>
                     </div>
                     {!read && (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                     )}
                  </Link>
               );
            })}
         </div>
      </div>
   );
}
