"use server";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import prisma from "@/app/shared/api/prisma";
import { revalidatePath } from "next/cache";
import { TConversation, conversationRowSchema } from "@/utils/zod-schemas/chat";
import { Result } from "@/types/result";
import { Message } from "@/utils/generated/client";

export const getChatWithUser = withAuth(async (
   otherUserId: string
): Promise<Result<Message[]>> => {
   const currentUser = await getUser();
   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

   const messages = await prisma.message.findMany({
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

   return { success: true, data: messages };
});

export const getConversationsWithUsers = withAuth(
  async (): Promise<TConversation[]> => {
    const currentUser = await getUser();
    if (!currentUser) return [];

   const rawConversations = await prisma.$queryRaw<TConversation[]>`
      WITH ranked_messages AS (
         SELECT 
            m.*,
            CASE 
               WHEN m."senderId" = ${currentUser.id} THEN m."receiverId"
               ELSE m."senderId"
            END as other_user_id,
            ROW_NUMBER() OVER (
               PARTITION BY 
                  CASE 
                     WHEN m."senderId" = ${currentUser.id} THEN m."receiverId"
                     ELSE m."senderId"
                  END
               ORDER BY m."createdAt" DESC
            ) as rn
         FROM messages m
         WHERE m."senderId" = ${currentUser.id} OR m."receiverId" = ${currentUser.id}
      )
      SELECT 
         rm.*,
         u.id as "otherUser_id",
         u.name as "otherUser_name",
         u."avatarImg" as "otherUser_avatarImg"
      FROM ranked_messages rm
      JOIN users u ON u.id = rm.other_user_id
      WHERE rm.rn = 1
      ORDER BY rm."createdAt" DESC
   `;

   return rawConversations.map((conv) => {
      const validated = conversationRowSchema.parse(conv);

      return {
         otherUser: {
            id: validated.otherUser_id,
            name: validated.otherUser_name,
            avatarImg: validated.otherUser_avatarImg,
         },
         lastMessage: validated.content,
         lastMessageAt: validated.createdAt,
         read: !(
            validated.receiverId === currentUser.id && !validated.read
         ),
      };
   });
},
  { unauthorizedReturn: [] as TConversation[] }
);

export const changeMessageReadStatus = withAuth(async (otherUserId: string) => {
   const currentUser = await getUser();
   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

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
   });
   revalidatePath("/messages");
   revalidatePath(`/messages/${otherUserId}`);

   return { success: true };
});

export const createMessage = withAuth(async (
   receiverId: string,
   content: string,
   listingId?: string | null
): Promise<Result<Message>> => {
   const currentUser = await getUser();
   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

   const message = await prisma.message.create({
      data: {
         senderId: currentUser.id,
         receiverId,
         content,
         listingId,
      },
   });
   revalidatePath("/messages");
   revalidatePath(`/messages/${receiverId}`);

   return { success: true, data: message };
});
