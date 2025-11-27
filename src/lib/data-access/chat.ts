"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";

export async function getChatWithUser(otherUserId: string) {
   const currentUser = await requireAuth();

   return await prisma.message.findMany({
      where: {
         OR: [
            { senderId: currentUser.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUser.id },
         ],
      },
      orderBy: {
         createdAt: "asc",
      },
      include: {
         sender: {
            select: {
               id: true,
               name: true,
               avatarImg: true,
            },
         },
      },
   });
}

export async function getConversationsWithUsers() {
   const currentUser = await requireAuth();

   const messages = await prisma.message.findMany({
      where: {
         OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
      },
      orderBy: {
         createdAt: "desc",
      },
      include: {
         sender: {
            select: {
               id: true,
               name: true,
               avatarImg: true,
            },
         },
         receiver: {
            select: {
               id: true,
               name: true,
               avatarImg: true,
            },
         },
      },
   });

   const conversationsMap = new Map();

   messages.forEach((message) => {
      const otherUser =
         currentUser.id === message.senderId
            ? message.receiver
            : message.sender;

      if (conversationsMap.has(otherUser.id)) return;

      const isUnreadForMe = message.receiverId === currentUser.id && !message.read;

      conversationsMap.set(otherUser.id, {
         otherUser,
         lastMessage: message.content,
         lastMessageAt: message.createdAt,
         read: !isUnreadForMe,
      });
   });

   return Array.from(conversationsMap.values());
}

export async function changeMessageReadStatus(otherUserId: string) {
   const currentUser = await requireAuth();

   await prisma.message.updateMany({
      where: {
         senderId: otherUserId,
         receiverId: currentUser.id,
         read: false,
      },
      data: {
         read: true,
         readAt: new Date(),
      },
   })
}

export async function createMessage(
   receiverId: string,
   content: string,
   listingId?: string | null
) {
   const currentUser = await requireAuth();

   return await prisma.message.create({
      data: {
         senderId: currentUser.id,
         receiverId,
         content,
         listingId,
      },
   });
}
