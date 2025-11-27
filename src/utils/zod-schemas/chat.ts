import { z } from "zod";

export const conversationSchema = z.object({
    id: z.string(),
    sender: z.object({
        id: z.string(),
        name: z.string(),
        avatarImg: z.string(),
    }),
    receiver: z.object({
        id: z.string(),
        name: z.string(),
        avatarImg: z.string(),
    }),
    lastMessage: z.string(),
    lastMessageAt: z.date(),
    unreadCount: z.number(),
})

export const chatMessageSchema = z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.coerce.string(),
    sender: z.object({
        id: z.string(),
        name: z.string(),
        avatarImg: z.string(),
    }),
})

export type Conversation = z.infer<typeof conversationSchema>;