"use client";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { TConversation } from "@/app/entities/messages-(chat)";
import prisma from "@/app/shared/api/prisma";
import { conversationRowSchema } from "@/app/entities/messages-(chat)";
import { revalidatePath } from "next/cache";

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
            read: !(validated.receiverId === currentUser.id && !validated.read),
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
