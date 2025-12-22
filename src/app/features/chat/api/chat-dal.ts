import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { Result } from "@/types/result";
import { Message } from "@/app/shared/lib/generated/client";
import prisma from "@/app/shared/api/prisma";
import { revalidatePath } from "next/cache";

export const getChatWithUser = withAuth(
   async (otherUserId: string): Promise<Result<Message[]>> => {
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
   }
);

export const createMessage = withAuth(
   async (
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
   }
);
