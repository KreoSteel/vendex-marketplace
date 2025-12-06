"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { TConversation, conversationRowSchema } from "@/utils/zod-schemas/chat";

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

export async function getConversationsWithUsers(): Promise<TConversation[]> {
   const currentUser = await requireAuth();

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
         read: !(validated.receiverId === currentUser.id && !validated.read),
      };
   });
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
   });
   revalidatePath("/messages");
   revalidatePath(`/messages/${otherUserId}`);

   return { success: true };
}

export async function createMessage(
   receiverId: string,
   content: string,
   listingId?: string | null
) {
   const currentUser = await requireAuth();

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

   return message;
}
