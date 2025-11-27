"use server";
import Chat from "@/components/chat/Chat";
import { getUserProfile } from "@/lib/data-access/profile";

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
   const { userId } = await params;
   const currentUser = await getUserProfile();


   return <Chat userId={userId} username={currentUser?.name ?? undefined} currentUserId={currentUser?.id ?? ""} />;
}
