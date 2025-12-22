import { z } from "zod";

export const conversationSchema = z.object({
   otherUser: z.object({
      id: z.string(),
      name: z.string().nullable(),
      avatarImg: z.string().nullable(),
   }),
   lastMessage: z.string(),
   lastMessageAt: z.date(),
   read: z.boolean(),
});

export const conversationRowSchema = z.object({
   id: z.string(),
   senderId: z.string(),
   receiverId: z.string(),
   content: z.string(),
   read: z.boolean(),
   createdAt: z.date(),
   otherUser_id: z.string(),
   otherUser_name: z.string().nullable(),
   otherUser_avatarImg: z.string().nullable(),
});

export const chatMessageSchema = z.object({
   id: z.string(),
   content: z.string(),
   createdAt: z.coerce.string(),
   sender: z.object({
      id: z.string(),
      name: z.string(),
      avatarImg: z.string(),
   }),
});

export type TChatMessage = z.infer<typeof chatMessageSchema>;
export type TConversationRow = z.infer<typeof conversationRowSchema>;
export type TConversation = z.infer<typeof conversationSchema>;
